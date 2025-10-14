+++
author = "Trần Việt Hưng"
title = "Objects và Classes trong Java vs JavaScript: Nền tảng OOP cơ bản"
date = "2025-10-05"
description = "Bài 5 series Lập trình với Java vs JavaScript. So sánh classes/objects – cách mô hình hóa thế giới thực trong code, từ khai báo đến thuộc tính và methods!"
tags = [
    "java",
    "javascript",
    "objects",
    "classes",
    "oop",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Lập trình với Java vs JavaScript trên blog cá nhân. Sau bài về Functions/Methods – nơi bạn học cách đóng gói logic tái sử dụng – hôm nay, bài 5: **Objects và Classes** – "xương sống" của lập trình hướng đối tượng (OOP), giúp bạn mô hình hóa thế giới thực như "xe hơi" có thuộc tính (màu sắc) và hành vi (chạy). Nếu bạn là sinh viên năm nhất hoặc mới tự học, objects là bước nhảy vọt: Từ dữ liệu rời rạc (arrays/strings), sang cấu trúc có ý nghĩa, dễ mở rộng như xây nhà từ gạch (classes) thành ngôi nhà hoàn chỉnh (objects).

Classes được hiểu như "bản thiết kế", objects như "sản phẩm thực tế". Java là OOP thuần túy (mọi thứ trong class), JS prototype-based (objects linh hoạt, classes từ ES6 syntactic sugar). Chúng khác ở instantiation (Java new, JS {} hoặc new), properties (Java fields typed, JS dynamic), và encapsulation (Java access modifiers, JS conventions). Hãy cùng khám phá để bạn bắt đầu tạo "đối tượng" đầu tiên, như class Student lưu thông tin học sinh!

## Objects và Classes: Vai trò và nguyên tắc hoạt động cơ bản

Objects là instance (thực thể) chứa dữ liệu (properties/fields) và hành vi (methods/functions), đại diện cho khái niệm thực tế. Classes là blueprint (khuôn mẫu) định nghĩa structure cho objects. Vai trò chính trong OOP: Abstraction (ẩn phức tạp), Encapsulation (gói dữ liệu + hành vi), modularity (dễ maintain).

Nguyên tắc cốt lõi:
- **Instantiation**: Tạo object từ class (nhiều objects từ một class, mỗi cái độc lập).
- **State và Behavior**: Properties lưu state (giá trị hiện tại), methods thay đổi state.
- **Reference Semantics**: Objects lưu bằng reference (địa chỉ bộ nhớ), không copy toàn bộ.

Java: Strongly OOP, class là unit cơ bản (public class MyClass), objects qua new keyword. Typed fields (private int age), constructors init. Phù hợp enterprise apps lớn, với inheritance/polymorphism native.

JavaScript: Prototype-based OOP (objects kế thừa từ prototype), ES6 classes là syntax tiện lợi trên prototype. Objects literal {} nhanh cho simple cases. Lý tưởng web, nơi objects dynamic (thêm/xóa properties runtime).

**So sánh cốt lõi**: Java compiled, strict (access modifiers public/private), JS interpreted, flexible (no classes required pre-ES6). Cả hai hỗ trợ dot notation (obj.property) truy cập.

Ví dụ khai báo class cơ bản (Student):
```java
//java

public class Student {
    String name;
    int age;
}
Student s = new Student();
```

```javascript
//javascript

class Student {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
let s = new Student("Alice", 20);
```

## Khai báo, Thuộc tính và Constructors: Properties và Initialization

Khai báo: Java class với fields/methods, JS class với constructor/methods. Properties: Java declared typed (String name;), JS assigned in constructor (this.name = name).

Lý thuyết sâu: Constructors init object (Java default no-arg, overload; JS single constructor). Getters/setters cho encapsulation (Java convention, JS Proxy advanced). This keyword: Java instance reference, JS context-dependent (method binding).

Java: Fields private, dùng getter/setter truy cập (encapsulation mạnh). No dynamic add properties.

JS: Properties public by default (convention _private), dynamic (s.age = 21; ok). Constructors optional cho literal objects.

**So sánh**: Java enforces structure (compile error nếu sai type), JS duck-typing (nếu quack như duck thì là duck). Practice: Luôn init properties ở constructor để tránh undefined/null.

Ví dụ với properties:
```java
//java 

s.name = "Bob"; // Direct nếu public
```

```javascript
//javascript

s.name = "Bob"; // Dynamic
```

## Các Hoạt động Phổ biến: Methods, Inheritance và Polymorphism cơ bản

Methods: Định nghĩa hành vi trong class (Java void study(), JS study() { ... }). Inheritance: Class con extends cha (Java extends, JS extends), polymorphism (override methods).

Lý thuyết: Inheritance chia sẻ code (is-a relationship), polymorphism cho flexibility (gọi method cha hoặc con tùy object). Prototype chain (JS) vs class hierarchy (Java).

Java: Abstract classes/interfaces cho blueprint, @Override explicit.

JS: Super() gọi parent, prototype manipulation thủ công nếu cần.

**So sánh**: Java static typing hỗ trợ polymorphism an toàn, JS dynamic (method lookup runtime). JS khuyến khích composition over inheritance (has-a thay is-a).

Ví dụ method đơn giản (greet):
```java
//java 

public void greet() {
    System.out.println("Hi " + name);
}
s.greet();
```

```javascript
//javascript

greet() {
    console.log(`Hi ${this.name}`);
}
s.greet();
```

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Java Classes/Objects          | JS Classes/Objects            |
|-----------------------|-------------------------------|-------------------------------|
| **Khai báo**         | Strict class, new required   | Prototype hoặc class ES6, {} literal |
| **Properties**       | Typed fields, private        | Dynamic, public convention    |
| **Constructors**     | Overload, default            | Single, optional              |
| **Inheritance**      | Extends, interfaces          | Extends prototype             |
| **Hiệu suất**        | JVM optimize hierarchy       | V8 nhanh cho dynamic objects  |
| **Trường hợp dùng**  | Enterprise OOP lớn           | Web components linh hoạt      |

Java xây dựng solid foundation, JS nhanh prototype.

## Kết luận: Mô hình hóa thế giới với OOP

Objects/classes biến code thành "thế giới mini" – thử tạo class Car với properties wheels và method drive(), instantiate nhiều xe. Java dạy discipline OOP, JS mở rộng prototype magic. Kết hợp với functions từ bài 4 để methods mạnh mẽ!

Bạn sẽ model object gì đầu tiên? Comment bên dưới nhé. Bài sau: Inheritance và Polymorphism trong Java vs JS. Tiếp tục series để OOP pro hơn!

Happy objecting! 🏗️🔮

<!--more-->