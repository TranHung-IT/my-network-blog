+++
author = "Trần Việt Hưng"
title = "Cấu trúc Điều khiển: If-Else và Loops trong Java vs JavaScript cho sinh viên mới học"
date = "2025-10-09"
description = "Bài viết cơ bản dành cho sinh viên năm nhất, so sánh cấu trúc điều khiển if-else và loops trong Java và JavaScript. Hướng dẫn cách quyết định và lặp code từ đơn giản!"
tags = [
    "java",
    "javascript",
    "control-structures",
    "if-else",
    "loops",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Sau bài về Functions, hôm nay mình sẽ giới thiệu **Cấu trúc Điều khiển** – cách code "quyết định" và "lặp lại" để xử lý tình huống khác nhau. Mình sẽ so sánh if-else (quyết định) và loops (for, while) trong Java (strict syntax) và JavaScript (flexible), từ cách chúng kiểm tra điều kiện đến lặp qua dữ liệu.

Nếu bạn là sinh viên năm nhất hoặc cấp 3 tự học code, cấu trúc điều khiển giúp bạn làm code "thông minh" – ví dụ, kiểm tra tuổi để chào khác nhau, hoặc lặp in danh sách tên. Java yêu cầu dấu ; và {}, JS dùng {} nhưng linh hoạt hơn. Hãy cùng khám phá cách chúng hoạt động và áp dụng nhé – code dễ copy-paste!

## Cấu trúc Điều khiển: Vai trò và cách hoạt động

Cấu trúc điều khiển quyết định flow code dựa trên điều kiện (if-else) hoặc lặp (loops) đến khi condition false. Chúng là nền tảng của logic, giúp code branch và repeat tasks mà không viết lặp lại.

Java: Strict, yêu cầu explicit type/scope, compile check syntax. if-else đơn giản, loops có for-each cho collections.

Ví dụ Java if-else:
```java
int age = 21;
if (age >= 18) {
    System.out.println("Bạn đủ tuổi lái xe!");
} else {
    System.out.println("Bạn chưa đủ tuổi.");
}
```

Java for loop:
```java
for (int i = 0; i < 5; i++) {
    System.out.println("Lặp lần " + i);
}
```

JavaScript: Dynamic, if-else tương tự, loops hỗ trợ break/continue, for...of cho iterable.

Ví dụ JS if-else:
```javascript
let age = 21;
if (age >= 18) {
    console.log("Bạn đủ tuổi lái xe!");
} else {
    console.log("Bạn chưa đủ tuổi.");
}
```

JS for loop:
```javascript
for (let i = 0; i < 5; i++) {
    console.log("Lặp lần " + i);
}
```

**So sánh**: Java yêu cầu {} cho body, JS optional nhưng recommend. Cả hai dùng boolean condition, nhưng JS truthy/falsy (0, "" falsey).

## If-Else: Quyết định dựa trên điều kiện

If-else kiểm tra condition (true/false), execute block tương ứng, else optional. Nested if cho multiple conditions, switch cho enum-like.

Java switch expression (Java 14+):
```java
String day = "Monday";
String message = switch (day) {
    case "Monday", "Tuesday" -> "Work day";
    case "Saturday", "Sunday" -> "Weekend";
    default -> "Other day";
};
System.out.println(message); // Work day
```

JS switch:
```javascript
let day = "Monday";
let message;
switch (day) {
    case "Monday":
    case "Tuesday":
        message = "Work day";
        break;
    case "Saturday":
    case "Sunday":
        message = "Weekend";
        break;
    default:
        message = "Other day";
}
console.log(message); // Work day
```

**So sánh**: Java switch expression concise (no break), JS traditional (fall-through nếu no break).

## Loops: Lặp lại code để xử lý dữ liệu

Loops lặp block code đến condition false, for (init; condition; update) phổ biến, while/do-while cho unknown iterations.

Java for-each cho collections:
```java
List<String> names = Arrays.asList("Alice", "Bob");
for (String name : names) {
    System.out.println("Hello " + name);
}
```

JS for...of cho iterable:
```javascript
let names = ["Alice", "Bob"];
for (let name of names) {
    console.log("Hello " + name);
}
```

While loop Java:
```java
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}
```

JS:
```javascript
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}
```

**So sánh**: Java for-each clean cho arrays, JS for...of tương tự, while identical nhưng JS no ; required.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java Control Structures       | JS Control Structures        |
|-------------------|-------------------------------|------------------------------|
| **Syntax**       | Strict ({}, ; required)      | Flexible ({} optional)       |
| **Switch**       | Expression (concise)         | Traditional (fall-through)   |
| **For Loop**     | for-each for collections     | for...of for iterables       |
| **Error Check**  | Compile-time                 | Runtime                      |
| **Use Case**     | Structured apps              | Dynamic scripts              |

Java an toàn cho large code, JS dễ cho quick tests.

## Kết luận: Bắt đầu với cái nào?

Java control structures cho backend robust, JS cho frontend interactive. Khởi đầu với if-else simple, practice loops – code sẽ "logic" hơn!

Bạn gặp khó gì với loops? Comment chia sẻ nhé. Bài sau: Arrays in Java vs JS. Theo dõi series để học cơ bản vững!

Happy controlling! 🔄🛤️

<!--more-->