---
title: Python
date: 2021-02-07 23:27:40 +0900
categories: [Study, algorithm]
tags: [study, python, algorithm]
toc: true
---
## 개요
---
```
Python으로 알고리즘을 공부한 내용을 정리한 글이다.
```
---



## 시간 복잡도와 공간 복잡도

### 시간 복잡도
---
```
입력 값과 문제를 해결하는 데 걸리는 시간과의 상관관계를 말한다.
```
> 입력 값이 늘어나도 걸리는 시간이 덜 늘어나는 알고리즘이 좋은 알고리즘이다.

> 각 줄이 실행되는 걸 1번의 연산이 된다고 생각하며, 입력 값의 길이를 N이라고 한다.

```python
    for num in array:              # array의 길이(N)만큼 아래 연산이 실행
        for compare_num in array:  # array의 길이(N)만큼 아래 연산이 실행
            if num < compare_num:  # 비교 연산 1번 실행
                break
        else:
            return max_num
```
> N^2의 연산량이 필요하다

```python
    max_num = array[0] # 연산 1번 실행

    for num in array:      # array의 길이(N)만큼 아래 연산이 실행
		    if num > max_num:  # 비교 연산 1번 실행
		        max_num = num  # 대입 연산 1번 실행
```
> 1 + 2N의 연산량이 필요하다


상수는 신경 쓰지말고, 입력값에 비례하여 얼마나 증가하는지 알기 위해 N만 신경쓰면 된다.
<br/>그러므로, 위의 두 코드는 N^2과 N을 비교하면 되는 것이다.


### 공간 복잡도
---
```
입력값과 문제를 해결하는 데 걸리는 공간과의 상관관계를 말한다.
```
> 공간이 적게 걸리는 알고리즘이 더 좋은 알고리즘이지만

> 공간 복잡도보다는 시간 복잡도를 우선해야 한다.

## 점근 표기법
    알고리즘의 성능을 수학적으로 표기해 알고리즘의 "효율성"을 평가하는 방법이다.

### 빅오(Big-O) 표기법
---
    최악의 성능이 나올 때 어느 정도의 연산량이 필요한 것인지 표기

### 빅 오메가(Big-Ω) 표기법
---
    최선의 성능이 나올 때 어느 정도의 연산량이 걸릴것인지에 대해 표기

알고리즘에서는 거의 모든 알고리즘을 빅오 표기법으로 분석한다.
<br/>입력값이 최선일 경우는 매우 적을 뿐더러, 최악의 경우를 대비해야 하기 때문이다.

---
---



## Array와 LinkedList

### Array
---
```
배열은 크기가 정해진 데이터의 공간이다. 
```
> 한 번 정해지면(선언하면) 바꿀 수 없다.

```
원소의 순서는 0부터 시작하고 이를 인덱스라고 부른다.
```
> 배열은 각 원소에 즉시 접근할 수 있다. (O(1)내에 접근 가능) 

```
배열의 중간에 원소를 삽입/삭제 하려면 모든 원소를 다 옮겨야한다.
```
> 최악의 경우 배열의 길이 N만큼 옮겨야 한다.

```
원소를 새로 추가하려면, 새로운 공간을 할당해야 한다.
```
> 원소를 추가할 때는 매우 비효율적인 자료구조가 된다.

### LinkedList
---

```
링크드 리스트는 크기가 정해지지 않은 데이터의 공간이다. 
```
> 연결 고리로 이어주면 자유자재로 늘어날 수 있다.

```
링크드 리스트는 특정 원소에 접근하려면 연결 고리를 따라 탐색해야 한다. 
```
> 최악의 경우 링크드리스트의 길이 N만큼 탐색해야 한다.

```
링크드 리스트는 원소를 중간에 삽입/삭제 하기 위해서는 앞 뒤의 포인터만 변경하면 된다.
```
> 원소의 삽입/삭제를 O(1)의 시간 복잡도안에 할 수 있다.

