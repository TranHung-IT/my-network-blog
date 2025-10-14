+++
author = "Trần Việt Hưng"
title = "Inheritance và Polymorphism trong Java vs JavaScript: Mở rộng OOP"
date = "2025-10-06"
description = "Bài 6 series Lập trình với Java vs JavaScript. Khám phá inheritance (kế thừa) và polymorphism (đa hình) – cách tái sử dụng và linh hoạt hóa code OOP!"
tags = [
    "java",
    "javascript",
    "inheritance",
    "polymorphism",
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

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Lập trình với Java vs JavaScript trên blog cá nhân. Sau bài về Objects và Classes – nơi bạn học cách tạo blueprint cho thế giới thực trong code – hôm nay, bài 6: **Inheritance và Polymorphism** – hai trụ cột của OOP giúp bạn tái sử dụng code (inheritance) và làm code linh hoạt (polymorphism), như xây nhà từ nền móng cũ thay vì từ đầu. Nếu bạn là sinh viên năm nhất hoặc mới tự học, đây là lúc OOP "nâng cấp": Từ một class Student đơn lẻ, sang hierarchy như Undergraduate extends Student, với phương thức đa hình để xử lý khác nhau tùy loại.

Bạn có thể nhìn nhận Inheritance một cách dễ hiểu như việc "người con thừa hưởng tài sản cha", polymorphism như "cùng tên nhưng hành vi khác". Java hỗ trợ inheritance classical (extends/implements), JS prototype chain (extends syntactic). Chúng khác ở overriding (Java @Override, JS super), type checking (Java instanceof, JS typeof), và multiple inheritance (Java interfaces, JS mixins). Hãy cùng khám phá để bạn viết code DRY (Don't Repeat Yourself) và extensible từ hôm nay!

## Inheritance và Polymorphism: Vai trò và nguyên tắc hoạt động cơ bản

Inheritance: Cơ chế cho class con (subclass) kế thừa properties/methods từ class cha (superclass), tạo hierarchy (cây kế thừa). Vai trò: Tái sử dụng code, is-a relationship (Student is-a Person). Polymorphism: Khả năng object có nhiều hình thức – cùng method name nhưng implement khác (override), hoặc runtime binding (dynamic dispatch).

Nguyên tắc cốt lõi:
- **Single vs Multiple**: Single (một cha trực tiếp) tránh diamond problem, multiple qua interfaces/traits.
- **Overriding vs Overloading**: Overriding thay đổi hành vi cha, overloading nhiều signature cùng tên.
- **Upcasting/Downcasting**: Xem con như cha (up), ép kiểu ngược (down với check).

Java: Classical inheritance, extends cho classes, implements interfaces (multiple). Super() gọi cha explicit. Phù hợp strict OOP, với access modifiers bảo vệ.

JavaScript: Prototype delegation, ES6 extends cho classes (dưới hood là prototype). No true multiple, dùng Object.assign() cho mixins. Lý tưởng dynamic, nơi objects thay đổi runtime.

**So sánh cốt lõi**: Java compile-time check (error nếu sai hierarchy), JS runtime flexible (prototype manipulation). Cả hai dùng super/extends, nhưng Java no multiple class inheritance.

Ví dụ inheritance cơ bản (Person -> Student):
```java
class Person {
    String name;
    void greet() { System.out.println("Hi " + name); }
}
class Student extends Person {
    int grade;
}
```

```javascript
class Person {
    constructor(name) { this.name = name; }
    greet() { console.log(`Hi ${this.name}`); }
}
class Student extends Person {
    constructor(name, grade) {
        super(name);
        this.grade = grade;
    }
}
```

## Khai báo Kế thừa và Override Methods: Extends và Super

Khai báo: Java extends SuperClass, JS class Sub extends Super. Constructors: Java gọi super() implicit đầu nếu không explicit, JS super() bắt buộc trước this.

Lý thuyết sâu: Method resolution: Java virtual methods (polymorphic), static không. Override yêu cầu same signature, Java @Override annotation. Super cho access cha (super.method()).

Java: Protected access cho subclass, final ngăn override.

JS: Super.method() gọi cha, no protected (convention), prototype chain cho lookup.

**So sánh**: Java enforces overriding (compile check), JS loose (shadowing nếu sai). Practice: Luôn gọi super() trong constructor con để init cha đúng.

Ví dụ override greet:
```java
//java

// In Student
@Override
void greet() {
    super.greet();
    System.out.println("I'm a student!");
}
```

```javascript
//javascript

// In Student
greet() {
    super.greet();
    console.log("I'm a student!");
}
```

## Các Hoạt động Phổ biến: Polymorphism, Interfaces và Type Checking

Polymorphism: Gọi method trên reference cha nhưng chạy con's version (runtime). Interfaces: Contract (abstract methods), Java implements, JS như class abstract.

Lý thuyết: Dynamic dispatch (JVM/JS engine quyết định method nào), upcasting an toàn (con -> cha), downcasting cần check (instanceof). Multiple inheritance: Java interfaces (no impl conflict), JS composition (mixins).

Java: instanceof cho type check, abstract classes cho partial impl.

JS: instanceof cho prototype check, duck-typing (nếu có method thì ok).

**So sánh**: Java explicit interfaces (multiple "cha"), JS implicit (Object.create()). Polymorphism JS mạnh với closures, Java với generics.

Ví dụ polymorphism (array of Person):
```java
//java

Person[] people = {new Person("Alice"), new Student("Bob", 1)};
for (Person p : people) p.greet(); // Chạy version đúng
```

```javascript
//javascript

let people = [new Person("Alice"), new Student("Bob", 1)];
people.forEach(p => p.greet()); // Dynamic dispatch
```

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Java Inheritance/Polymorphism | JS Inheritance/Polymorphism   |
|-----------------------|-------------------------------|-------------------------------|
| **Kế thừa**          | Extends/implements strict    | Prototype extends, mixins     |
| **Override**         | @Override, super explicit    | Super, runtime lookup         |
| **Multiple**         | Interfaces only              | Composition over inheritance  |
| **Type Check**       | instanceof compile-safe      | instanceof duck-typing        |
| **Hiệu suất**        | JVM virtual table            | V8 prototype optimization     |
| **Trường hợp dùng**  | Enterprise hierarchy lớn     | Web dynamic components        |

Java xây dựng robust systems, JS nhanh adapt.

## Kết luận: Làm OOP linh hoạt hơn

Inheritance và polymorphism biến OOP thành "siêu năng lực" – thử extends Student thành Graduate, override study() khác nhau. Java dạy hierarchy sạch, JS khuyến khích flexible prototypes. Kết hợp với objects từ bài 5 để app thực tế!

Bạn thấy inheritance hữu ích ở đâu? Comment nhé. Bài sau: Exception Handling trong Java vs JS. Theo dõi series để OOP và error-proof code!

Happy inheriting! 🌳🔄

<!--more-->