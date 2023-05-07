---
title: "Wrapper Class"
date: 2022-10-26 17:16:00 +0900
categories: [Java, API]
tags: [java, "java api"]
---

## Wrapper Class
기본 타입(Primitive Type)에 해당하는 데이터를 객체로 포장해 주는 클래스.

기본 타입의 데이터를 객체로 취급해야 하는 경우가 있을 때 사용한다.

### Wrapper Class는 불변 객체이다.

Wrapper Class는 산술 연산을 위해 정의된 클래스가 아니므로, 인스턴스에 저장된 값을 변경할 수 없다.

즉, **불변 객체(Immutable Object)**다.

단지, 값을 참조하기 위해 새로운 인스턴스를 생성하고, 생성된 인스턴스의 값을 참조할 뿐이다.

### Wrapper Class는 산술 연산을 위해 정의된 클래스가 아니다.

여기서 '`Integer.sum()`, `Integer.max()` 와 같은 메소드는 산술 연산이 아닌가?' 라는 의문을 가질 수 있다.
```java
public final class Integer extends Number implements<Integer>, Constable, ConstantDesc {
    
    private final int value;

    // ...중략

    public static int sum(int a, int b) {
        return a + b;
    }

    public static int max(int a, int b) {
        return Math.max(a, b);
    }

    public static int min(int a, int b) {
        return Math.min(a, b);
    }
}
```

내부적으로 Integer Wrapper Class를 보면 int를 받아 계산하거나, Math 클래스로 역할을 위임함을 알 수 있다.

### 자바에서 제공하는 Wrapper Class

|Primitive Type|Wrapper Class|
|:---:|:---:|
|byte|Byte|
|short|Short|
|int|Integer|
|long|Long|
|float|Float|
|double|Double|
|char|Character|
|boolean|Boolean|

## Boxing과 UnBoxing
Primitive Type의 데이터를 Wrapper Class의 인스턴스로 변환하는 과정을 **Boxing**이라고 하고,  
Wrapper Class의 인스턴스에 저장된 값을 다시 Primitive Type의 데이터로 꺼내는 과정을 **UnBoxing**이라 한다.

### AutoBoxing과 AutoUnBoxing
JDK 1.5부터는 Boxing과 UnBoxing이 필요한 상황에서 자바 컴파일러가 이를 자동으로 처리해 준다. 

이렇게 자동화된 Boxing과 UnBoxing을 **AutoBoxing**과 **AutoUnBoxing**이라 부른다.

### AutoBoxing을 주의해야 하는 이유

편리한 기능이긴 하지만 성능이 저하되는 문제가 존재하므로 오토 박싱이 자주 일어나는 로직은 지양해야 한다.

```java
public void SumWithAutoBoxing() {

    long beginTime = System.currentTimeMillis();

    Integer sum = 0;
    for (int i = 0; i < 1000000; i++) {
        sum += i;   // 오토 박싱
    }

    long endTime = System.currentTimeMillis();
    
    System.out.println((endTime - beginTime) + " ms");
    // 8 ms
}
```

```java
public void SumWithPrimitiveType() {

    long beginTime = System.currentTimeMillis();

    int sum = 0;
    for (int i = 0; i < 1000000; i++) {
        sum += i;
    }

    long endTime = System.currentTimeMillis();

    System.out.println((endTime - beginTime) + " ms");
    // 2 ms
}
```
대략 4배의 성능 차이가 나는 것을 알 수 있다.

## Wrapper Class의 비교 연산
Wrapper Class의 비교 연산은 AutoUnBoxing이 일어나기 때문에 가능하다.


```java
public void CompareWrapperClass() {
    Integer integer1 = 20;
    Integer integer2 = 30;
    Integer integer3 = 30;

    System.out.println(integer1 < integer2);
    // true

    System.out.printlne(integer1 > integer2);
    // false

    System.out.println(integer2 == integer3);
    // false

    System.out.println(integer2.equals(integer3));
    // true
}
```
Wrapper Class는 기본적으로 객체이므로 `==` 연산자를 사용하게 되면, 인스턴스에 저장된 값을 비교하는 것이 아니라 두 인스턴스의 주소값을 비교하게 된다.  

즉, **AutoUnBoxing이 일어나지 않는다.**

때문에, `equals()` 메소드를 사용해야 한다.