#### LinkedList 구현
---

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self, value):
        self.head = Node(value)

    def append(self, value):
        while cur.next is not None: //cur의 다음 노드가 None이 아닐 때까지 반복
            cur = cur.next
        cur.next = Node(value)

    def print_all(self):
        cur = self.head

        while cur is not None:  //cur이 None이 아닐 때까지 반복
            print(cur.data)
            cur = cur.next
    
    def get_node(self, index):
        cur = self.head
        count = 0

        while count < index:
            cur = cur.next
            count += 1  
        return cur
        
    def add_node(self, index, value):
        new_node = Node(value)

        if index == 0:
            new_node.next = self.head
            self.head = new_node
            return

        node = self.het_node(index - 1)
        next_node = node.next
        node.next = new_node
        new_node.next = next_node

    def delete_node(self, index):
        if index == 0:
            self.head = self.head.next
            return
        
        previous_delete_node = self.get_node(index - 1)
        previous_delete_node.next = previous_delete_node.next.next
```

### Array vs LinkedList
---

 경우 | Array | LinkedList |
 :----- | :----- | :----- |
 특정 원소 조회 | O(1) | O(N) 
 중간에 삽입 삭제 | O(N) | O(1)
 데이터 추가 | 데이터 추가 시 모든 공간이 다 차버렸다면<br> 새로운 메모리 공간을 할당받아야 한다. | 모든 공간이 다 찼어도<br> 맨 뒤의 노드만 동적으로 추가하면 된다.
 정리 | 데이터에 접근하는 경우가 빈번하다면<br> **Array**를 사용하자 | 삽입과 삭제가 빈번하다면<br> **LinkedList**를 사용하는 것이 더 좋다

---
---



## 이진 탐색
---
```
데이터가 정렬되어 있는 배열에서 특정한 값을 찾아내는 알고리즘이다.
```
> 찾고자하는 값 x와 중간 값을 비교하여 작으면 좌측의 데이터들을 대상으로,
> <br/>크면 우측의 데이터들을 대상으로 다시 탐색한다. 
>> 찾고자하는 값 X를 찾을 때까지 **위의 과정을 반복**한다.




![binary-and-linear-search](/assets/img/algorithm/binary-and-linear-search.gif)

### 이진 탐색 구현
---
```python
def is_existing_target_number_binary(target, array):
    array_len = len(array)   
    low_index = 0
    high_index = array_len - 1
    middle_index = (low_index + high_index) // 2
    
    while low_index <= high_index:
        if middle_index == target:
            return True
        elif array[middle_index] < target:
            low_index = middle_index + 1
        else:
            high_index = middle_index - 1
        middle_index = (low_index +high_index) // 2

    return False
```

---
---



## 재귀 함수

### 재귀란?
---
```
어떠한 것을 정의할 때 자기 자신을 참조하는 것을 뜻한다.
```

> 재귀 함수는 **자기 자신을 호출하는 함수**다.

> 재귀 함수는 반드시 함수를 빠져나가는 **탈출 지점을 명확하게 정해줘야 한다.**

### 재귀 함수 예시
---
```python
// factorial
def factorial(n):
    if n == 1:      // 탈출 지점
        return 1

    return n * factorial(n - 1)
```

---
---



## 정렬

### 정렬이란?
---
```
데이터를 순서대로 나열하는 방법을 의미한다.
```

### 정렬의 종류
---

#### **버블 정렬**
```
n번째 자료와 n+1 번째 자료를 비교하고, 교환하면서 자료를 정렬하는 방식이다.
```
![bubble-sort](/assets/img/algorithm/bubble-sort.gif)

##### 버블 정렬 구현
```python
def bubble_sort(array):
    n = len(array)
    for i in range(n):
        for j in range(n - i - 1):
            if array[j] > array[j + 1]:
                array[j], array[j + 1] = array[j + 1], array[j]
    return array
