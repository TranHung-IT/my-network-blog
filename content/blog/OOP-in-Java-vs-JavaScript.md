+++
author = "Trần Việt Hưng"
title = "OOP in Java vs JavaScript: Lập trình hướng đối tượng từ cơ bản đến thực tế"
date = "2025-08-16"
description = "Tiếp nối series Java & JavaScript, bài viết so sánh OOP trong Java và JavaScript. Hướng dẫn khái niệm class, inheritance, encapsulation cho sinh viên mới bắt đầu!"
tags = [
    "java",
    "javascript",
    "oop",
    "class",
    "inheritance",
    "encapsulation",
]
categories = [
    "java",
    "javascript",
    "programming",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Sau bài về Serverless Architecture, hôm nay mình sẽ khám phá **Lập trình hướng đối tượng (OOP)** – một cách tiếp cận cốt lõi để tổ chức code theo các object thực tế, giúp dễ maintain và reuse. Mình sẽ so sánh OOP trong Java (class-based, static typing) và JavaScript (prototype-based, dynamic typing), từ khái niệm class, inheritance, encapsulation đến cách áp dụng trong dự án nhỏ.

Nếu bạn là sinh viên năm nhất hoặc cấp 3 tự học code, OOP giúp bạn nghĩ theo "thế giới thực" – ví dụ, một "Car" object có thuộc tính (color) và phương thức (drive). Chúng ta sẽ thấy Java strict hơn cho enterprise, JS flexible cho web, với ví dụ đơn giản – code dễ copy-paste!

## OOP: Các nguyên tắc cốt lõi

OOP dựa trên 4 trụ cột: Encapsulation (gói dữ liệu/phương thức vào class, ẩn internal state qua private/public), Inheritance (class con kế thừa từ cha, reuse code), Polymorphism (method cùng tên nhưng behavior khác, override/interface), Abstraction (ẩn complexity, expose essential).

Java class-based: Define class blueprint, compile-time check type, support multiple inheritance qua interface. JS prototype-based: Objects inherit từ prototype chain, dynamic (add property runtime), no class until ES6 (sugar trên prototype).

OOP giúp modular code, dễ test (mock objects), nhưng over-OOP dẫn đến tight coupling – cân bằng với functional style.

## Class và Object: Định nghĩa và khởi tạo

Class là blueprint định nghĩa structure/behavior, object là instance của class.

Java: Strict class declaration, constructor initialize, new keyword tạo instance.

Ví dụ Java:
```java
public class Car {
    private String color; // Encapsulation: private

    public Car(String color) { // Constructor
        this.color = color;
    }

    public void drive() { // Method
        System.out.println("Driving " + color + " car");
    }

    public String getColor() { return color; } // Getter
}

Car myCar = new Car("red"); // Instance
myCar.drive(); // Output: Driving red car
```

JS ES6 class sugar prototype, constructor function, dynamic property.

Ví dụ JS:
```javascript
class Car {
    constructor(color) { // Constructor
        this.color = color; // No private keyword, use # for private (ES2022)
    }

    drive() { // Method
        console.log("Driving " + this.color + " car");
    }

    getColor() { return this.color; }
}

const myCar = new Car("red"); // Instance
myCar.drive(); // Output: Driving red car
```

So sánh: Java compile-time error nếu type mismatch, JS runtime flexible (add myCar.speed = 100 sau).

## Inheritance và Polymorphism: Kế thừa và đa hình

Inheritance cho phép class con extend cha, reuse code, polymorphism cho method override/interface implement (Java) hoặc prototype chain (JS).

Java: extends cho single inheritance, implements cho multiple, override @Override annotation.

Ví dụ Java:
```java
class Vehicle {
    public void move() {
        System.out.println("Vehicle moving");
    }
}

class Car extends Vehicle { // Inheritance
    @Override
    public void move() { // Polymorphism
        System.out.println("Car driving on road");
    }
}

Vehicle v = new Car(); // Upcast
v.move(); // Output: Car driving on road (dynamic dispatch)
```

JS: extends prototype chain, super() call parent constructor, dynamic method add.

Ví dụ JS:
```javascript
class Vehicle {
    move() {
        console.log("Vehicle moving");
    }
}

class Car extends Vehicle { // Inheritance
    move() { // Polymorphism
        super.move(); // Call parent
        console.log("Car driving on road");
    }
}

const v = new Car(); // Upcast implicit
v.move(); // Output: Vehicle moving \n Car driving on road
```

So sánh: Java strict (no multiple extends, interface for poly), JS dynamic (change prototype runtime).

## Encapsulation và Abstraction: Gói và ẩn

Encapsulation ẩn internal state (private fields), expose qua getters/setters. Abstraction ẩn complexity (abstract class/interface định nghĩa contract).

Java: private fields, public methods, abstract class cho partial impl.

Ví dụ Java:
```java
abstract class Shape {
    protected double area; // Protected for subclass

    public abstract void calculateArea(); // Abstraction

    public double getArea() { return area; } // Encapsulation
}

class Circle extends Shape {
    private double radius; // Encapsulation

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public void calculateArea() {
        area = Math.PI * radius * radius;
    }
}
```

JS: Convention private (_prefix), # private fields (ES2022), abstract không native (throw error in method).

Ví dụ JS:
```javascript
class Shape {
    #area; // Private field

    calculateArea() { // Abstraction
        throw new Error("Must implement calculateArea");
    }

    getArea() { return this.#area; } // Encapsulation
}

class Circle extends Shape {
    #radius;

    constructor(radius) {
        super();
        this.#radius = radius;
    }

    calculateArea() {
        this.#area = Math.PI * this.#radius * this.#radius;
    }
}
```

So sánh: Java enforced encapsulation (access modifier), JS convention-based, # private experimental.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java OOP                      | JS OOP                        |
|-------------------|-------------------------------|-------------------------------|
| **Type Safety**  | Cao (compile-time)           | Thấp (dynamic, runtime)      |
| **Inheritance**  | Single extends, multiple interfaces | Prototype chain, flexible    |
| **Encapsulation** | Strict (private/public)      | Convention (# private new)   |
| **Performance**  | Optimized (JIT)              | V8 optimize, prototype lookup |
| **Use Case**     | Enterprise, large apps       | Web, dynamic scripts         |

Java strict cho robust, JS flexible cho rapid dev.

## Kết luận: Chọn cái nào cho full-stack?

Java OOP cho backend structured, JS OOP cho frontend dynamic. Bắt đầu với class simple, practice inheritance – OOP làm code organized hơn!

Bạn thích OOP Java hay JS hơn? Comment chia sẻ nhé. Bài sau: Error Handling in Java vs JS. Theo dõi series để học OOP vững!

Happy object-oriented! 👥🔗

<!--more-->
