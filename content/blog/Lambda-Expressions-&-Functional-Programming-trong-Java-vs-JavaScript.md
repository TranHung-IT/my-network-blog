+++
author = "Trần Việt Hưng"
title = "Lambda Expressions và Functional Programming trong Java vs JavaScript: Lập trình hàm cơ bản"
date = "2025-10-10"
description = "Bài 10 series Lập trình với Java vs JavaScript. Giới thiệu lambda và functional programming – cách viết code declarative, ngắn gọn với streams và higher-order functions!"
tags = [
    "java",
    "javascript",
    "lambda",
    "functional-programming",
    "streams",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn, mình là Trần Việt Hưng – tiếp tục hành trình khám phá Java và JavaScript! Sau khi làm quen với Generics và Type Safety ở bài trước, hôm nay chúng ta đến với bài 10: **Lambda Expressions & Functional Programming** – nơi lập trình không chỉ là "ra lệnh" cho máy tính, mà là "truyền cảm hứng" để nó tự xử lý theo logic bạn mô tả.
Functional Programming (FP) giống như thay đổi tư duy: bạn mô tả “điều muốn đạt được”, không phải “cách đạt được”. Mình vẫn nhớ lần đầu dùng lambda trong Java 8 — cú pháp ngắn gọn, rõ ràng, khiến code sạch đến bất ngờ. Từ đó, mình nhìn lại những vòng lặp cũ mà chỉ biết cười 😊.
Giờ thì, cùng khám phá cách Java và JS khiến code “biết suy nghĩ” hơn qua FP nhé!

## Lambda Expressions và Functional Programming: Vai trò và nguyên tắc hoạt động cơ bản

### Kiến thức cốt lõi
Lambda Expressions là anonymous functions ngắn gọn (không tên, single-expression), dùng làm arguments cho higher-order functions (nhận/trả functions). Functional Programming: Paradigm coi functions như citizens first-class, ưu tiên immutability (không thay đổi data), pure functions (no side-effects, same input same output), và composition (ghép functions).

Vai trò chính: Conciseness (ít code hơn), readability (declarative dễ hiểu), parallelism (dễ parallelize). Không lambda, FP dùng anonymous classes dài; có lambda, code như poetry.

Nguyên tắc cốt lõi:
- **Pure vs Impure**: Pure (predictable, testable), impure (I/O, state change) – FP minimize impure.
- **Higher-Order Functions**: Map (transform), filter (select), reduce (aggregate).
- **Immutability**: Data không mutate, dùng new copies để tránh bugs concurrency.

Java: Lambda (target typing via functional interfaces như Predicate<T>), streams API cho FP (from collections). Phù hợp backend, với Optional cho null-safety.

JavaScript: Arrow functions (=>) lexical this, native array methods (map/filter/reduce). Lý tưởng frontend, với closures cho state.

**So sánh cốt lõi**: Java verbose nhưng typed (lambda int x -> x*2), JS concise (x => x*2). Cả hai hỗ trợ currying (partial apply), nhưng JS no tail recursion optimize native.

Ví dụ lambda cơ bản (double number):
```java
//java

// Functional interface: Function<Integer, Integer>
int result = (x) -> x * 2; // Lambda
```

```javascript
//javascript

const double = x => x * 2; // Arrow function
```

### Góc nhìn cá nhân
Ban thân mình thấy FP trong Java như “làn gió mới” giữa OOP truyền thống — đặc biệt là khi thao tác với Streams, mọi thứ trở nên tinh gọn và logic hơn. Trong khi đó, JS với arrow function lại như công cụ linh hoạt cho những đoạn code UI cập nhật tức thì. Nếu bạn mới bắt đầu, hãy tập trung hiểu “pure functions” và “no side effects” – đó chính là trái tim của FP.
Hãy thử viết dòng lambda đầu tiên, biết đâu bạn cũng sẽ có “wow moment” như mình hồi đó! 🚀

## Khai báo Lambda và Higher-Order Functions: Syntax và Composition

### Kiến thức cốt lõi
Khai báo: Java (params) -> { body } ({} optional nếu single expr), JS params => expr. Higher-order: Pass lambda như arg (Java stream.filter(p -> p > 10), JS array.filter(x => x > 10)).

Lý thuyết sâu: Closures: Lambda capture outer vars (Java effectively final, JS full capture). Currying: Transform multi-arg thành chain single-arg (f(a)(b) = f(a,b)). Composition: f(g(x)) hoặc pipe (JS compose).

Java: @FunctionalInterface enforce single abstract method (SAM), method references (Class::method).

JS: Functions first-class (return functions), bind/call/apply cho partial.

**So sánh**: Java type-inferred params (target type quyết định), JS implicit. Practice: Dùng lambda cho callbacks để tránh callback hell.

Ví dụ higher-order map:
```java
//java

import java.util.Arrays;
import java.util.List;
List<Integer> nums = Arrays.asList(1,2,3);
nums.stream().map(x -> x * 2).forEach(System.out::println); // 2 4 6
```

```javascript
//javascript

let nums = [1,2,3];
nums.map(x => x * 2).forEach(console.log); // 2 4 6
```

### Góc nhìn cá nhân 
Mình từng dùng method references Java :: cho stream – ngắn hơn lambda, tiết kiệm thời gian lab! JS composition với pipe thì như "dây chuyền sản xuất" cho data transform ở web app. Cá nhân mình thích JS cho higher-order nhanh, Java cho typed safety. Bạn hay dùng arrow cho callback không?

## Các Hoạt động Phổ Biến: Streams, Reduce và Immutability

### Kiến thức cốt lõi
Streams: Lazy pipeline (filter -> map -> reduce), Java Stream API, JS generators/transducers. Reduce: Aggregate (sum, max), fold-left/right.

Lý thuyết: Lazy evaluation (chỉ compute khi cần, save perf), short-circuit (limit() dừng sớm). Immutability: Java immutable collections (List.of()), JS Object.freeze() hoặc spread.

Java: Parallel streams (parallel()), Collectors.toList() terminal.

JS: Reduce((acc, x) => acc + x, 0), async iterators cho lazy.

**So sánh**: Java streams intermediate/terminal (chainable), JS array methods eager (compute ngay). JS dễ pure functions với const, Java cần careful với var.

Ví dụ reduce sum:
```java
//java

int sum = nums.stream().reduce(0, (a, b) -> a + b); // 6
```

```javascript
//javascript

let sum = nums.reduce((a, b) => a + b, 0); // 6
```

### Góc nhìn cá nhân 
Parallel streams Java từng giúp mình speed up sum large list ở bài tập – JVM magic! JS reduce thì đơn giản cho aggregate scores ở todo app, dễ debug. Mình khuyên: Bắt đầu với map/filter, rồi reduce cho aggregate. Bạn thấy lazy evaluation thú vị không?

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Java Lambda/FP               | JS Lambda/FP                 |
|-----------------------|------------------------------|------------------------------|
| **Syntax**           | (x) -> x*2, typed            | x => x*2, concise            |
| **Higher-Order**     | Functional interfaces        | Native array methods         |
| **Immutability**     | Optional, streams immutable  | Const/spread encouraged      |
| **Parallelism**      | Parallel streams             | Workers/async                |
| **Hiệu suất**        | JVM optimize, lazy streams   | V8 fast, eager default       |
| **Trường hợp dùng**  | Backend data processing      | Frontend reactive UI         |

Java structured FP, JS playful.

### Tổng kết 
Java lambda như "công cụ chuyên nghiệp" cho đồ án trường, JS arrow như "vũ khí nhanh" cho side project. Java parallel cho heavy data, JS immutability cho UI state. Không cái nào hoàn hảo – mình mix cả hai cho full-stack!

## Kết luận: Chuyển sang mindset Functional

Lambda và FP làm code "sạch sẽ" – thử refactor loop duyệt array (bài 2) thành stream/map. Java thêm FP vào OOP, JS native functional. Áp dụng: Viết pure function cho math utils! Mình đã thử trong project nhóm, và team khen code dễ maintain hơn.

Bạn thấy FP khó ở đâu? Bài sau: Concurrency và Multithreading trong Java vs JS. Tiếp tục series để code concurrent-ready. Happy lambding! λ🧮

<!--more-->