```
 
---

#### **선택 정렬**
```
제일 작거(내림차순)나 큰(오름차순) 수를 차례대로 선택해서 순서대로 정렬하는 방식이다.
```
![selection-sort](/assets/img/algorithm/selection-sort.gif)

##### 선택 정렬 구현
```python
def selection_sort(array):
    n = len(array)
    for i in range(n - i):
        min_index = i
        for j in range(n - i):
            if array[i + j] < array[min_index]:
                min_index = i + j

        array[i], array[min_index] = array[min_index], array[i]
    
    return array
```

---

#### **삽입 정렬**
```
전체에서 하나씩 올바른 위치에 삽입해 정렬하는 방식이다.
```
![insertion-sort](/assets/img/algorithm/insertion-sort.gif)
##### 삽입 정렬 구현
```python
def insertion_sort(array):
    n = len(array)
    for i in range(1, n):
        for j in range(i):
            if array[i - j - 1] > array[i - j]:
                array[i - j - 1], array[i - j] = array[i - j ], array[i - j - 1]
            else:
                break
    return array
        
```

---

#### **병합 정렬**
```
배열을 앞 부분과 뒷 부분의 두 그룹으로 나누며 각각 정렬한 후 병합하는 방식이다.
```
![merge-sort](/assets/img/algorithm/merge-sort.png)

##### 병합 정렬 구현
```python
def merge_sort(array):
    if len(array) <= 1:
        return array

    mid = len(array) // 2
    left_array = array[:mid]
    right_array = array[mid:]
    
    return merge(merge_sort(left_array), merge_sort(right_array))

def merge(array1, array2)
    result = []
    array1_index = 0
    array2_index = 0

    while array1_index < len(array1) and array2_index < len(array2):
        if array[array1_index] < array2[array2_index]:
            result.append(array1[arrray1_index])
            array1_index += 1
        else:
            result.append(array2[array2_index])
            array2_index += 1
        
    if array1_index == len(array1):
        while array2_index < len(array2):
            result.append(array2[array2_index])
            array2_index += 1
    
    if array2_index == len(array2):
        while array1_index < len(array1):
            result.append(array1[array1_index])
            array1_index += 1

    return result
```

---
---
## 스택

### 스택이란?
---
```
한쪽 끝으로만 자료를 넣고 뺄 수 있는 자료 구조다.
```
>LIFO(Last In First Out) 라고도 불린다.

![stack](/assets/img/algorithm/stack.png)

### 스택 구현
---
```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class Stack:
    def __init__(self):
        self.head = None

    def push(self, value):  # 맨 위에 데이터 넣기  (실전에서는 .append()로 사용)
        new_head = Node(value)
        new_head.next = self.head
        self.head = new_head

    def pop(self):  # 맨 위에 있는 데이터 뽑기
        if self.is_empty():
            return "Stack is empty."
        delete_head = self.head
        self.head = self.head.next
        return delete_head.data

    def peek(self): # 맨 위에 있는 데이터 보기
        if self.is_empty():
            return "Stack is empty."
        return self.head.data

    def is_empty(self): # 스택이 비었는지 체크
        return self.head is None
```
---
---



## 큐

### 큐란?
---
```
한쪽 끝으로 자료를 넣고, 반대쪽에서 자료를 뺄 수 있는 선형구조다.
```
>FIFO(First In First Out) 라고도 불린다.

![queue](/assets/img/algorithm/queue.png)

### 큐 구현
---
```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class Queue:
    def __init__(self):
        self.head = None
        self.tail = None

    def enqueue(self, value):   # 맨 뒤에 데이터 추가
        new_node = Node(value)
        if self.is_empty():
            self.head = new_node
            self.tail = new_node
            return

        self.tail.next = new_node
        self.tail = new_node


    def dequeue(self):  # 맨 앞의 데이터 뽑기
        if self.is_empty():
            return "Queue is empty."

        delete_head = self.head
        self.head = self.head.next

        return delete_head.data

    def peek(self):     # 맨 앞의 데이터 보기
        if self.is_empty():
            return "Queue is empty."
        
        return self.head.data

    def is_empty(self): # 큐가 비었는지 체크
        return self.head is None
