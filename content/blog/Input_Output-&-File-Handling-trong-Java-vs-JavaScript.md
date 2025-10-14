+++
author = "Trần Việt Hưng"
title = "I/O và File Handling trong Java vs JavaScript: Xử lý input/output và file"
date = "2025-10-12"
description = "Bài 12 series Lập trình với Java vs JavaScript. Giới thiệu I/O và file handling – cách đọc/ghi dữ liệu từ file, console, network để code tương tác với thế giới bên ngoài!"
tags = [
    "java",
    "javascript",
    "io",
    "file-handling",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Lập trình với Java vs JavaScript trên blog cá nhân. Sau bài về Concurrency và Multithreading – nơi bạn học cách xử lý song song để code responsive hơn – hôm nay, bài 12: **I/O và File Handling** – "cầu nối" giữa code và thế giới thực, giúp đọc/ghi dữ liệu từ file, console hoặc network, như lưu điểm học sinh vào CSV hoặc đọc config từ JSON. Nếu bạn là sinh viên năm nhất hoặc mới tự học, I/O là bước thực tế: Không chỉ tính toán trong memory, mà persist data, tránh mất mát khi app tắt.

I/O (Input/Output) như "dòng chảy dữ liệu" – input từ ngoài vào, output ra ngoài, file như "hộp lưu trữ bền vững". Java dùng streams (byte/char, buffered cho hiệu quả), JS Node.js fs module (sync/async), browser File API. Chúng khác ở model (Java blocking/non-blocking NIO, JS async default), error handling (Java IOException, JS callbacks/errors), và platforms (Java cross-platform, JS Node cho server, browser limited). Hãy cùng khám phá để bạn viết code "persist" đầu tiên!

## I/O và File Handling: Vai trò và nguyên tắc hoạt động cơ bản

I/O (Input/Output) là quá trình trao đổi dữ liệu với external resources (file, console, socket). File Handling: Specific cho đọc/ghi file system, persist data beyond runtime. Vai trò chính: Persistence (lưu lâu dài), integration (kết nối external systems), user interaction (console input).

Nguyên tắc cốt lõi:
- **Streams vs Buffers**: Stream là sequence bytes/chars (sequential access), buffer tạm lưu để giảm direct I/O calls (hiệu quả hơn raw reads).
- **Blocking vs Non-Blocking**: Blocking (chờ I/O done, đơn giản nhưng slow), non-blocking (tiếp tục code, dùng callbacks/futures).
- **Encoding**: UTF-8 default cho text, binary cho files như images.

Java: java.io package (FileInputStream/OutputStream), NIO (New I/O từ Java 4) cho non-blocking/channels. Phù hợp desktop/server, với try-with-resources auto-close.

JavaScript: Node.js fs (fs.readFileSync/async), browser FileReader API (client-side). Lý tưởng web, async để tránh block UI thread.

**So sánh cốt lõi**: Java low-level streams (versatile), JS high-level APIs (convenient). Cả hai handle exceptions/errors, nhưng Java checked IOException, JS runtime.

Ví dụ đọc file cơ bản (text):
```java
//java

// Try-with-resources
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    String line = br.readLine();
}
```

```javascript
//javascript

// Node.js async
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    let line = data;
});
```

## Khai báo I/O và Operations: Reading, Writing và Buffering

Khai báo: Java File f = new File("path"), JS fs.createReadStream() hoặc path module. Reading: Sequential (readLine/byte[]), random access (seek position). Writing: Append/overwrite, flush buffer.

Lý thuyết sâu: Buffering: Read/write chunks (e.g., 8KB) thay vì byte-by-byte, giảm sys calls. Paths: Absolute/relative, cross-platform (Java File.separator, JS path.join()). Serialization: Convert objects to bytes (Java ObjectOutputStream, JS JSON.stringify).

Java: RandomAccessFile cho read/write mid-file, PrintWriter cho formatted output.

JS: Stream API (Readable/Writable từ Node), Blob/File cho browser upload.

**So sánh**: Java verbose nhưng control fine-grained, JS callback/promises cho async. Practice: Luôn close resources (auto ở Java, manual ở JS) để tránh leaks.

Ví dụ ghi file:
```java
//java

try (PrintWriter pw = new PrintWriter("output.txt")) {
    pw.println("Hello World");
}
```

```javascript
//javascript

fs.writeFile('output.txt', 'Hello World', err => {
    if (err) throw err;
});
```

## Các Hoạt động Phổ Biến: Console I/O, Paths và Error Handling

Console I/O: Java System.in/out (Scanner/printf), JS process.stdin/stdout (Node) hoặc prompt(). Paths: Normalize, resolve (Java Paths.get(), JS path.resolve()). Error Handling: Wrap in try-catch (Java), .catch() (JS).

Lý thuyết: Relative paths context-dependent (current working dir), security (sandbox in browser). Binary I/O: For images/PDF, use base64 hoặc direct bytes.

Java: Console class cho interactive, Path API (NIO.2) cho symbolic links.

JS: readline module cho console input Node, FormData cho file upload browser.

**So sánh**: Java unified (streams cho all I/O), JS platform-split (fs Node, APIs browser). JS async I/O scale tốt cho servers, Java blocking simple cho beginners.

Ví dụ console input:
```java
//java

Scanner sc = new Scanner(System.in);
String input = sc.nextLine();
```

```javascript
//javascript

// Node
process.stdin.once('data', chunk => {
    let input = chunk.toString().trim();
});
```

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Java I/O/File Handling        | JS I/O/File Handling          |
|-----------------------|-------------------------------|-------------------------------|
| **Model**            | Streams, blocking/NIO non-block| Async callbacks/promises      |
| **API**              | java.io/NIO low-high level   | fs (Node), FileReader (browser)|
| **Error Handling**   | Checked exceptions           | Runtime errors, .catch()      |
| **Performance**      | Buffered efficient           | Non-blocking scalable         |
| **Platforms**        | Cross-platform desktop/server| Node server, browser limited  |
| **Trường hợp dùng**  | File processing batch         | Web uploads, real-time logs   |

Java robust cho files, JS seamless cho web.

## Kết luận: Kết nối code với thế giới thực

I/O và file handling làm code "sống" – thử đọc scores từ CSV (kết hợp collections bài 8), ghi log với try-catch (bài 7). Java dạy stream thinking, JS async flows. Áp dụng: Xây dựng simple logger app!

Bạn hay dùng I/O cho gì? Comment chia sẻ nhé. Bài sau: Networking và HTTP Requests trong Java vs JS. Tiếp tục series để code connected!

Happy I/O-ing! 📁🔄

<!--more-->