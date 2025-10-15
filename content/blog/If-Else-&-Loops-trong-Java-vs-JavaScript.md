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

Chào các bạn! Mình là Trần Việt Hưng, một sinh viên năm 4 CNTT muốn chia sẻ những gì mình học được qua các môn lập trình ở trường và vài dự án nhỏ. Chào mừng bạn đến với series blog đầu tiên về **Lập trình với Java và JavaScript** – nơi mình so sánh hai ngôn ngữ qua lăng kính của một newbie sắp ra trường, với cả kiến thức lý thuyết lẫn những "cú ngã" cá nhân khi code. Nếu bạn cũng là sinh viên, tự học code từ zero, hay chỉ tò mò, series này sẽ giúp bạn nắm cơ bản một cách dễ hiểu. Hôm nay, bài 1: **Cấu trúc Điều khiển** – "bộ não" quyết định code chạy logic nào, lặp bao nhiêu lần. Không có chúng, code chỉ là đường thẳng nhàm chán! Mình từng mất cả buổi vì quên break trong loop khi làm bài tập, nên hôm nay mình sẽ chia sẻ cách tránh nhé. Let's go! 🚀

## Cấu trúc Điều khiển: Vai trò và nguyên tắc cơ bản

### Kiến thức cốt lõi
Cấu trúc điều khiển (Control Structures) là các lệnh giúp chương trình "quyết định" và "lặp lại", thay vì chạy tuyến tính từ trên xuống dưới. Chúng chia thành hai loại chính: **Điều kiện (Conditional)** như if-else (kiểm tra đúng/sai), và **Lặp (Iteration)** như for/while (lặp đến khi đủ).

Lý do cần chúng? Trong đời thực, bạn không làm mọi việc giống nhau – ví dụ, nếu trời mưa thì ở nhà học code, else ra ngoài chơi. Tương tự, code cần kiểm tra điều kiện để xử lý dữ liệu động. Java và JS đều dùng boolean (true/false) cho điều kiện, nhưng Java compile-time check lỗi (an toàn), JS runtime (dễ test nhanh).

**Nguyên tắc chung**:
- **Sequential**: Code chạy mặc định từ đầu đến cuối.
- **Selection**: Chọn nhánh dựa trên điều kiện (if-else, switch).
- **Repetition**: Lặp khối lệnh (for, while, do-while).
Cả hai ngôn ngữ đều hỗ trợ, nhưng Java verbose hơn (nhiều dấu ngoặc), JS concise (ít dòng hơn).

### Góc nhìn cá nhân
Là sinh viên, mình học cấu trúc này đầu tiên ở môn Lập trình cơ bản với Java – nó ép mình viết rõ ràng, tránh lỗi ngu ngốc sau này. Còn khi tự học JS cho dự án web cá nhân, sự linh hoạt giúp mình prototype nhanh hơn, dù đôi khi "falsy" values làm mình bực mình. Nếu bạn cũng là newbie, thử JS trước để không nản với syntax dài dòng của Java. Bạn đã từng code mà quên điều kiện chưa? 😅

## If-Else và Switch: Quyết định dựa trên điều kiện

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân
Mình từng dùng if-else chain dài trong bài tập Java để validate form – an toàn nhưng code rối rắm như "mì gói". Khi thử switch trong JS cho dự án nhỏ, nhanh hơn, nhưng phải nhớ break kẻo fall-through làm chương trình crash. Cá nhân mình thích Java cho logic phức tạp ở bài tập trường, JS cho UI tương tác đơn giản. Nếu bạn đang làm đồ án nhỏ, bắt đầu với if-else đơn giản thôi!

## Loops: Lặp lại để xử lý dữ liệu nhóm

### Kiến thức cốt lõi
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

### Góc nhìn cá nhân 
Loops là phần mình hay dùng nhất trong bài tập – trong dự án JS cá nhân, for...of giúp duyệt array user data mượt mà, tiết kiệm thời gian so với Java's enhanced for. Nhưng Java's strict typing cứu mình khỏi off-by-one error nhiều lần khi làm lab. Mình khuyên: Dùng while cho game loop đơn giản (như đoán số), for cho data processing. Bạn hay gặp infinite loop không? Mẹo của mình: Luôn test với n=1 trước!

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

### Tổng kết
Tổng hợp lại, Java như "huấn luyện viên nghiêm khắc", JS như "bạn thân chill". Không ngôn ngữ nào hoàn hảo – mình dùng cả hai cho các môn học. Nếu chọn một, tùy bài tập: Enterprise thì Java, web app thì JS.

## Kết luận: Xây dựng nền tảng vững chắc

Cấu trúc điều khiển là "tim mạch" của mọi chương trình – bắt đầu với if-else đơn giản để kiểm tra input, rồi loops để tự động hóa. Java dạy bạn kỷ luật, JS khuyến khích sáng tạo. Practice bằng cách viết chương trình đoán số hoặc tính tổng mảng nhỏ! Mình đã thử trong lab, và nó giúp mình tự tin hơn hẳn.

Bạn thấy phần nào khó nhất? Bài sau: Arrays trong Java vs JS. Theo dõi series để học cơ bản từng bước. Happy coding! 🔄🧠

<!--more-->