```

---
---



## 해쉬

### 해쉬 테이블이란?
---
```
키를 값에 매핑할 수 있는 구조인, 연관 배열 추가에 사용되는 자료 구조다.
```
> 데이터를 다루는 기법 중 하나로, 데이터의 검색과 저장이 매우 빠르게 진행된다.

> 시간은 빠르되 공간을 대신 사용한다.

![linked_dict](/assets/img/algorithm/linked-dict.png)

### 해쉬 테이블 구현
---
```python
class LinkedTuple:      # 해쉬 테이블의 충돌을 해결하는 방법
    def __init__(self):
        self.items = []

    def add(self, key, value):
        self.items.append((key, value))

    def get(self, key):
        for k, v in self.items:
            if k == key:
                return v

class LinkedDict:   
    def __init__(self):
        self.items = []
        for i in range(8):
            self.items.append(LinkedTuple())

    def put(self, key, value):
        index = hash(key) % len(self.items)
        self.items[index].add(key, value)

    def get(self, key):
        index = hash(key) % len(self.items)
        return self.items[index].get(key)
```


---
---



## 트리

### 트리란?
---
```
뿌리와 가지로 구성되어 거꾸로 세워놓은 나무처럼 보이는 계층형 비선형 자료 구조다.
```
> Queue와 Stack은 선형 구조다.

> 선형 구조는 자료를 저장하고 꺼내는 것에 초점이 맞춰져 있고,
> <br/>비선형 구조는 표현에 초점이 맞춰져 있다.

![tree](/assets/img/algorithm/tree.png)

### 이진 트리와 완전 이진 트리
---
```
이진 트리: 각 노드가 최대 두 개의 자식을 가지는 트리.

완전 이진 트리: 노드를 삽입할 때 최하단 왼쪽 노드부터 차레대로 삽입하는 이진 트리.
```
> 완전 이진 트리를 사용할 경우 ```배열```로 표현할 수 있다.

### 완전 이진 트리 배열로 표현
---
```python
      8      Level 0 -> [None, 8]
    6   3    Level 1 -> [None, 8, 6, 3]
   4 2 5     Level 2 -> [None, 8, 6, 3, 4, 2, 5]
```
```
1. 현재 인덱스 * 2 -> 왼쪽 자식의 인덱스
2. 현재 인덱스 * 2 + 1 -> 오른쪽 자식의 인덱스
3. 현재 인덱스 // 2 -> 부모의 인덱스
```

---
---



## 힙

### 힙이란?
---
```
데이터에서 최대값과 최소값을 빠르게 찾기 위해 고안된 완전 이진 트리다.
```
> Max Heap: 항상 큰 값이 상위 레벨에 있고, 작은 값이 하위 레벨에 있도록 하는 자료 구조.

> Min Heap: 항상 작은 값이 상위 레벨에 있고, 큰 값이 하위 레벨에 있도록 하는 자료 구조.

![heap](/assets/img/algorithm/heap.png)

### Max Heap 구현
---
```python
class MaxHeap:
    def __init__(self):
        self.items = [None]

    def insert(self, value):
        self.items.append(value)
        cur_index = len(self.items) - 1

        while cur_index > 1:
            parent_index = cur_index // 2
            
            if self.items[parent_index] < self.items[cur_index]:
                self.items[parent_index], self.items[cur_index] = self.items[cur_index], self.items[parent_index]
                cur_index = parent_index
            else:
                break

    def delete(self):
        self.items[1], self.items[-1] = self.items[-1], self.items[1]
        prev_max = self.items.pop()
        cur_index = 1

        while cur_index < len(self.items):
            left_child_index = cur_index * 2
            right_child_index = cur_index * 2 + 1
            max_index = cur_index

            if left_child_index <= len(self.items) - 1 and self.items[left_child_index] > self.items[max_index]:
                max_index = left_child_index

            if right_child_index <= len(self.items) - 1 and self.items[right_child_index] > self.items[max_index]:
                max_index = right_child_index
            
            if max_index == cur_index:
                break

            self.items[cur_index], self.items[max_index] = self.items[max_index], self.items[cur_index]
            cur_index = max_index

        return prev_max
