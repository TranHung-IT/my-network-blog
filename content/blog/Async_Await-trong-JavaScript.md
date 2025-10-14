+++
author = "Trần Việt Hưng"
title = "Async/Await trong JavaScript: Thay thế hoàn hảo cho Promises – Dễ hiểu, dễ dùng hơn bao giờ hết"
date = "2025-10-01"
description = "Tiếp nối series ES6, bài viết này khám phá Async/Await – cách viết code bất đồng bộ (async) đơn giản như code đồng bộ, giúp tránh 'callback hell' và dễ debug hơn."
tags = [
    "javascript",
    "async-await",
    "promises",
    "es8",
]
categories = [
    "javascript",
    "programming",
]
+++

Chào các bạn! Mình là Trần Việt Hưng đây, tiếp tục series chia sẻ về JavaScript hiện đại. Nếu bạn đã đọc bài trước về Arrow Functions và Destructuring, chắc hẳn bạn đang háo hức với những tính năng làm code "sạch" hơn. Hôm nay, mình sẽ đi sâu vào **Async/Await** – một "siêu anh hùng" từ ES8 (ECMAScript 2018), giúp xử lý bất đồng bộ (như API calls, file I/O) mà không rơi vào "callback hell" hay chuỗi Promises dài ngoằng. 

So với Promises (ES6), Async/Await viết code gần như đồng bộ, dễ đọc và debug hơn nhiều. Nếu bạn đang làm full-stack với Java backend (dùng CompletableFuture tương tự), bạn sẽ thấy sự tương đồng thú vị. Cùng mình khám phá cách nó hoạt động và áp dụng nhé!

## Promises: Nền tảng, nhưng hơi "lủng lẳng"

Promises là một object đại diện cho kết quả cuối cùng của một hoạt động bất đồng bộ, được giới thiệu trong ES6 để giải quyết vấn đề callback lồng ghép sâu, dẫn đến code khó đọc và maintain. Một Promise có ba trạng thái: Pending (chưa hoàn thành), Fulfilled (thành công với value), và Rejected (thất bại với reason).

Cú pháp cơ bản là:
```javascript
const promise = new Promise((resolve, reject) => {
  // Async work
  if (success) resolve(value);
  else reject(error);
});

promise.then(result => console.log(result))
       .catch(error => console.error(error));
```

Tuy nhiên, khi chain nhiều Promises, code dễ trở thành "tháp" khó theo dõi:
```javascript
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => display(comments))
  .catch(err => handleError(err));
```

Vấn đề là error propagation chỉ local (.catch() bắt lỗi chain trước), và parallel execution khó (phải dùng Promise.all()). Dù non-blocking nhờ event loop, syntax imperative làm code procedural, khó scale cho complex flow.

## Async/Await: Viết async như sync

Async/Await là syntactic sugar trên Promises, biến async code thành dạng sync-like bằng cách dùng async function (trả Promise) và await (pause đến resolve/reject). Await chỉ dùng trong async, throw error nếu rejected, dễ bubble up qua try-catch.

Cú pháp cơ bản:
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/users');
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Fetch failed: ' + error.message);
  }
}

fetchData().then(data => console.log(data)).catch(err => console.error(err));
```

Dựa trên generator và microtask queue, await pause execution mà không block main thread, tạo stack trace tuyến tính dễ debug. So với Promises, code đọc như sync, giảm cognitive load.

### Chain async operations
Giả sử fetch user rồi posts – await serialize, Promise.all parallel:
```javascript
// Serial (await từng cái)
async function getUserPostsSerial(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(user.id);
  return { user, posts };
}

// Parallel (Promise.all)
async function getUserPostsParallel(userId) {
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId) // Assume fetchPosts can use userId directly
  ]);
  return { user, posts };
}
```

Serial an toàn nếu phụ thuộc, parallel tối ưu time (O(1) vs O(n)), nhưng error nếu one fail thì all fail (dùng allSettled() cho partial).

Kết hợp Arrow + Destructuring:
```javascript
const getUserPosts = async (userId) => {
  try {
    const { user } = await fetchUser(userId);
    const { posts } = await fetchPosts(user.id);
    return { ...user, posts };
  } catch (error) {
    throw new Error(`Không lấy được data: ${error.message}`);
  }
};
```

## Xử lý lỗi và edge cases

Try-catch catch tất cả lỗi từ await, uniform với sync. Parallel error: Promise.all reject nếu any reject, Promise.allSettled() cho partial success.

Ví dụ timeout với AbortController:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

try {
  const response = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request timed out');
  }
}
```

AbortController dùng ReadableStream, integrate với fetch, hỗ trợ cancel chain await, tránh memory leak.

## So sánh với Java CompletableFuture

CompletableFuture (Java 8) tương đương Promise: supplyAsync() cho async, thenApply() như .then(), exceptionally() như .catch(). Async/Await simpler syntax, CompletableFuture functional (compose, join, allOf).

Ví dụ tương đương:
```java
CompletableFuture<User> userFuture = CompletableFuture.supplyAsync(() -> fetchUser(userId));
CompletableFuture<Posts> postsFuture = userFuture.thenApply(user -> fetchPosts(user.id));
postsFuture.thenAccept(result -> display(result))
           .exceptionally(ex -> { handleError(ex); return null; });
```

Cả hai dựa trên monad pattern (flatMap/thenCompose), nhưng Async/Await readable hơn cho JS dev, CompletableFuture powerful cho Java parallel streams.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Async/Await (ES8)             | Promises (ES6)                |
|-------------------|-------------------------------|------------------------------|
| **Readability**  | Cao (sync-like)              | Thấp (chain dài)             |
| **Error Handling** | Try-catch uniform            | .catch() local               |
| **Parallel**     | Promise.all + await          | Native Promise.all           |
| **Debugging**    | Stack trace tuyến tính       | Chain trace khó theo dõi     |
| **Performance**  | Tương đương (sugar)          | Tương đương                  |
| **Learning Curve** | Dễ (nếu biết Promises)       | Cơ bản async                 |

Async/Await là evolution của Promises, khuyến khích clean code.

## Kết luận: Tại sao Async/Await "thần thánh"?

Async/Await biến async thành sync mental model, giảm cognitive load. Trong full-stack, kết hợp với Java CompletableFuture cho hybrid apps. Hãy thử refactor Promise chain thành await – code sẽ "sạch" gấp bội!

Bạn gặp khó khăn gì với async code? Comment bên dưới nhé. Bài sau: So sánh Java Streams vs. JS Array methods. Đừng quên subscribe để cập nhật!

Happy coding, các coder! 💻✨

<!--more-->