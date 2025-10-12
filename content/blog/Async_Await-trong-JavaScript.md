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

So với Promises (ES6), Async/Await viết code gần như đồng bộ, dễ đọc và debug hơn nhiều. Nếu bạn đang làm full-stack với Java backend (dùng CompletableFuture tương tự), bạn sẽ thấy sự tương đồng thú vị. Cùng mình code thử nhé!

## Promises: Nền tảng, nhưng hơi "lủng lẳng"

Trước khi vào Async/Await, ôn nhanh Promises: Chúng giải quyết vấn đề callback bằng cách trả về object với `.then()` (thành công) và `.catch()` (lỗi). Ví dụ fetch data từ API:

{{< highlight javascript >}}
// Promises cơ bản
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Lỗi:', error));

// Chain nhiều Promises (dễ rối nếu dài)
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => displayPosts(posts))
  .catch(err => handleError(err));
{{< /highlight >}}

Hay đấy, nhưng nếu chain 5-6 bước, code sẽ như "tháp spaghetti" – khó theo dõi và debug.

## Async/Await: Viết async như sync!

Async/Await là "sugar syntax" trên Promises, dùng từ khóa `async` cho function và `await` để chờ kết quả. Nó làm code tuyến tính, dễ đọc như sách giáo khoa.

### Cú pháp cơ bản
Bắt đầu với function async:

{{< highlight javascript >}}
// Function async đơn giản
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/users');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

fetchData(); // Gọi như function thường
{{< /highlight >}}

Lưu ý: `await` chỉ dùng trong `async` function. Try-catch tự động xử lý lỗi từ Promises!

### Ví dụ thực tế: Chain async operations
Giả sử bạn cần fetch user rồi fetch posts của họ:

{{< highlight javascript >}}
async function getUserPosts(userId) {
  try {
    // Await từng bước, code rõ ràng
    const userResponse = await fetch(`https://api.example.com/users/${userId}`);
    const user = await userResponse.json();
    
    const postsResponse = await fetch(`https://api.example.com/posts?userId=${userId}`);
    const posts = await postsResponse.json();
    
    return { user, posts }; // Trả về object
  } catch (error) {
    console.error('Lỗi fetch:', error);
    return null;
  }
}

// Sử dụng
getUserPosts(1).then(result => {
  if (result) {
    console.log('User:', result.user.name);
    console.log('Posts:', result.posts.length);
  }
});
{{< /highlight >}}

So với Promises, code này ngắn hơn và dễ theo dõi flow!

### Kết hợp với Arrow Functions (từ bài trước)
Dùng Arrow + Destructuring để "pro" hơn:

{{< highlight javascript >}}
const getUserPosts = async (userId) => {
  try {
    const { user } = await getUser(userId);  // Giả sử có function getUser
    const { posts } = await getPosts(user.id);
    return { ...user, posts };  // Spread operator để merge
  } catch (error) {
    throw new Error(`Không lấy được data: ${error.message}`);
  }
};

// Gọi với destructuring
const { user: { name }, posts } = await getUserPosts(1);
console.log(`${name} có ${posts.length} bài viết`);
{{< /highlight >}}

## Xử lý lỗi và edge cases

- **Error handling**: Try-catch "bắt" hết lỗi từ await.
- **Parallel awaits**: Dùng `Promise.all()` để chạy song song:

{{< highlight javascript >}}
async function fetchMultiple() {
  try {
    const [users, posts] = await Promise.all([
      fetch('https://api.example.com/users').then(res => res.json()),
      fetch('https://api.example.com/posts').then(res => res.json())
    ]);
    console.log(users, posts);
  } catch (error) {
    console.error('Một trong các request lỗi:', error);
  }
}
{{< /highlight >}}

- **Timeout**: Kết hợp với AbortController để tránh request "treo".

## Kết luận: Async/Await – Bước tiến lớn cho JS dev

Với Async/Await, bạn viết code bất đồng bộ như đang viết đồng bộ, giảm 50% thời gian debug so với Promises thuần. Nếu bạn dùng Java, hãy so sánh với `CompletableFuture.supplyAsync()` – ý tưởng tương tự! Hãy thử implement một API call nhỏ trong project của bạn ngay hôm nay.

Bạn gặp khó khăn gì với async code? Comment bên dưới nhé. Bài sau: So sánh Java Streams vs. JS Array methods. Đừng quên subscribe để cập nhật!

Happy coding, các coder! 💻✨

<!--more-->