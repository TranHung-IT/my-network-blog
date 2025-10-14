+++
author = "Trần Việt Hưng"
title = "Functions trong Java vs JavaScript: Từ cơ bản đến nâng cao cho sinh viên mới học"
date = "2025-08-14"
description = "Bài viết cơ bản dành cho sinh viên năm nhất, so sánh Functions trong Java và JavaScript. Hướng dẫn khai báo, gọi hàm, parameters, và return value!"
tags = [
    "java",
    "javascript",
    "functions",
    "methods",
    "parameters",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Sau bài về Event-Driven Programming, hôm nay mình sẽ giới thiệu **Functions** – một trong những khái niệm quan trọng nhất khi học lập trình, như "công cụ" để tái sử dụng code và tổ chức logic. Mình sẽ so sánh Functions trong Java (methods trong class) và JavaScript (first-class functions), từ cách khai báo, gọi hàm, truyền parameters đến return value, với ví dụ đơn giản để bạn dễ hình dung.

Nếu bạn là sinh viên năm nhất hoặc cấp 3 tự học code, Functions giúp bạn viết code ngắn gọn, tránh lặp lại, và dễ debug. Java strict với methods trong class, JS flexible với functions như object. Hãy cùng khám phá cách chúng hoạt động và áp dụng nhé – code dễ copy-paste!

## Functions: Vai trò và cách hoạt động cơ bản

Functions là block code thực hiện nhiệm vụ cụ thể, nhận input (parameters) và trả output (return value). Chúng giúp modular code, reuse logic, và abstraction complexity – ví dụ, hàm tính tổng thay vì viết + lặp lại.

Java: Functions gọi là methods, luôn thuộc class (static hoặc instance), overload (nhiều signature cùng tên). Compile-time check parameters, return type.

Ví dụ Java:
```java
public class MathUtils {
    // Static method (không cần instance)
    public static int add(int a, int b) {
        return a + b;
    }

    // Instance method
    public int multiply(int x, int y) {
        return x * y;
    }
}

// Usage
int sum = MathUtils.add(5, 3); // Static call
MathUtils utils = new MathUtils();
int product = utils.multiply(4, 2); // Instance call
System.out.println("Sum: " + sum + ", Product: " + product); // Sum: 8, Product: 8
```

Java methods overload dựa parameters (add(int, int) vs add(double, double)), no default parameters.

JavaScript: Functions first-class (gán biến, pass argument, return function), hoisting với function declaration (gọi trước declare). Arrow functions (ES6) concise, lexical this.

Ví dụ JS:
```javascript
// Function declaration (hoisted)
function add(a, b) {
    return a + b;
}

// Function expression
const multiply = function(x, y) {
    return x * y;
};

// Arrow function
const subtract = (p, q) => p - q; // Concise, no {}

console.log(add(5, 3)); // 8
console.log(multiply(4, 2)); // 8
console.log(subtract(10, 4)); // 6
```

JS default parameters (add(a=0, b=0)), rest parameters (...args cho variable args).

**So sánh**: Java methods class-bound, overload compile-time; JS functions standalone, dynamic call (apply/bind).

## Parameters và Return Value: Truyền và trả dữ liệu

Parameters là input cho function, return value là output. Pass by value (primitives copy), pass by reference (objects share).

Java: Parameters typed, no default, varargs (int... args) cho variable. Return explicit hoặc void.

Ví dụ Java varargs:
```java
public static int sum(int... numbers) {
    int total = 0;
    for (int num : numbers) {
        total += num;
    }
    return total;
}

int result = sum(1, 2, 3, 4); // 10
```

JavaScript: Default parameters (param = default), rest (...args), destructuring params. Return implicit undefined nếu no return.

Ví dụ JS:
```javascript
function sum(...numbers) { // Rest parameters
    return numbers.reduce((acc, num) => acc + num, 0);
}

function greet(name = "Friend") { // Default
    return "Hello, " + name + "!";
}

console.log(sum(1, 2, 3, 4)); // 10
console.log(greet()); // Hello, Friend!
console.log(greet("Alice")); // Hello, Alice!
```

**So sánh**: Java varargs array-like, JS rest spreadable; Java no default, JS flexible.

## Scope và Closures: Phạm vi và hàm lồng

Scope định nghĩa visibility biến, closure cho inner function access outer variables.

Java: Block scope ({} for local), no closure native (lambda capture variables).

Ví dụ Java lambda capture:
```java
int multiplier = 3;
Function<Integer, Integer> timesThree = x -> x * multiplier; // Capture
System.out.println(timesThree.apply(5)); // 15
multiplier = 4; // Outer change affects
```

JavaScript: Function scope, closure inner access outer (lexical scoping), useful cho private vars.

Ví dụ JS closure:
```javascript
function outer(x) {
    return function inner(y) {
        return x + y; // Access outer x
    };
}

const addFive = outer(5);
console.log(addFive(3)); // 8
console.log(addFive(10)); // 15
```

**So sánh**: Java lambda limited closure, JS full closure cho patterns như module.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java Functions (Methods)      | JS Functions                 |
|-------------------|-------------------------------|------------------------------|
| **Declaration**  | Class-bound, typed           | Standalone, dynamic          |
| **Overloading**  | Yes (multiple signatures)    | No, use optional params      |
| **Default Params** | No, overload                 | Yes (param = default)        |
| **Scope**        | Block scope                  | Function scope, closure      |
| **Performance**  | JIT optimized                | V8 inline cache              |
| **Use Case**     | Structured apps              | Flexible scripts             |

Java strict cho large codebases, JS versatile cho web.

## Kết luận: Bắt đầu với cái nào?

Java functions cho backend organized, JS cho frontend interactive. Khởi đầu với hàm simple, practice parameters – functions là "xương sống" code!

Bạn gặp khó gì với functions? Comment chia sẻ nhé. Bài sau: Arrays in Java vs JS. Theo dõi series để học cơ bản vững!

Happy functioning! ⚙️📈

<!--more-->