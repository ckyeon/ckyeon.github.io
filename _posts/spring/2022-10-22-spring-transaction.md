---
title: "스프링 트랜잭션"
date: 2022-10-22 18:28:00 +0900
categories: [Spring, Core]
tags: [spring, core, transaction]
---
> 해당 포스트는 [[10분 테코톡] 후니의 스프링 트랜잭션](https://www.youtube.com/watch?v=cc4M-GS9DoY){:target="_blank"}을 각색하여 작성되었습니다.

## 사전 지식
### 트랜잭션
DBMS 또는 유사한 시스템의 상호작용 단위.

이론적으로 DBS는 각각의 트랜잭션에 대해 ACID를 보장한다.  
하지만, 실제로는 성능향상을 위해 종종 완화하기도 한다.

### JDBC
자바에서 데이터베이스에 접속할 수 있도록 하는 자바 API.

데이터베이스에서 자료를 쿼리하거나 업데이트하는 방법을 제공한다.


## JDBC api에서의 트랜잭션
DB를 이용해 로봇이 움직이는 기능을 구현하라는 요구 사항을 받았다.  
때문에, JDBC api를 이용해 아래의 코드를 작성하였다.

```java
@Getter
public class Position {
    private final int x;
    private final int y;

    private Position(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void change(int x, int y) {
        return new Position(x, y);
    }
}
```

```java
@Service
@RequiredArgsConstructor
public class RobotService {
        
    private final RobotRepository robotRepository;

    void move(Long id, Position position) {
        // move를 두 번하는 비지니스 로직
    }
}
```

```java
public interface RobotRepository {
    void move(Long id, Position position);
}
```

```java
@Repository
public class RobotRepositoryImpl {
    public void move(Long id, Position position) throws SQLException {
        Connection conn = null;
        PreparedStatement pstmt = null;
        // ...중략
        try {
            conn = getConnection();
            pstmt = conn.preparedStatement(UPDATE_SQL);
            // ...중략
            conn.commit();
        } catch(SQLException e) {
            conn.rollback();
        } finally {
            pstmt.close();
            conn.close();
        }
    }
}
```

하지만, 이 경우 하나의 비지니스 로직에 두 개의 트랜잭션이 생기게 된다.

때문에, 비지니스 로직에서 생성한 Connection을 파라미터로 받도록하고,  
비지니스 로직에 트랜잭션 경계 설정 코드를 추가하였다.

```java
@Service
@RequiredArgsConstructor
public class RobotService {
        
    private final RobotRepository robotRepository;

    void move(Long id, Position position) {
        Connection conn = getConnection();
        conn.setAutoCommit(false);
        try {
            // move를 두 번하는 비지니스 로직
            conn.commit();
        } catch (Exception e) {
            conn.rollback();
        } finally {
            conn.setAutoCommit(true);
            conn.close();
        }
    }
}
```

```java
public interface RobotRepository {
    void move(Connection conn, Long id, Position position);
}
```

```java
@Repository
public class RobotRepositoryImpl {
    public void move(
        Connection connection, 
        Long id, 
        Position position
    ) throws SQLException {
        PreparedStatement pstmt = null;
        // ...중략
        pstmt = conn.preparedStatement(UPDATE_SQL);
    }
}
```

이제 비지니스 코드가 하나의 트랜잭션에서 작동하게 되었다.  

하지만, 고수준 명세인 `RobotRepository`와 고수준 모듈 `RobotService`가  
저수준 모듈 `RobotRepositoryImpl`에 의존하게 되어버렸다.

즉, 추상화가 세부 명세에 의존하게 됨과 동시에 고수준 모듈이 저수준 모듈에 의존하게 된 것이다.

**DIP가 깨져버린 것이다.**

단순히 JDBC를 JPA로 변경해보자.

변경된 기술에 따라 저수준 모듈을 바꾸었을 뿐인데 `RobotRepository`와 `RobotService`까지 영향을 받게되었다.

```java
public interface RobotRepository {
    void move(EntityManager em, Long id, Position position);
}
```
> 사실 EntityManager는 의존성 주입을 받을 수 있기 때문에 파라미터로 받을 필요가 없습니다.  
> 위의 코드는 DIP 깨짐을 좀 더 명시적으로 표현하기 위함이니 참고 바랍니다.

이 뿐만 아니라 비즈니스 로직이 다른 관심사의 일을 수행하게 되어 **악취 나는 코드**가 되어버렸다.

## 스프링 트랜잭션 기술
스프링은 위의 문제점을 개선할 수 있도록 3가지 스프링 트랜잭션 관리 기법을 선보인다.
1. 트랜잭션 동기화
2. 트랜잭션 추상화
3. 선언적 트랜잭션


### 트랜잭션 동기화
Spring JDBC에서 제공하는 `DataSourceUtils`을 이용해 connection을 생성하면 thread safe한 트랜잭션 동기화 매니저에 저장된다.

이 경우 `JdbcTemplate`이 쿼리를 날릴 때 트랜잭션 동기화 매니저에서 connection을 가져오게 된다.

```java
@Service
@RequiredArgsConstructor
public class RobotService {
        
    private final RobotRepository robotRepository;

    void move(Long id, Position position) {
        TransactionSynchronizationManager.iniSynchronization();
        Connection conn = DataSourceUtils.getConnection(dataSource);
        conn.setAutoCommit(false);

        try {
            // move를 두 번하는 비지니스 로직
            conn.commit();
        } catch (Exception e) {
            conn.rollback();
        } finally {
            DataSourceUtils.releaseConnection(conn, datasource);
            TransactionSynchronizationManager.unbindResource(dataSource);
            TransactionSynchronizationManger.clearSynchronization();
        }
    }
}
```

즉, 파라미터를 제거하면서 하나의 트랜잭션으로 관리할 수 있게 된것이다.

하지만, 이 방법은 `JdbcTemplate`이 내부적으로 `DataSourceUtils`를 이용해 connection을 가져오기 때문에 가능한 것이다.
그러므로 아직 기술에 의존적인 코드다.


### 트랜잭션 추상화
DataSource 기술들은 아래와 같은 것들을 이용해 DB와의 connection을 만든다.
- JDBC는 Connection
- JPA는 EntityManager
- Hibernate는 Session

하지만, 가져오는 트랜잭션의 형태만 다를 뿐 아래와 같은 동일한 임무를 수행한다.
1. 트랜잭션을 가져온다 / 생성한다.
2. 해당 트랜잭션을 commit 한다.
3. 해당 트랜잭션을 rollback 한다.

즉, **추상화**가 **가능**한 것이다.

스프링은 아래와 같은 인터페이스를 만들어 각 구현체들이 트랜잭션을 가져오는 방식을 추상화하였다.
```java
public interface PlatformTransactionManager extends TransactionManager {
    TransactionStatus getTransaction(TransactionDefinition definition) throws TransactionException;

    void commit(TransactionStatus status) throws TransactionException;

    void rollback(TransactionStatus status) throws TransactionException;
}
```

이제 `TransactionManager`를 DI하여 사용할 수 있게 되고,  
기본 트랜잭션 속성으로 트랜잭션을 생성할 수 있게 되었다.

하지만, 아직도 우리의 비지니스 로직은 트랜잭션 가져오기, 커밋, 롤백과 같은 다른 관심사의 일을 하고 있다.


### 선언적 트랜잭션
그래서 스프링은 스프링 AOP를 통해 구현한 `@Transactional`을 이용해 트랜잭션 경계 설정 코드를 비지니스 로직과 분리하도록 하였다.

```java
@Service
@RequiredArgsConstructor
public class RobotService {
        
    private final RobotRepository robotRepository;

    @Transactional
    void move(Long id, Position position) {
        // move를 두 번하는 비지니스 로직
    }
}
```

드디어 우리의 비지니스 로직이 알맞은 관심사의 일만 할 수 있게 되었다. 👍

또한, 고수준 모듈과 명세가 저수준 모듈의 영향을 받지 않게 되었다. 👍👍


## 스프링 트랜잭션 속성
> 글로 작성할 경우 단순한 속성의 나열에 불과하기 때문에 작성하지 않았습니다.  
> 해당 파트는 [원본 영상](https://youtu.be/cc4M-GS9DoY?t=482){:target="_blank"}을 참고해 주시면 감사하겠습니다.