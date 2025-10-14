+++
author = "Trần Việt Hưng"
title = "Xử lý Lỗi trong Java vs JavaScript: Cơ bản cho sinh viên mới học"
date = "2025-10-09"
description = "Bài viết cơ bản dành cho sinh viên năm nhất, so sánh cách xử lý lỗi trong Java (try-catch, exceptions) và JavaScript (try-catch, throw). Hướng dẫn debug và tránh crash!"
tags = [
    "java",
    "javascript",
    "error-handling",
    "exceptions",
    "try-catch",
    "debugging",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Sau bài về Arrays, hôm nay mình sẽ giới thiệu **Xử lý Lỗi** – cách code "xử lý" khi có vấn đề xảy ra, như chia cho 0 hoặc file không tồn tại, để app không crash đột ngột. Mình sẽ so sánh cách Java (exceptions hierarchy) và JavaScript (throw/catch) xử lý lỗi, từ cơ chế cơ bản đến debug tips.

Nếu bạn là sinh viên năm nhất hoặc cấp 3 tự học code, xử lý lỗi giúp app "bền vững" – thay vì crash, app báo lỗi thân thiện và tiếp tục. Java strict với checked/unchecked exceptions, JS flexible với runtime errors. Hãy cùng khám phá cách chúng hoạt động và áp dụng nhé – code dễ copy-paste!

## Xử lý Lỗi: Vai trò và cách hoạt động

Xử lý lỗi (error handling) là cơ chế bắt và xử lý unexpected conditions, tránh program terminate. Dùng try-catch để wrap risky code, throw để raise error.

Java: Exceptions là objects kế thừa Throwable (Error cho system, Exception cho app). Checked exceptions (compile force handle, like IOException), unchecked (runtime, like NullPointerException).

Ví dụ Java try-catch:
```java
try {
    int result = 10 / 0; // Risky code
} catch (ArithmeticException e) {
    System.out.println("Lỗi chia cho 0: " + e.getMessage());
} finally {
    System.out.println("Luôn chạy cuối cùng"); // Cleanup
}
```

Java throw custom:
```java
public void checkAge(int age) {
    if (age < 18) {
        throw new IllegalArgumentException("Tuổi phải >= 18");
    }
    System.out.println("OK");
}

try {
    checkAge(15);
} catch (IllegalArgumentException e) {
    System.out.println("Lỗi: " + e.getMessage());
}
```

Java exceptions propagate up call stack nếu không catch, finally luôn run (resource cleanup).

JavaScript: Errors là objects (Error, TypeError, SyntaxError), runtime dynamic. Try-catch bắt, throw raise.

Ví dụ JS try-catch:
```javascript
try {
    let result = 10 / 0; // Risky code
} catch (error) {
    console.log("Lỗi chia cho 0: " + error.message);
} finally {
    console.log("Luôn chạy cuối cùng");
}
```

JS throw custom:
```javascript
function checkAge(age) {
    if (age < 18) {
        throw new Error("Tuổi phải >= 18");
    }
    console.log("OK");
}

try {
    checkAge(15);
} catch (error) {
    console.log("Lỗi: " + error.message);
}
```

JS errors bubble up, finally run, no checked (tất cả runtime).

**So sánh**: Java checked force handle (good practice), JS runtime flexible (dễ forget catch).

## Common Errors: Phân loại và xử lý

Errors thường từ input invalid, network fail, memory out.

Java: ArithmeticException (math), NullPointerException (null access), ArrayIndexOutOfBounds (index wrong).

Ví dụ handle NPE:
```java
String name = null;
try {
    System.out.println(name.length());
} catch (NullPointerException e) {
    System.out.println("Name is null");
    name = "Default";
    System.out.println(name.length()); // 7
}
```

JS: TypeError (wrong type), ReferenceError (undeclared var), SyntaxError (parse fail).

Ví dụ handle TypeError:
```javascript
let name = null;
try {
    console.log(name.length);
} catch (error) {
    if (error instanceof TypeError) {
        console.log("Name is null");
        name = "Default";
        console.log(name.length); // 7
    }
}
```

**So sánh**: Java specific exceptions (ArithmeticException), JS generic (Error subtypes), JS instanceof check type.

## Debug Tips: Tìm và fix lỗi

Debug là quá trình tìm root cause, dùng print/log, debugger tools.

Java: System.out.println() cho log, IntelliJ debugger breakpoint/step.

Ví dụ debug Java:
```java
public static void main(String[] args) {
    int[] arr = {1, 2};
    System.out.println(arr[2]); // ArrayIndexOutOfBounds
}
```

JS: console.log(), browser DevTools debugger.

Ví dụ debug JS:
```javascript
let arr = [1, 2];
console.log(arr[2]); // undefined, no crash
```

**So sánh**: Java crash on error (force handle), JS continue (silent fail, cần check).

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java Error Handling           | JS Error Handling             |
|-------------------|-------------------------------|------------------------------|
| **Checked Errors** | Yes (compile force)          | No (runtime only)            |
| **Exception Types** | Specific (NPE, IOE)          | Generic (TypeError, Error)   |
| **Propagation**  | Bubble up if not caught      | Bubble up if not caught      |
| **Debugging**    | IDE debugger, stack trace    | Console, DevTools            |
| **Use Case**     | Enterprise, robust apps      | Web, forgiving scripts       |

Java an toàn cho production, JS dễ cho prototyping.

## Kết luận: Bắt đầu với cái nào?

Java error handling cho backend reliable, JS cho frontend forgiving. Khởi đầu với try-catch simple, practice throw – app sẽ "bền" hơn!

Bạn gặp lỗi gì thường? Comment chia sẻ nhé. Bài sau: Strings in Java vs JS. Theo dõi series để học cơ bản vững!

Happy debugging! 🐛🔍

<!--more-->