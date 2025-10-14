+++
author = "Trần Việt Hưng"
title = "Biến và Kiểu Dữ Liệu trong Java vs JavaScript: Bắt đầu từ nền tảng"
date = "2025-08-09"
description = "Bài viết cơ bản dành cho sinh viên mới học, so sánh biến và kiểu dữ liệu trong Java và JavaScript. Hướng dẫn khai báo, sử dụng primitive và object types!"
tags = [
    "java",
    "javascript",
    "variables",
    "data-types",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Hôm nay, dành cho các bạn sinh viên năm nhất hoặc học sinh cấp 3 mới bắt đầu học code, mình sẽ giới thiệu **Biến và Kiểu Dữ Liệu** – nền tảng đầu tiên khi lập trình. Mình sẽ so sánh cách khai báo biến và sử dụng kiểu dữ liệu trong Java (static typing) và JavaScript (dynamic typing), từ primitive types như number, string đến object, với ví dụ đơn giản để bạn dễ hình dung.

Nếu bạn mới học, biến như "hộp đựng" giá trị, kiểu dữ liệu định nghĩa "loại hộp" (số, chữ, đối tượng). Java strict (phải khai báo kiểu trước), JS flexible (tự đoán). Hãy cùng khám phá để xây dựng nền tảng vững chắc nhé – code dễ copy-paste!

## Biến: Khai báo và sử dụng cơ bản

Biến lưu trữ dữ liệu tạm thời, có scope (local/global) và lifetime (tồn tại đến end block/function).

Java: Static typing, khai báo kiểu trước (int, String), compile check type mismatch. Sử dụng = gán, ; kết thúc statement.

Ví dụ Java:
```java
public class Variables {
    public static void main(String[] args) {
        int age = 21; // Primitive int
        String name = "Trần Việt Hưng"; // Reference String
        double height = 1.75; // Primitive double

        System.out.println("Tên: " + name + ", Tuổi: " + age + ", Chiều cao: " + height);
    }
}
```

Java yêu cầu import cho reference types (String từ java.lang), immutable String (new String tạo copy).

JavaScript: Dynamic typing, var/let/const tự đoán kiểu, hoisting với var (declare trước use). let/const block-scoped, tránh redeclare.

Ví dụ JS:
```javascript
let age = 21; // Number
const name = "Trần Việt Hưng"; // String, immutable
let height = 1.75; // Number

console.log(`Tên: ${name}, Tuổi: ${age}, Chiều cao: ${height}`);
```

JS typeof() check kiểu runtime, dynamic (age = "twenty-one" ok, loose equality).

**So sánh**: Java strict (type error compile-time, an toàn), JS flexible (runtime change, dễ prototype nhưng dễ bug type).

## Kiểu Dữ Liệu Primitive và Reference

Primitive: Giá trị cơ bản (number, boolean, string, char), pass by value (copy khi gán). Reference: Object (array, object), pass by reference (gán share memory).

Java primitives (8 types: byte, short, int, long, float, double, char, boolean), wrappers (Integer) cho boxing. Reference objects trên heap, null default.

Ví dụ Java primitive vs reference:
```java
int x = 5; // Primitive
Integer y = 5; // Wrapper
List<String> list = new ArrayList<>(); // Reference

x = 10; // Copy value
y = 10; // New object
list.add("hello"); // Modify shared

System.out.println(x); // 10
System.out.println(list.size()); // 1
```

JavaScript primitives (number, bigint, string, boolean, symbol, null, undefined), all else object. No pass-by-value/reference distinction, nhưng primitives immutable.

Ví dụ JS:
```javascript
let x = 5; // Primitive number
let y = x; // Copy value
x = 10;
console.log(y); // 5 (immutable)

let list = []; // Object array
let list2 = list; // Reference
list.push("hello");
console.log(list2.length); // 1 (shared)
```

**So sánh**: Java explicit primitive/reference (performance control), JS unified (dễ, nhưng boxing auto).

## Object và Method: Tạo và gọi

Object là collection properties/methods, method là function thuộc object.

Java: new Object() hoặc class instance, method gọi qua dot notation.

Ví dụ Java:
```java
class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public void greet() {
        System.out.println("Hello, I'm " + name);
    }
}

Person p = new Person("Alice");
p.greet(); // Hello, I'm Alice
```

JavaScript: {} literal hoặc new Object(), method là property function.

Ví dụ JS:
```javascript
const person = {
    name: "Alice",
    greet: function() {
        console.log("Hello, I'm " + this.name);
    }
};

person.greet(); // Hello, I'm Alice
// ES6 class
class Person {
    constructor(name) {
        this.name = name;
    }
    greet() {
        console.log("Hello, I'm " + this.name);
    }
}
const p = new Person("Alice");
p.greet();
```

**So sánh**: Java class blueprint strict, JS object literal dynamic (add property runtime).

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java Variables/Data Types     | JS Variables/Data Types       |
|-------------------|-------------------------------|-------------------------------|
| **Typing**       | Static (compile check)       | Dynamic (runtime)            |
| **Declaration**  | Type first (int x = 5)       | var/let/const x = 5          |
| **Mutability**   | Primitives immutable, objects mutable | All primitives immutable     |
| **Performance**  | Optimized primitives         | V8 auto-boxing               |
| **Use Case**     | Enterprise, type-safe apps   | Web, flexible scripts        |

Java an toàn cho large apps, JS dễ cho quick prototypes.

## Kết luận: Bắt đầu với cái nào?

Java cho backend structured, JS cho frontend dynamic. Khởi đầu với biến simple, practice data types – nền tảng vững sẽ giúp bạn học nhanh hơn!

Bạn gặp khó gì với variables? Comment chia sẻ nhé. Bài sau: Functions in Java vs JS. Theo dõi series để học cơ bản vững!

Happy coding! 🔤📝

<!--more-->
