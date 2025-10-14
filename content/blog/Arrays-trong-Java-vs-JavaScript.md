+++
author = "Trần Việt Hưng"
title = "Arrays trong Java vs JavaScript: Lưu trữ và xử lý danh sách dữ liệu cho sinh viên mới học"
date = "2025-10-09"
description = "Bài viết cơ bản dành cho sinh viên năm nhất, so sánh Arrays trong Java và JavaScript. Hướng dẫn khai báo, truy cập phần tử, và các method phổ biến!"
tags = [
    "java",
    "javascript",
    "arrays",
    "data-structures",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Sau bài về Cấu trúc Điều khiển, hôm nay mình sẽ giới thiệu **Arrays** – một cấu trúc dữ liệu cơ bản để lưu trữ danh sách các phần tử cùng loại, như danh sách tên học sinh hoặc điểm số. Mình sẽ so sánh Arrays trong Java (fixed-size, typed) và JavaScript (dynamic, flexible), từ cách khai báo, truy cập phần tử đến các method phổ biến như add/remove.

Nếu bạn là sinh viên năm nhất hoặc cấp 3 tự học code, Arrays giúp bạn xử lý dữ liệu nhóm một cách dễ dàng, tránh viết code lặp lại. Java strict với kích thước cố định, JS linh hoạt với push/pop. Hãy cùng khám phá cách chúng hoạt động và áp dụng nhé – code dễ copy-paste!

## Arrays: Vai trò và cách hoạt động cơ bản

Arrays là collection có thứ tự, truy cập bằng index (bắt đầu từ 0), lưu trữ multiple values. Chúng hiệu quả cho linear access (duyệt từ đầu đến cuối), nhưng insert/delete middle kém (shift elements).

Java: Arrays primitive hoặc reference, fixed-size khi declare, typed (int[] cho numbers). Phải import cho ArrayList nếu dynamic.

Ví dụ Java Arrays:
```java
// Primitive array
int[] scores = {90, 85, 95}; // Fixed size 3
scores[0] = 100; // Modify index 0
System.out.println(scores[1]); // 85

// Reference array
String[] names = {"Alice", "Bob"};
names[1] = "Charlie";
System.out.println(names.length); // 2
```

Java Arrays no built-in methods, dùng java.util.Arrays cho sort/copy, hoặc ArrayList cho dynamic size (add/remove).

JavaScript: Arrays dynamic (resize automatic), mixed types, methods built-in (push, pop, slice).

Ví dụ JS Arrays:
```javascript
let scores = [90, 85, 95]; // Dynamic
scores[0] = 100;
scores.push(88); // Add end
console.log(scores[1]); // 85
console.log(scores.length); // 4
```

JS arrays object-like, methods như map/filter cho transformation.

**So sánh**: Java fixed/typed (an toàn, performance), JS dynamic/mixed (dễ, flexible nhưng dễ error type).

## Truy cập và Modify Elements: Index và Methods

Truy cập array[index], modify array[index] = value. Out-of-bound: Java ArrayIndexOutOfBoundsException, JS undefined.

Java methods: Arrays.sort(), Arrays.binarySearch() cho sorted array.

Ví dụ Java sort:
```java
import java.util.Arrays;
int[] scores = {95, 85, 90};
Arrays.sort(scores);
System.out.println(Arrays.toString(scores)); // [85, 90, 95]
```

JS methods: sort(), indexOf(), splice() cho insert/delete.

Ví dụ JS:
```javascript
let scores = [95, 85, 90];
scores.sort((a, b) => a - b); // Ascending
console.log(scores); // [85, 90, 95]
scores.splice(1, 1, 88); // Remove index 1, insert 88
console.log(scores); // [85, 88, 95]
```

**So sánh**: Java utility class (Arrays), JS prototype methods (array.sort()), JS mutable in-place, Java tạo copy nếu cần.

## Common Operations: Duyệt và Tìm kiếm

Duyệt array với for loop hoặc enhanced for (Java), for...of (JS).

Java enhanced for:
```java
String[] names = {"Alice", "Bob"};
for (String name : names) {
    System.out.println("Hello " + name);
}
```

JS for...of:
```javascript
let names = ["Alice", "Bob"];
for (let name of names) {
    console.log("Hello " + name);
}
```

Tìm kiếm: Java Arrays.binarySearch() cho sorted, linear scan thủ công; JS find(), some().

Ví dụ JS find:
```javascript
let scores = [90, 85, 95];
let highScore = scores.find(score => score > 90);
console.log(highScore); // 95
```

**So sánh**: Java no built-in find (stream filter), JS functional methods (find, every) concise.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java Arrays                   | JS Arrays                    |
|-------------------|-------------------------------|------------------------------|
| **Size**         | Fixed (resize manual)        | Dynamic (auto resize)        |
| **Typing**       | Typed (int[] numbers only)   | Mixed types                  |
| **Methods**      | Utility class (Arrays.sort)  | Prototype (sort, push)       |
| **Performance**  | Fast access, no overhead     | V8 optimized, flexible       |
| **Use Case**     | Backend data processing      | Frontend lists, dynamic UI   |

Java an toàn cho large arrays, JS dễ cho interactive data.

## Kết luận: Bắt đầu với cái nào?

Java Arrays cho backend efficient, JS cho frontend dynamic. Khởi đầu với khai báo simple, practice truy cập – arrays là "danh sách" đầu tiên bạn cần!

Bạn gặp khó gì với arrays? Comment chia sẻ nhé. Bài sau: Strings in Java vs JS. Theo dõi series để học cơ bản vững!

Happy arraying! 📊🔢

<!--more-->
