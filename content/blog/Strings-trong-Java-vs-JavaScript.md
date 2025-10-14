+++
author = "Trần Việt Hưng"
title = "Strings trong Java vs JavaScript: Xử lý văn bản và chuỗi ký tự cơ bản"
date = "2025-10-03"
description = "Tiếp nối series, Strings trong Lập trình với Java và JavaScript. Khám phá khai báo, nối chuỗi, substring và methods phổ biến để xử lý text dễ dàng!"
tags = [
    "java",
    "javascript",
    "strings",
    "text-processing",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, chào mừng trở lại series Lập trình với Java vs JavaScript trên blog cá nhân. Sau bài về Arrays – nơi bạn học cách lưu trữ và duyệt danh sách dữ liệu – hôm nay, bài 3: **Strings** – cấu trúc dữ liệu dành riêng cho văn bản, như tên người, câu chào hoặc URL web. Nếu bạn là sinh viên năm nhất hoặc mới tự học lập trình, strings là "ngôn ngữ" của code: Chúng giúp hiển thị thông điệp thân thiện, xử lý input user, và là nền tảng cho text manipulation trong mọi app.

Strings như dãy hạt châu nối liền, không dễ thay đổi giữa chừng. Java coi strings như object immutable (không thay đổi, an toàn), JS thì primitive nhưng có methods mutable-like. Chúng khác ở cách lưu trữ (Java String pool, JS UTF-16), concatenation (Java + hoặc StringBuilder, JS + hoặc template literals), và methods (Java verbose, JS concise). Hãy cùng tìm hiểu để bạn tự tin xử lý text từ bài tập đơn giản như chào hỏi cá nhân hóa!

## Strings: Vai trò và nguyên tắc hoạt động cơ bản

Strings là chuỗi ký tự (sequence of characters), đại diện cho văn bản trong code – từ "Hello World" đến dữ liệu JSON. Vai trò chính: Lưu trữ và thao tác text, hỗ trợ internationalization (i18n) với Unicode. Không như numbers/booleans (primitive đơn giản), strings xử lý mutable vs immutable ảnh hưởng đến hiệu suất và thread-safety.

Nguyên tắc cốt lõi:
- **Immutable vs Mutable**: Immutable (không thay đổi nội dung sau tạo) tránh side-effect (thay đổi bất ngờ), nhưng tạo nhiều object mới khi modify (tốn bộ nhớ nếu lặp). Mutable cho hiệu quả nhưng rủi ro concurrency.
- **Encoding**: Java UTF-16 (2 bytes/char, hỗ trợ emoji), JS cũng UTF-16 nhưng primitive (nhẹ hơn).
- **Indexing**: Truy cập ký tự qua index (0-based), length cho độ dài.

Java: Strings là class (java.lang.String), immutable, lưu trong String pool (tái sử dụng instance để tiết kiệm RAM). Khai báo literal tự động interned. Phù hợp backend xử lý log/email lớn.

JavaScript: Strings primitive (nhưng có wrapper object khi gọi methods), immutable thực chất nhưng methods trả về new string. Lý tưởng frontend, nơi text thay đổi theo DOM.

**So sánh cốt lõi**: Java object-oriented (methods như length(), equals()), JS primitive-friendly (length property, == loose equality). Cả hai dùng "" hoặc '' cho literal, nhưng Java cần import nếu dùng advanced.

Ví dụ khai báo cơ bản (lưu tên):
```java
//java

String name = "Alice"; // Immutable object
```

```javascript
//javascript

let name = "Alice"; // Primitive
```

## Truy cập và Sửa đổi Ký tự: Index và Concatenation

Truy cập: charAt(index) hoặc [index] (JS hỗ trợ bracket notation). Sửa đổi: Không trực tiếp (immutable), mà tạo string mới qua concat hoặc replace.

Lý thuyết sâu: Concatenation lặp nhiều lần tạo O(n^2) time nếu naive (mỗi + tạo new string). Giải pháp: Java dùng StringBuilder (mutable buffer), JS template literals (`` ${var} ``) hoặc join() cho array.

Java: + operator overload cho String, nhưng khuyến khích StringBuilder.append() cho loop. equals() so sánh nội dung (không phải == reference).

JS: + concat, hoặc += (nhưng tránh loop), template literals cho interpolation an toàn (tránh injection). === strict equality.

**So sánh**: Java verbose nhưng an toàn (null check), JS concise nhưng loose (coercion có thể nhầm). Practice: Luôn dùng equals/=== cho so sánh text.

Ví dụ concatenation (chào hỏi):
```java
//java

String greeting = "Hello " + name; // "Hello Alice"
```

```javascript
//javascript

let greeting = `Hello ${name}`; // Template literal
```

## Các Hoạt động Phổ biến: Substring, Search và Transform

Substring: Trích xuất phần con (start, end index). Search: indexOf() tìm vị trí, includes() kiểm tra tồn tại. Transform: toUpperCase(), replace(), trim() loại bỏ khoảng trắng.

Lý thuyết: Operations thường O(n) time (scan toàn string), regex cho pattern matching phức tạp (Java Pattern.compile(), JS RegExp). Strings hỗ trợ iteration như arrays (for loop qua char).

Java: Methods instance (name.substring(0,3) -> "Ali"), startsWith/endsWith cho prefix/suffix. split() dùng delimiter.

JS: Methods chainable (name.toUpperCase().includes("A")), slice() cho substring, match() với regex.

**So sánh**: Java utility-rich (như valueOf() convert primitive), JS functional (split(' ').map(...)). JS hỗ trợ spread [...string] thành array chars dễ dàng.

Ví dụ substring và search:
```java
//java

String sub = name.substring(0, 3); // "Ali"
int pos = name.indexOf("i"); // 3
```

```javascript
//javascript

let sub = name.slice(0, 3); // "Ali"
let pos = name.indexOf("i"); // 3
```

## Ưu nhược điểm tổng hợp

| Tiêu chí            | Java Strings                  | JS Strings                    |
|---------------------|-------------------------------|-------------------------------|
| **Loại dữ liệu**   | Immutable object (String pool)| Primitive (wrapper khi method)|
| **Concat**         | + hoặc StringBuilder (hiệu quả)| + hoặc template literals (concise)|
| **So sánh**        | equals() (content), == (ref) | === strict, == loose          |
| **Methods**        | Instance verbose (charAt)    | Property/method mix (length, includes)|
| **Hiệu suất**      | Tối ưu pool cho duplicate    | Nhẹ cho web text dynamic      |
| **Trường hợp dùng**| Backend parsing log/email    | Frontend form validation/UI   |

Java nhấn mạnh safety, JS ưu tiên speed prototyping.

## Kết luận: Làm chủ văn bản trong code

Strings là "giao tiếp" của chương trình – bắt đầu với khai báo và concat đơn giản, kết hợp loops từ bài 1 để xử lý text dài. Java dạy bạn immutable thinking (ít bug), JS khuyến khích expressive code. Áp dụng: Viết hàm format tên đầy đủ từ input!

Phần nào về strings bạn tò mò nhất? Comment nhé. Bài sau: Functions/Methods trong Java vs JS. Tiếp tục series để cơ bản vững vàng!

Happy stringing! 📝🔤

<!--more-->