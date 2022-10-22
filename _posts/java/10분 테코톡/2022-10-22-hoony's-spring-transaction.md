---
title: "후니의 스프링 트랜잭션"
date: 2022-10-22 18:28:00 +0900
categories: [Java, 10분 테코톡]
tags: [java, spring]
---
> 해당 포스트는 [[10분 테코톡] 후니의 스프링 트랜잭션](https://www.youtube.com/watch?v=cc4M-GS9DoY)을 각색하여 작성되었습니다.

# 사전 지식
## 트랜잭션
DBMS 또는 유사한 시스템의 상호작용 단위.

이론적으로 DBS는 각각의 트랜잭션에 대해 ACID를 보장한다.  
하지만, 실제로는 성능향상을 위해 종종 완화하기도 한다.

## JDBC
자바에서 데이터베이스에 접속할 수 있도록 하는 자바 API.

데이터베이스에서 자료를 쿼리하거나 업데이트하는 방법을 제공한다.


# JDBC api에서의 트랜잭션
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

때문에, 비지니스 로직에서 생성한 Connection을 파라미터로 받고, `setAutoCommit()` 메서드를 통해 하나의 트랜잭션으로 관리하게 만들었다.

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

이제 비지니스 코드가 하나의 트랜잭션에서 작동하게 되었다.  
하지만, 고수준 명세인 `RobotRepository`와 고수준 모듈 `RobotService`가 저수준 모듈 `RobotRepositoryImpl`에 의존하게 되어버렸다.

즉, 추상화가 세부 명세에 의존하게 되고 고수준 모듈이 저수준 모듈에 의존하게 되어

**DIP가 깨져버린 것이다.**

단순히 JDBC를 JPA로 변경해보자.

변경된 기술에 따라 저수준 모듈을 바꾸었을 뿐인데 `RobotRepository`와 `RobotService`까지 영향을 받게됐다.
```java
public interface RobotRepository {
    void move(EntityManager em, Long id, Position position);
}
```

이 뿐만 아니라 비즈니스 로직이 다른 관심사의 일을 수행하게 되어 **악취 나는 코드**가 되어버렸다.

# 스프링 트랜잭션 기술
스프링은 위의 문제점을 개선할 수 있도록 3가지 스프링 트랜잭션 관리 기법을 선보인다.
1. 트랜잭션 동기화
2. 트랜잭션 추상화
3. 선언적 트랜잭션


## 트랜잭션 동기화
Spring JDBC에서 제공하는 `DataSourceUtils`을 이용해 connection을 생성하면 thread safe한 트랜잭션 동기화 매니저에 저장된다.

이 경우 `JdbcTemplate`이 쿼리를 날릴 때 트랜잭션 동기화 매니저에서 connection을 가져오게 된다.

즉, 파라미터를 제거하면서 하나의 트랜잭션으로 관리할 수 있게 된것이다.

하지만, 이 방법은 `JdbcTemplate`이 `DataSourceUtils`를 이용해 connection을 가져오거나 생성하기 때문에 가능한 것이다.
그러므로 아직 기술에 의존적인 코드다.


## 트랜잭션 추상화
DataSource 기술들은 아래와 같은 것들을 이용해 DB와의 connection을 만든다.
- JDBC는 Connection
- JPA는 EntityManager
- Hibernate는 Sesstion


하지만, 가져오는 트랜잭션의 형태만 다를 뿐 아래와 같은 동일한 임무를 수행한다.
1. 트랜잭션을 가져온다 / 생성한다.
2. 해당 트랜잭션을 commit 한다.
3. 해당 트랜잭션을 rollback 한다.

즉, 추상화가 가능한 것이다.

```java
public interface PlatformTransactionManager extends TransactionManager {
    TransactionStatus getTransaction(TransactionDefinition definition) throws TransactionException;

    void commit(TransactionStatus status) throws TransactionException;

    void rollback(TransactionStatus status) throws TransactionException;
}
```

이제 `TransactionManager`를 DI하여 사용할 수 있게 되고,  
기본 트랜잭션 속성으로 트랜잭션을 생성할 수 있게 되었다.

하지만, 아직도 비지니스 로직은 트랜잭션 가져오기, 커밋, 롤백과 같은 다른 관심사의 일을 하고 있다.


## 선언적 트랜잭션
그래서 스프링은 스프링 AOP를 통해 구현한 `@Transactional`을 이용해 트랜잭션 경계 설정 코드를 비지니스 로직과 분리하도록 하였다.


# 스프링 트랜잭션 속성
## propagation
트랜잭션을 시작하거나 기존 트랜잭션에 참여하는 방법을 결정하는 속성

### REQUIRED
propagation의 default 속성이다.

트랜잭션이 있으면 참여하고, 없으면 새로 시작한다.

### REQUIRES_NEW
항상 새로운 트랜잭션을 시작한다.

진행 중인 트랜잭션이 있다면 트랜잭션을 잠시 보류한다.

### SUPPORTS
이미 트랜잭션이 있다면 참여한다.

트랜잭션이 없다면 트랜잭션 없이 진행한다.

### NESTED
이미 진행 중인 트랜잭션이 있으면 중첩 트랜잭션을 시작한다.

부모 트랜잭션의 커밋, 롤백엔 영향을 받지만 자신의 커밋, 롤백은 부모 트랜잭션에 영향을 주지 못한다.

### NEVER
트랜잭션을 사용하지 않게 한다.

트랜잭션이 존재하면 예외를 발생한다.

### NOT_SUPPORTED
트랜잭션을 사용하지 않게 한다.

트랜잭션이 있다면 트랜잭션을 보류한다.

---

## isolation
여러 트랜잭션이 진행될 때에 트랜잭션의 작업 결과를 타 트랜잭션에게 어떻게 노출할지 결정한다.

### DEFAULT
사용하는 데이터 접근 기술, DB 드라이버의 기본 설정이다.

Oracle은 `READ_COMMITED`, Mysql은 `REPEATABLE_READ`를 기본 격리 수준으로 가진다.

### READ_UNCOMMITED
커밋하지 않아도 다른 트랜잭션에 데이터를 노출한다.

### READ_COMMITED
커밋하지 않으면 다른 트랜잭션에 데이터를 노출하지 않는다.

### REPEATABLE_READ
트랜잭션이 시작할 때 스냅샷을 만들어 트랜잭션이 시작할 때의 정보만 이용한다.

즉, 다른 트랜잭션에서 데이터를 변경하여도 현재 트랜잭션이 커밋된 후에 변경된 정보를 확인할 수 있다.

### SERIALIZABLE
현재 실행중인 트랜잭션이 커밋되기 전에 다른 트랜잭션이 실행되지 않는다.

즉, 트랜잭션 1이 커밋된 후에 트랜잭션 2가 실행된다.

---

## timeout
트랜잭션을 수행하는 제한 시간을 설정한다.

기본 옵션에는 제한시간이 없다.


## readOnly
트랜잭션 내에서 데이터를 조작하려는 시도를 막는다.

데이터 접근 기술, 사용 DB에 따라 적용했을 때 차이가 있다.
- 구현이 되어있지 않을 경우: 데이터를 조작하여도 예외가 발생하지 않는다.
- 구현이 되어있는 경우: 트랜잭션 오버헤드가 줄어들어 성능이 개선된다.


## rollback-for
기본적으로 트랜잭션은 `RuntimeException` 발생 시 롤백된다.

체크 예외이지만 롤백 대상으로 삼고 싶을 때 사용한다.


## no-rollback-for
롤백 대상인 `RuntimeException`을 커밋 대상으로 지정하고 싶을 때 사용한다.