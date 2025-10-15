+++
author = "Trần Việt Hưng"
title = "Concurrency và Multithreading trong Java vs JavaScript: Xử lý song song"
date = "2025-10-11"
description = "Bài 11 trong series Lập trình với Java vs JavaScript. So sánh concurrency (Java threads) và async (JS event loop) – cách làm code chạy 'đa nhiệm' mà không block!"
tags = [
    "java",
    "javascript",
    "concurrency",
    "multithreading",
    "async",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn, mình là Trần Việt Hưng, tiếp tục hành trình cùng series Java vs JavaScript! Sau khi làm quen với Lambda Expressions và Functional Programming, chúng ta bước sang một chủ đề “nặng đô” hơn nhưng cực kỳ thú vị – **Concurrency & Multithreading**.
Đây chính là “sức mạnh song song” giúp chương trình không đứng yên khi xử lý nhiều tác vụ: tải dữ liệu, cập nhật giao diện, hoặc phản hồi người dùng cùng lúc. Trong khi Java có hệ thống threads thực thụ tận dụng đa lõi CPU, thì JavaScript lại chọn hướng asynchronous non-blocking – nhẹ mà vẫn hiệu quả cho môi trường web.
Lần đầu mình thử viết server đa luồng bằng Java, mọi thứ trông “ngầu” lắm… cho đến khi dữ liệu biến mất vì race condition! 😅 Một cú vấp đáng nhớ nhưng cũng là cách hiểu sâu nhất về lập trình song song.
Cùng khám phá xem làm sao để code của bạn vừa chạy nhanh, vừa không “vỡ trận” nhé. ⚙️

## Concurrency và Multithreading: Vai trò và nguyên tắc hoạt động cơ bản

### Kiến thức cốt lõi
Concurrency là khả năng xử lý nhiều tasks "cùng lúc" (không nhất thiết parallel), cải thiện responsiveness và throughput. Multithreading: Chạy nhiều threads (lightweight processes) trong một process. Vai trò chính: Tận dụng multi-core CPU, handle I/O waits (network/file), scale apps lớn.

Nguyên tắc cốt lõi:
- **Thread vs Process**: Thread chia sẻ memory (nhanh nhưng rủi ro shared state), process isolated (an toàn nhưng overhead cao).
- **Synchronization**: Tránh race conditions (nhiều threads sửa shared data cùng lúc), dùng locks/mutex.
- **Deadlock/Livelock**: Pitfalls khi threads chờ nhau vô tận – avoid bằng ordering locks.

Java: True multithreading (extends Thread hoặc Runnable), JVM scheduler preemptive (OS switch threads). Phù hợp server-side, với volatile/Atomic cho thread-safety.

JavaScript: Single-threaded event loop (cooperative), concurrency qua async (non-blocking I/O với libuv Node.js). Lý tưởng browser/serverless, no shared memory issues.

**So sánh cốt lõi**: Java parallel thực (CPU-bound), JS concurrent ảo (I/O-bound). Cả hai dùng callbacks/lambdas cho tasks, nhưng Java synchronized blocks, JS no locks needed.

Ví dụ thread cơ bản (print countdown):
```java
//java

// Runnable lambda
new Thread(() -> {
    for (int i = 3; i > 0; i--) System.out.println(i);
}).start();
```

```javascript
//javascript

// setTimeout async
setTimeout(() => {
    for (let i = 3; i > 0; i--) console.log(i);
}, 0);
```

### Góc nhìn cá nhân
Multithreading trong Java khiến mình hiểu rõ hơn về cách hệ điều hành quản lý tài nguyên – mỗi thread như một “người công nhân” riêng biệt, cần phối hợp nhịp nhàng để không dẫm chân nhau. Còn ở JavaScript, event loop là cách khéo léo để giả lập “đa nhiệm” mà không phải thật sự đa luồng – cực kỳ phù hợp cho web app.
Nếu bạn mới bắt đầu, mình khuyên nên làm quen với JS async/await trước – dễ thử, dễ thấy kết quả, rồi mới tìm hiểu sâu về thread synchronization trong Java. Tin mình đi, hiểu được “race condition” một lần là nhớ mãi! 🧵

## Khai báo Concurrency và Synchronization: Threads, Pools và Locks

### Kiến thức cốt lõi
Khai báo: Java Thread t = new Thread(runnable); t.start(), JS Promise.resolve().then(callback). Synchronization: Java synchronized(method) hoặc ReentrantLock, JS async/await sequential.

Lý thuyết sâu: Thread pools: Reuse threads (ExecutorService.newFixedThreadPool(n)), tránh create/destroy overhead. Context switching: OS cost cho Java, JS microtasks/macrotasks queue.

Java: Wait/notify cho producer-consumer, CompletableFuture cho async chaining (Java 8+).

JS: Event loop phases (timers, I/O, idle), Promise.all() parallel async, no true parallelism (Web Workers cho isolate).

**So sánh**: Java explicit joins (t.join() chờ), JS await sequential, Promise.race() first-done. Practice: Dùng pools cho many tasks, avoid long blocks.

Ví dụ async wait:
```java
//java

// CompletableFuture
CompletableFuture.runAsync(() -> System.out.println("Async task"));
```

```javascript
//javascript

async function asyncTask() {
    console.log("Async task");
}
asyncTask();
```

### Góc nhìn cá nhân
Mình từng dùng ExecutorService Java cho pool threads trong lab – tiết kiệm hơn create new mỗi lần! JS Promise.all thì như "đội nhóm" cho multiple fetches, hoàn thành dự án web nhanh. Cá nhân mình thích JS cho I/O, Java cho CPU tasks. Bạn hay dùng await hay .then?

## Các Hoạt động Phổ Biến: Parallelism, Deadlock và Error Handling

### Kiến thức cốt lõi
Parallelism: Java parallel streams (ForkJoinPool), JS Web Workers (separate threads). Deadlock: Detect bằng tools (jstack), prevent bằng lock ordering. Error Handling: Java try-catch trong run(), JS .catch() chaining.

Lý thuyết: Amdahl's Law: Speedup giới hạn bởi phần serial. JS no race conditions (immutable events), nhưng inversion of control (callback order).

Java: Volatile vars visible across threads, ThreadLocal per-thread storage.

JS: Generators/yield cho cooperative multitasking, async iterators.

**So sánh**: Java rich (semaphores, barriers), JS simple (no sync primitives). JS dễ cho I/O heavy, Java cho CPU heavy.

Ví dụ parallel sum (giả lập):
```java
//java

// Parallel stream
long sum = nums.parallelStream().mapToLong(x -> x).sum();
```

```javascript
//javascript

// Promise.all
Promise.all(nums.map(x => Promise.resolve(x * 2))).then(results => console.log(results.reduce((a,b)=>a+b)));
```

### Góc nhìn cá nhân
Parallel streams Java từng làm sum array nhanh gấp đôi ở bài tập multi-core – thú vị! JS Web Workers thì dùng cho heavy calc ở browser mà không freeze UI. Mình khuyên: Học deadlock qua ví dụ đơn giản trước khi code real. Bạn sợ pitfall nào nhất ở concurrency?

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Java Concurrency/Multithreading | JS Concurrency/Async          |
|-----------------------|---------------------------------|-------------------------------|
| **Model**            | Multi-threaded, preemptive     | Single-thread event loop      |
| **Synchronization**  | Locks, synchronized            | No shared state, promises     |
| **Parallelism**      | True (multi-core)              | Pseudo (workers)              |
| **Pitfalls**         | Race conditions, deadlock      | Callback hell, starvation     |
| **Hiệu suất**        | High CPU tasks                 | Excellent I/O tasks           |
| **Trường hợp dùng**  | Server parallel processing     | Web non-blocking UI           |

Java powerful but complex, JS simple but limited.

### Tổng kết
Java threads như "máy móc công nghiệp" cho đồ án server, JS async như "dàn nhạc nhẹ nhàng" cho web. Java sync primitives mạnh nhưng dễ lỗi, JS no shared state cứu khỏi race. Mình dùng Java cho backend heavy, JS cho frontend responsive!

## Kết luận: Bắt đầu với Async đơn giản

Concurrency làm code "sống động" – thử run two threads in Java print alternating, hoặc async fetches in JS. Java dạy thread discipline, JS event-driven mindset. Kết hợp với lambdas từ bài 10 cho modern concurrency! Mình đã áp dụng async JS trong project nhóm, và app mượt hơn hẳn.

Bạn sợ concurrency pitfall nào nhất? Bài sau: I/O và File Handling trong Java vs JS. Tiếp tục series để code full-stack ready. Happy threading! 🧵⚡

<!--more-->