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

Chào các bạn! Mình là Trần Việt Hưng, cùng quay lại với series Lập trình với Java vs JavaScript. Ở bài này, chúng ta nói về **Exception Handling** – “lá chắn” giúp chương trình không gục ngã trước những tình huống ngoài ý muốn như chia cho 0 hay đọc file không tồn tại. Đây là kỹ năng mà ai viết code thật cũng phải đối mặt sớm muộn: không chỉ sửa lỗi, mà còn phải đoán trước lỗi sẽ xảy ra ở đâu. Mình từng quên đặt try-catch trong đồ án Java và chương trình crash ngay trước mặt thầy – cú ngã đáng nhớ nhất học kỳ đó. Giờ thì cùng tìm hiểu cách giúp code “ngã mà không đau” nhé. 🧯

## Exception Handling: Vai trò và nguyên tắc hoạt động cơ bản

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Với mình, Java luôn nghiêm khắc — checked exception cứ như lời nhắc của thầy: “Em phải xử lý trường hợp xấu nữa chứ”. Còn JavaScript thì thoải mái hơn, kiểu “cứ chạy đi rồi tính”, nên đôi khi mình quên catch và console đỏ lòm. Mỗi ngôn ngữ dạy mình một bài học: Java dạy cẩn thận, JS dạy ứng biến. Bạn thì sao, có lần nào lỗi bất ngờ khiến bạn học được điều gì chưa? 😄

## Khai báo và Ném Lỗi: Throws, Throw và Types

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Mình từng dùng throws ở Java method để "đẩy trách nhiệm" lên caller – tiện cho team lab, nhưng JS throw simple thì nhanh hơn khi prototype validation form. Custom Error ở JS giúp log rõ ràng hơn cho dự án cá nhân. Cá nhân mình thích Java throws cho structure, JS cho speed. Bạn hay throw lỗi kiểu gì?

## Các Hoạt động Phổ biến: Finally, Propagation và Best Practices

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Finally ở Java cứu mình khỏi quên close file trong lab – auto-cleanup siêu tiện! JS .finally() cho promises thì mượt mà với async fetch ở dự án web. Mình khuyên: Luôn log e.stack trước rethrow để debug dễ. Bạn thấy finally hữu ích ở đâu?

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

### Tổng kết
Bảng này như so sánh "bảo hiểm toàn diện" (Java) vs "first-aid kit nhanh" (JS) trong học lập trình của mình. Java checked giúp code robust ở đồ án trường, JS async catch cho web mượt mà. Không cái nào vượt trội – mình dùng Java cho backend, JS cho frontend!

## Kết luận: Làm code an toàn hơn với Exceptions

Exception handling biến lỗi thành cơ hội học hỏi – thử wrap division trong try-catch, throw nếu input âm. Java dạy proactive handling, JS reactive cho dynamic. Kết hợp với OOP từ bài trước để custom exceptions! Mình đã áp dụng trong bài tập, và app ít crash hơn hẳn.

Bạn từng gặp lỗi gì thú vị? Bài sau: Collections và Data Structures nâng cao trong Java vs JS. Tiếp tục series để code production-ready. Happy error-handling! 🛡️⚠️

<!--more-->