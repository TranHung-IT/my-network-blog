+++
author = "Trần Việt Hưng"
title = "Exception Handling trong Java vs JavaScript: Xử lý lỗi cơ bản"
date = "2025-10-07"
description = "Bài 7 series Lập trình với Java vs JavaScript. Giới thiệu exception handling – cách bắt và xử lý lỗi để code robust, tránh crash đột ngột!"
tags = [
    "java",
    "javascript",
    "exception-handling",
    "error-handling",
    "try-catch",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Lập trình với Java vs JavaScript. Sau bài về Inheritance và Polymorphism – nơi bạn học cách mở rộng OOP để code linh hoạt hơn – hôm nay, bài 7: **Exception Handling** – "lá chắn" bảo vệ chương trình khỏi lỗi bất ngờ, như chia cho 0 hoặc file không tồn tại, giúp code graceful failure thay vì crash thô. Nếu bạn là sinh viên năm nhất hoặc mới tự học, xử lý lỗi là kỹ năng quan trọng: Không chỉ fix bug, mà dự đoán và handle chúng, làm app thực tế hơn như web form validate input.

Exceptions như là một "báo động khẩn cấp" – catch để dập lửa, throw để báo lên. Java dùng checked/unchecked exceptions (compile enforce), JS errors (runtime, async-friendly). Chúng khác ở hierarchy (Java Throwable, JS Error), propagation (Java throws, JS rethrow), và best practices (Java finally, JS async/await try-catch). Hãy cùng khám phá để bạn viết code "bulletproof" từ bài tập đơn giản!

## Exception Handling: Vai trò và nguyên tắc hoạt động cơ bản

Exception Handling là cơ chế bắt (catch) và xử lý (handle) lỗi runtime, ngăn chương trình dừng đột ngột. Vai trò chính: Robustness (tiếp tục chạy), debugging (trace lỗi rõ ràng), separation of concerns (logic chính tách khỏi error code). Không handle, lỗi lan tỏa (propagation) gây crash; có handle, recover hoặc log graceful.

Nguyên tắc cốt lõi:
- **Try-Catch-Finally**: Try (code rủi ro), Catch (xử lý lỗi cụ thể), Finally (luôn chạy, cleanup như close file).
- **Throw/Rethrow**: Ném lỗi thủ công (throw new Error()), rethrow để propagate lên.
- **Hierarchy**: Lỗi phân loại (general vs specific) để catch selective.

Java: Structured, checked exceptions (phải declare throws, compile force handle), unchecked (RuntimeException, optional). Throwable superclass (Error vs Exception). Phù hợp enterprise, enforce good practices.

JavaScript: Dynamic, tất cả errors runtime (Error object), no checked. Try-catch cho sync, Promise.catch/await cho async. Lý tưởng web, nơi errors thường từ network/UI.

**So sánh cốt lõi**: Java proactive (compile remind handle), JS reactive (runtime, flexible cho callbacks). Cả hai dùng try {} catch (e) {}, nhưng Java multi-catch, JS no finally native (dùng .finally() cho promises).

Ví dụ try-catch cơ bản (chia cho 0):
```java
//java

try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Lỗi chia: " + e.getMessage());
}
```

```javascript
//javascript

try {
    let result = 10 / 0;
} catch (e) {
    console.log("Lỗi chia: " + e.message);
}
```

## Khai báo và Ném Lỗi: Throws, Throw và Types

Khai báo: Java method throws Exception (checked), JS no need. Throw: Tạo instance Error/Exception, ném khi condition sai (validation).

Lý thuyết sâu: Propagation: Lỗi "leo thang" stack trace đến handler đầu tiên. Custom exceptions: Extend Exception (Java) hoặc Error (JS) cho domain-specific. Checked vs Unchecked: Checked force handle (IO errors), unchecked cho programming errors (NullPointer).

Java: Throws clause ở method signature, multi-catch (catch (A | B e)). Resources auto-close với try-with-resources (Java 7+).

JS: Throw any (string/number), but Error recommended cho stack. Async: Try-catch trong async function, hoặc .catch().

**So sánh**: Java typed exceptions (catch specific), JS generic (e instanceof Error). Practice: Luôn catch cụ thể trước general để avoid masking errors.

Ví dụ throw custom:
```java
//java

throw new IllegalArgumentException("Input invalid");
```

```javascript
//javascript

throw new Error("Input invalid");
```

## Các Hoạt động Phổ biến: Finally, Propagation và Best Practices

Finally: Chạy sau try/catch (cleanup), Java native, JS Promise.finally(). Propagation: Rethrow (throw e; sau log). Best practices: Don't swallow errors (catch nhưng log/rethrow), specific catches, fail-fast (throw sớm).

Lý thuyết: Stack trace: Traceback lỗi (line/method), Java getStackTrace(), JS e.stack. Global handlers: Java Thread.setDefaultUncaughtExceptionHandler(), JS window.onerror.

Java: Hierarchical (catch Exception catch-all), checked encourage handle all paths.

JS: Event-driven errors (addEventListener error), async chain .catch().

**So sánh**: Java comprehensive (resources, checked), JS lightweight (global, async). JS dễ cho browser errors, Java cho server robustness.

Ví dụ finally:
```java
//java

try {
    // risky code
} catch (Exception e) {
    // handle
} finally {
    // cleanup
}
```

```javascript
//javascript

try {
    // risky code
} catch (e) {
    // handle
} finally {
    // cleanup
}
```

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Java Exception Handling      | JS Exception Handling        |
|-----------------------|------------------------------|------------------------------|
| **Loại lỗi**         | Checked/unchecked           | All runtime (Error)          |
| **Syntax**           | Try-catch-finally, throws   | Try-catch-finally, throw     |
| **Async**            | Sync only, separate async   | Native với await/Promises    |
| **Enforcement**      | Compile-time checked        | Runtime flexible             |
| **Hiệu suất**        | Overhead checked            | Lightweight browser          |
| **Trường hợp dùng**  | Server robust apps          | Web interactive error UI     |

Java enforce discipline, JS quick recovery.

## Kết luận: Làm code an toàn hơn với Exceptions

Exception handling biến lỗi thành cơ hội học hỏi – thử wrap division trong try-catch, throw nếu input âm. Java dạy proactive handling, JS reactive cho dynamic. Kết hợp với OOP từ bài trước để custom exceptions!

Bạn từng gặp lỗi gì thú vị? Comment chia sẻ nhé. Bài sau: Collections và Data Structures nâng cao trong Java vs JS. Tiếp tục series để code production-ready!

Happy error-handling! 🛡️⚠️

<!--more-->