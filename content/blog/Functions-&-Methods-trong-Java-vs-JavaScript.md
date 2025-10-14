+++
author = "Trần Việt Hưng"
title = "Functions và Methods trong Java vs JavaScript: Xây dựng code tái sử dụng"
date = "2025-10-04"
description = "Bài 4 trong series Lập trình với Java và JavaScript. Giới thiệu functions/methods – cách đóng gói logic để code sạch, dễ bảo trì và tái sử dụng!"
tags = [
    "java",
    "javascript",
    "functions",
    "methods",
    "scope",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Lập trình với Java vs JavaScript trên blog cá nhân. Sau bài về Strings – nơi bạn học cách thao tác văn bản như nối chuỗi hay tìm kiếm – hôm nay, bài 4: **Functions và Methods** – "công cụ" giúp bạn đóng gói code thành khối tái sử dụng, tránh lặp lại và làm chương trình dễ đọc hơn. Nếu bạn là sinh viên năm nhất hoặc mới tự học, functions là bước tiến lớn: Từ viết code dài dòng, sang xây dựng "hàm" như tính tổng mảng hay validate input, giống như Lego ghép khối.

Functions có thể được ví như "công thức nấu ăn" – input nguyên liệu, output món ăn. Java dùng methods (trong class, static/non-static), JS functions (first-class, arrow functions linh hoạt). Chúng khác ở scope (Java block-scoped nghiêm ngặt, JS hoisting/closure), parameters (Java typed, JS default/rest), và calling (Java void/return, JS implicit). Hãy cùng khám phá để bạn bắt đầu viết code modular từ hôm nay!

## Functions và Methods: Vai trò và nguyên tắc hoạt động cơ bản

Functions (JS) hoặc Methods (Java) là khối code độc lập, thực hiện nhiệm vụ cụ thể, nhận input (parameters) và trả output (return value). Vai trò chính: Tái sử dụng (gọi nhiều lần), abstraction (ẩn chi tiết phức tạp), modularity (chia nhỏ chương trình lớn). Không có chúng, code như "một dòng sông dài" khó maintain; có functions, như "các nhánh sông" dễ quản lý.

Nguyên tắc cốt lõi:
- **Declaration vs Definition**: Khai báo (tên, params, body), gọi (invoke) với arguments.
- **Scope**: Biến local (trong function) vs global (ngoài), tránh conflict.
- **Pass-by-Value/Reference**: Java pass-by-value (primitive copy, reference copy pointer), JS pass-by-value (nhưng objects mutable).

Java: Methods thuộc class (instance/static), typed params/return (int add(int a, int b)), void cho no-return. Phù hợp OOP, encapsulation trong class.

JavaScript: Functions là object, first-class (gán biến, truyền param, return function), hoisting (gọi trước khai báo). Lý tưởng functional programming, closure cho private data.

**So sánh cốt lõi**: Java structured (phải trong class, compile-check types), JS dynamic (anonymous functions, lambda-like). Cả hai dùng {} cho body, ; kết thúc statement.

Ví dụ khai báo cơ bản (hàm chào):
```java
//java 

public static String greet(String name) {
    return "Hello " + name;
}
```

```javascript
//javascript

function greet(name) {
    return `Hello ${name}`;
}
```

## Khai báo, Tham số và Giá trị Trả về: Parameters và Return

Khai báo: Java public/private modifier, JS function keyword. Parameters: Java fixed typed (overloading cho nhiều signature), JS default values (param=1), rest params (...args cho variable).

Lý thuyết sâu: Arguments bind lúc gọi (positional/keyword ở JS ES6+), default tránh undefined. Return: Early return thoát sớm, void implicit null/undefined.

Java: Overloading (nhiều method cùng tên, khác params), constructors đặc biệt cho init object.

JS: Arrow functions (=>) concise cho callback, no own 'this' (lexical scope).

**So sánh**: Java explicit types (an toàn, IDE help), JS implicit (dễ nhưng runtime error). Practice: Luôn validate params đầu function.

Ví dụ với params và return:
```java
//java 

public static int add(int a, int b) {
    return a + b;
}
```

```javascript
//javascript

const add = (a, b) => a + b; // Arrow function
```

## Các Hoạt động Phổ biến: Scope, Recursion và Higher-Order

Scope: Java block-scoped ({} nội bộ), no hoisting. JS function-scoped (var), block với let/const, hoisting var/functions.

Recursion: Function gọi chính mình (base case tránh infinite), như factorial. Higher-order: Function nhận/trả function (JS mạnh, Java lambda từ 8).

Lý thuyết: Closure (JS: function nhớ outer scope vars), giúp encapsulation. Recursion stack-based (rủi ro overflow nếu sâu).

Java: Recursion ok nhưng iterative thường hiệu quả hơn (tail recursion optimize hạn chế).

JS: Recursion phổ biến cho tree traversal, higher-order như map() nhận function.

**So sánh**: Java no closure native (dùng anonymous class), JS closure mạnh cho async. JS khuyến khích composition (ghép functions), Java inheritance-focused.

Ví dụ recursion đơn giản (factorial):
```java
//java

public static int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

```javascript
//javascript

function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Java Methods                  | JS Functions                  |
|-----------------------|-------------------------------|-------------------------------|
| **Khai báo**         | Trong class, typed params    | First-class, arrow concise    |
| **Scope**            | Block-scoped, no hoisting    | Hoisting var, closure mạnh    |
| **Parameters**       | Fixed, overloading           | Default/rest, variable args   |
| **Recursion/Higher** | Hỗ trợ, lambda từ Java 8     | Native, higher-order linh hoạt|
| **Hiệu suất**        | JVM optimize static          | V8 nhanh cho functional       |
| **Trường hợp dùng**  | OOP encapsulation            | FP callbacks, async handlers  |

Java dạy structure, JS khuyến khích flexibility.

## Kết luận: Bắt đầu viết Functions ngay!

Functions là "xương sống" tái sử dụng – thử viết hàm tính trung bình từ array (kết hợp bài 2), gọi với if-else (bài 1). Java giúp bạn nghĩ OOP, JS mở rộng functional. Áp dụng: Refactor code cũ thành functions nhỏ!

Bạn thích functions kiểu nào hơn? Comment chia sẻ nhé. Bài sau: Objects và Classes trong Java vs JS. Theo dõi series để code pro dần!

Happy functioning! ⚙️🔧

<!--more-->