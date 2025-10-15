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

Chào các bạn! Mình là Trần Việt Hưng, rất vui được gặp lại trong series Lập trình với Java vs JavaScript.
Sau khi làm quen với Strings – nơi code “nói chuyện” bằng văn bản – hôm nay chúng ta chuyển sang phần cực kỳ thú vị: **Functions và Methods**.
Đây chính là “công cụ thần kỳ” giúp bạn gom những đoạn code lặp lại thành một khối gọn gàng, dễ tái sử dụng và dễ đọc hơn nhiều.
Lúc mới học, mình từng viết đi viết lại cả chục dòng tính tổng, cho đến khi phát hiện ra chỉ cần viết một hàm là xong — cảm giác như vừa mở khóa một kỹ năng mới vậy! ⚙️
Cùng xem cách mà Java và JavaScript xử lý “khối Lego” này khác nhau ra sao nhé.

## Functions và Methods: Vai trò và nguyên tắc hoạt động cơ bản

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Mình vẫn nhớ cảm giác lần đầu làm việc với methods trong Java — mọi thứ rất bài bản, đúng kiểu OOP, nhưng đôi khi lại hơi cứng nhắc nếu chỉ đang làm mấy bài nhỏ.
Còn bên JavaScript, hàm thì gần như là “linh hồn” của ngôn ngữ: bạn có thể truyền function vào function khác, dùng trong map() hay filter(), nhìn code vừa ngắn vừa gọn.
Có lần mình debug cả buổi mới nhận ra: Java bắt mình tách biệt logic rõ ràng, còn JS thì cho phép “chơi đùa” với code nhiều hơn.
Nếu bạn mới bắt đầu, cứ thử viết vài hàm nhỏ – từ tính tổng đến kiểm tra chuỗi – bạn sẽ thấy code của mình gọn hẳn mà vui hơn hẳn đấy. 😄

## Khai báo, Tham số và Giá trị Trả về: Parameters và Return

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Mình từng overload methods trong Java cho lab – tiện khi có nhiều cách tính add (int vs double), nhưng JS default params cứu mình khỏi viết if check null nhiều lần trong script. Arrow functions JS thì siêu ngắn cho callback, giúp hoàn thành bài tập nhóm nhanh. Cá nhân mình thích JS cho prototype, Java cho production-like. Bạn hay quên validate params không?

## Các Hoạt động Phổ biến: Scope, Recursion và Higher-Order

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Scope JS hoisting từng làm mình gọi function trước khai báo thành công – bất ngờ nhưng hay quên dẫn đến bug! Java block-scoped thì rõ ràng hơn cho bài tập trường. Recursion mình dùng cho factorial trong cả hai, nhưng JS closure giúp viết counter private dễ dàng. Mình khuyên: Tránh recursion sâu ở beginner, dùng loop trước. Bạn thấy closure khó hiểu không?

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

### Tổng kết
Qua bảng tổng hợp có thể thấy Java methods như "xương sống OOP" ở trường, JS functions như "cánh tay linh hoạt" cho web. Không cái nào vượt trội – mình dùng Java cho đồ án lớn, JS cho script nhỏ. Tùy bạn chọn theo dự án!

## Kết luận: Bắt đầu viết Functions ngay!

Functions là "xương sống" tái sử dụng – thử viết hàm tính trung bình từ array (kết hợp bài 2), gọi với if-else (bài 1). Java giúp bạn nghĩ OOP, JS mở rộng functional. Áp dụng: Refactor code cũ thành functions nhỏ! Mình đã làm vậy trong bài tập, và điểm cao hơn hẳn.

Bạn thích functions kiểu nào hơn? Bài sau: Objects và Classes trong Java vs JS. Theo dõi series để code pro dần. Happy functioning! ⚙️🔧

<!--more-->