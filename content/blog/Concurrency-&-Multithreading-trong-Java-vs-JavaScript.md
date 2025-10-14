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

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Lập trình với Java vs JavaScript trên blog cá nhân. Sau bài về Lambda Expressions và Functional Programming – nơi bạn học cách viết code declarative ngắn gọn với streams và higher-order functions – hôm nay, bài 11: **Concurrency và Multithreading** – "siêu năng lực" giúp code xử lý nhiều việc cùng lúc, như tải dữ liệu web trong khi UI vẫn mượt, tránh "đơ máy" khi chờ I/O. Nếu bạn là sinh viên năm nhất hoặc mới tự học, concurrency là bước quan trọng: Java dùng threads thực thụ (multi-core), JS single-threaded nhưng async non-blocking (event loop) – lý tưởng cho web không block.

Concurrency như "nhiều đầu bếp cùng nấu một bếp", threads như "công nhân riêng", async như "đặt hàng rồi làm việc khác". Java ExecutorService cho thread pools, JS Promises/async-await cho tasks bất đồng bộ. Chúng khác ở model (Java preemptive, JS cooperative), synchronization (Java locks, JS no shared state), và pitfalls (Java race conditions, JS callback hell). Hãy cùng khám phá để bạn viết code responsive từ app đơn giản!

## Concurrency và Multithreading: Vai trò và nguyên tắc hoạt động cơ bản

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

## Khai báo Concurrency và Synchronization: Threads, Pools và Locks

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

## Các Hoạt động Phổ Biến: Parallelism, Deadlock và Error Handling

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

## Kết luận: Bắt đầu với Async đơn giản

Concurrency làm code "sống động" – thử run two threads in Java print alternating, hoặc async fetches in JS. Java dạy thread discipline, JS event-driven mindset. Kết hợp với lambdas từ bài 10 cho modern concurrency!

Bạn sợ concurrency pitfall nào nhất? Comment nhé. Bài sau: I/O và File Handling trong Java vs JS. Tiếp tục series để code full-stack ready!

Happy threading! 🧵⚡

<!--more-->