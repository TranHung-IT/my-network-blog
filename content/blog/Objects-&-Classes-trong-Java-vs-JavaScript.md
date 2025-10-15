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

Chào các bạn, mình là Trần Việt Hưng – sinh viên năm 4 CNTT, tiếp tục hành trình cùng series Lập trình với Java vs JavaScript. Nếu ở bài trước, chúng ta học cách chia nhỏ logic với Functions/Methods, thì hôm nay – bài 5: **Objects và Classes** – sẽ là bước tiến giúp bạn tổ chức dữ liệu “có hồn” hơn. Trong lập trình hướng đối tượng (OOP), mọi thứ đều có thể trở thành đối tượng – từ chiếc xe, con mèo cho đến người dùng trong app. Java giúp bạn mô hình hóa bằng class, còn JavaScript lại thoải mái hơn với object literal.
Mình vẫn nhớ lần đầu được yêu cầu tạo class Student – ban đầu hơi khô khan, nhưng khi chạy chương trình và thấy danh sách sinh viên hiển thị, cảm giác “mình vừa tạo ra thế giới nhỏ” thật thú vị! 🧩
Hãy cùng tìm hiểu cách hai ngôn ngữ này biến ý tưởng thành những mô hình có cấu trúc nhé.

## Objects và Classes: Vai trò và nguyên tắc hoạt động cơ bản

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Theo mình, Java cho cảm giác “khuôn mẫu” và chặt chẽ — thích hợp cho tư duy hệ thống và làm việc nhóm, vì mọi thứ rõ ràng như sơ đồ blueprint. Trong khi đó, JavaScript lại tự do, gần gũi và nhanh gọn, cực hợp khi bạn muốn thử nghiệm ý tưởng hoặc dựng web prototype. Mình thường ví Java như kiến trúc sư, còn JS như nghệ sĩ — cùng xây nhà, nhưng một bên dùng bản thiết kế chuẩn, bên kia vẽ phóng khoáng theo cảm hứng.
Bạn thuộc “phe” nào hơn: thích khuôn khổ hay sáng tạo linh hoạt? 😄

## Khai báo, Thuộc tính và Constructors: Properties và Initialization

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Mình từng quên constructor ở JS, dẫn đến properties undefined khi test – bài học nhớ đời! Java overload constructors thì tiện cho lab, như Student() mặc định vs Student(name, age). Cá nhân mình thích encapsulation Java cho code an toàn, JS dynamic cho prototype nhanh. Bạn hay dùng getters/setters chưa?

## Các Hoạt động Phổ biến: Methods, Inheritance và Polymorphism cơ bản

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Inheritance trong Java giúp mình xây class hierarchy cho hệ thống quản lý sinh viên ở đồ án – rõ ràng nhưng code dài. JS extends thì ngắn gọn hơn cho component web, và super() dễ gọi parent method. Mình khuyên beginner: Thử polymorphism đơn giản trước, như override greet() cho Student vs Teacher. Bạn thấy inheritance phức tạp không?

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

### Tổng kết
Bảng tổng hợp về Objects và Classes so sánh "kiến trúc sư" (Java) vs "nghệ sĩ" (JS) trong học OOP của mình. Java strict giúp tránh bug ở dự án trường, JS flexible cho sáng tạo ở side project. Không cái nào tốt hơn – mình dùng Java cho cấu trúc, JS cho nhanh!

## Kết luận: Mô hình hóa thế giới với OOP

Objects/classes biến code thành "thế giới mini" – thử tạo class Car với properties wheels và method drive(), instantiate nhiều xe. Java dạy discipline OOP, JS mở rộng prototype magic. Kết hợp với functions từ bài 4 để methods mạnh mẽ! Mình đã áp dụng trong bài tập, và code dễ mở rộng hơn hẳn.

Bạn sẽ model object gì đầu tiên? Bài sau: Inheritance và Polymorphism trong Java vs JS. Tiếp tục series để OOP pro hơn. Happy objecting! 🏗️🔮

<!--more-->