```

---
---

## 그래프

### 그래프란?
---
```
연결되어 있는 정점과 정점간의 관계를 표현할 수 있는 자료구조다.
```
> 그래프는 연결 관계에 초점이 맞춰져 있다.

![graph](/assets/img/algorithm/graph.png)

![graph_direct](/assets/img/algorithm/graph-direction.png)

> 유방향 그래프: 방향이 있는 간선을 갖는다.

> 무방향 그래프: 방향이 없는 간선을 갖는다.

### 무방향 그래프의 표현
---
```python
          2 - 3
          ⎜      
      0 - 1

# 배열로 표현
graph = [
    [False, True, False, False],
    [True, False, True, False],
    [False, True, False, True],
    [False, False, True, False]
]

# 인접 리스트로 표현
graph = {
    0: [1],
    1: [0, 2]
    2: [1, 3]
    3: [2]
}
```

---
---

## DFS

### DFS란?
---
```
한 노드를 시작으로 인접한 다른 노드를 재귀적으로 탐색해 
끝까지 탐색하면 다시 위로 돌아와 다음을 탐색하는 방법이다.
```

![dfs](/assets/img/algorithm/dfs.gif)

### DFS 구현
---
```python
graph = {
    # 인접 리스트 방식의 그래프
}
visited = []

# 재귀 함수로 구현
def dfs_recursion(adjacent_graph, cur_node, visited_array):
    visited_array.append(cur_node)

    for adjacent_node in adjacent_graph[cur_node]:
        if adjacent_node not in visited_array:
            dfs_recursion(adjacent_graph, adjacent_node, visited_array)

# Stack으로 구현
def dfs_stack(adjacent_graph, start_node):
    stack = [start_node]
    visited = []

    while stack:
        current_node = stack.pop()
        visited.append(current_node)

        for adjacent_node in adjcaent_graph[current_node]:
            if adjacent_node not in visited:
                stack.append(adjacent_node)

    return visited
```

## BFS

### BFS란?
---
```
한 노드를 시작으로 인접한 모든 정점들을 우선 방문하는 방법이다.
```

![bfs](/assets/img/algorithm/bfs.gif)

### BFS 구현
---
```python
graph = {
    # 인접 리스트 방식의 그래프
}

def bfs_queue(adj_graph, start_node):
    queue = [start_node]
    visited = []

    while queue:
        current_node = queue.pop(0)
        visited.append(current_node)

        for adjacent_node in adj_graph[current_node]:
            if adjacent_node not in visited:
                queue.append(adjacent_node)

    return visited

```

---
---

## Dynamic Programming

### Dynamic Programming이란?
---
```
복잡한 문제를 간단한 여러 개의 문제로 나누어 푸는 방법을 말한다.
```
> 부분 문제 반복과 최적 부분 구조를 가지고 있는 알고리즘을 적은 시간 내에 풀 때 사용한다.

> 문제를 쪼개어 정의할 수 있으면 사용할 수 있다.

> 결과를 기록하는 Memoization을 통해 겹치는 부분 문제에 결과를 사용한다.

### 피보나치 수열에 Dynamic Programming 적용
---
```python
memo = {
    1: 1,
    2: 1
}

def fibo_dynamic_programming(n, fibo_memo):
    if n in fibo_memo:
        return fibo_memo[n]

    nth_fibo = fibo_dynamic_programming(n - 1, fibo_memo) \
    + fibo_dynamic_programming(n - 2, fibo_memo)

    fibo_memo[n] = nth_fibo
    return nth_fibo
```