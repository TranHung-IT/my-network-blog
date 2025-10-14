+++
author = "Trần Việt Hưng"
title = "Cấu trúc Điều khiển trong Java vs JavaScript: If-else, Loops cơ bản"
date = "2025-10-01"
description = "Bài viết đầu tiên trong series Lập trình với Java vs JavaScript. Giới thiệu cấu trúc điều khiển như if-else, for/while loops – nền tảng để code 'thông minh' xử lý logic!"
tags = [
    "java",
    "javascript",
    "control-structures",
    "if-else",
    "loops",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, chào mừng bạn đến với series blog đầu tiên về Lập trình với Java và JavaScript trên blog của mình. Nếu bạn là sinh viên học Công nghệ thông tin hoặc là người có quan tâm tới việc coding hay đang bắt đầu tự học code từ con số 0, series này sẽ giúp bạn nắm vững các khái niệm cơ bản qua cách thể hiện code giữa hai ngôn ngữ phổ biến: Java (mạnh mẽ cho backend, strict syntax) và JavaScript (linh hoạt cho web, dynamic). Hôm nay, bài 1: **Cấu trúc Điều khiển** – "bộ não" của chương trình, quyết định code chạy theo điều kiện nào, lặp bao nhiêu lần. Không có chúng, code chỉ là chuỗi lệnh thẳng tuột, nhàm chán!

Trước tiên ta nên biết điều căn bản rằng Java yêu cầu khai báo kiểu dữ liệu chặt chẽ, JS thì "thoải mái" hơn nhưng dễ mắc lỗi nếu không cẩn thận. Hãy cùng khám phá cách if-else kiểm tra điều kiện, loops lặp lại công việc – nền tảng để bạn viết chương trình thực tế như tính điểm học sinh hay duyệt danh sách!

## Cấu trúc Điều khiển: Vai trò và nguyên tắc cơ bản

Cấu trúc điều khiển (Control Structures) là các lệnh giúp chương trình "quyết định" và "lặp lại", thay vì chạy tuyến tính từ trên xuống dưới. Chúng chia thành hai loại chính: **Điều kiện (Conditional)** như if-else (kiểm tra đúng/sai), và **Lặp (Iteration)** như for/while (lặp đến khi đủ).

Lý do cần chúng? Trong đời thực, bạn không làm mọi việc giống nhau – ví dụ, nếu trời mưa thì ở nhà học code, else ra ngoài chơi. Tương tự, code cần kiểm tra điều kiện để xử lý dữ liệu động. Java và JS đều dùng boolean (true/false) cho điều kiện, nhưng Java compile-time check lỗi (an toàn), JS runtime (dễ test nhanh).

**Nguyên tắc chung**:
- **Sequential**: Code chạy mặc định từ đầu đến cuối.
- **Selection**: Chọn nhánh dựa trên điều kiện (if-else, switch).
- **Repetition**: Lặp khối lệnh (for, while, do-while).
Cả hai ngôn ngữ đều hỗ trợ, nhưng Java verbose hơn (nhiều dấu ngoặc), JS concise (ít dòng hơn).

## If-Else và Switch: Quyết định dựa trên điều kiện

If-else là "cổng kiểm soát" cơ bản: Kiểm tra biểu thức boolean, nếu true chạy khối if, false chạy else (nếu có). Có thể lồng if (nested) cho nhiều mức, hoặc dùng else-if chain cho chuỗi điều kiện.

Lý thuyết sâu hơn: Điều kiện phải evaluate thành boolean – Java strict (phải dùng ==, >, etc.), JS loose (0/false/null là falsy, khác là truthy, dễ nhầm lẫn). Switch thay thế if-else dài cho so sánh bằng (equality), dùng case labels.

**So sánh**:
- Java: Phải khai báo biến kiểu rõ (int age), dùng {} bắt buộc cho khối, switch hỗ trợ int/String/enum (từ Java 7).
- JS: Không cần khai báo kiểu, {} optional nếu một dòng, switch giống nhưng case cần break để tránh fall-through.

Ví dụ minh họa if-else (tính phân loại điểm):
```java
//java

int score = 85;
if (score >= 90) {
    System.out.println("Xuất sắc");
} else if (score >= 70) {
    System.out.println("Tốt");
} else {
    System.out.println("Cần cố gắng");
}
```

```javascript
//javascript 

let score = 85;
if (score >= 90) {
    console.log("Xuất sắc");
} else if (score >= 70) {
    console.log("Tốt");
} else {
    console.log("Cần cố gắng");
}
```

Switch ví dụ (ngày trong tuần):
Java switch chặt chẽ hơn, JS linh hoạt với ===.

**Lợi ích**: Giúp code readable, tránh lặp if dài. Nhược điểm: Nested sâu dễ rối (dùng switch hoặc refactor).

## Loops: Lặp lại để xử lý dữ liệu nhóm

Loops dùng để thực hiện khối lệnh nhiều lần, tiết kiệm code. Ba loại chính:
- **For**: Biết trước số lần lặp (counter-based), lý tưởng cho duyệt mảng fixed.
- **While/Do-While**: Lặp đến khi điều kiện false (condition-based), do-while chạy ít nhất một lần.
Lý thuyết: Loop có init (khởi tạo), condition (kiểm tra), update (cập nhật biến), body (khối lặp). Infinite loop (vô tận) nếu condition luôn true – debug bằng break/continue.

**So sánh**:
- Java: For cổ điển (for(int i=0; i<n; i++)), enhanced for cho iterable (như array). While/do-while giống C.
- JS: For giống, nhưng for...of cho iterable (array/object), while/do-while tương tự. JS có for...in cho object keys (dễ lạm dụng).

Ví dụ for loop (in số từ 1-5):
```java
//java

for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

```javascript
//javascript

for (let i = 1; i <= 5; i++) {
    console.log(i);
}
```

While ví dụ (lặp đến khi x > 10):
Java/JS tương đồng, nhưng JS dùng let/const cho scope tốt hơn.

**Lợi ích**: Xử lý dữ liệu lớn hiệu quả (O(n) time). Nhược điểm: Dễ infinite nếu quên update.

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Java Control Structures          | JS Control Structures            |
|-----------------------|----------------------------------|----------------------------------|
| **Syntax**           | Verbose, strict typing           | Concise, loose typing            |
| **Error Handling**   | Compile-time (an toàn sớm)       | Runtime (dễ fix nhanh)           |
| **If-Else/Switch**   | Bắt buộc {}, switch enum/String  | {} optional, switch fall-through |
| **Loops**            | Enhanced for iterable            | for...of/in linh hoạt            |
| **Performance**      | Optimized JVM                    | V8 engine nhanh cho web          |
| **Use Case**         | Backend logic phức tạp           | Frontend interactive UI          |

Java phù hợp dự án lớn (ít lỗi), JS cho prototype nhanh.

## Kết luận: Xây dựng nền tảng vững chắc

Cấu trúc điều khiển là "tim mạch" của mọi chương trình – bắt đầu với if-else đơn giản để kiểm tra input, rồi loops để tự động hóa. Java dạy bạn kỷ luật, JS khuyến khích sáng tạo. Practice bằng cách viết chương trình đoán số hoặc tính tổng mảng nhỏ!

Bạn thấy phần nào khó nhất? Comment bên dưới nhé. Bài sau: Arrays trong Java vs JS. Theo dõi series để học cơ bản từng bước!

Happy coding! 🔄🧠

<!--more-->