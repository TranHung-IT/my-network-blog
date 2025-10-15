+++
author = "Trần Việt Hưng"
title = "Networking và HTTP Requests trong Java vs JavaScript: Kết nối mạng cơ bản"
date = "2025-10-13"
description = "Bài 13 series Lập trình với Java vs JavaScript. Giới thiệu networking và HTTP – cách gửi/nhận dữ liệu qua mạng, từ API calls đến client-server communication!"
tags = [
    "java",
    "javascript",
    "networking",
    "http",
    "api",
    "beginner",
    "programming",
]
categories = [
    "java",
    "javascript",
    "beginner",
]
+++

Chào các bạn, mình là Trần Việt Hưng — rất vui được gặp lại trong series Lập trình với Java vs JavaScript. Sau khi làm quen với I/O và File Handling, nơi code biết “giao tiếp với ổ cứng”, thì hôm nay, bài 13: **Networking và HTTP Requests** sẽ giúp bạn mở rộng tầm nhìn ra mạng Internet – nơi mọi ứng dụng hiện đại đều kết nối.
Nếu bạn là sinh viên năm nhất hoặc mới tự học, đây chính là bước chuyển mình từ “code trong máy” sang “code nói chuyện với thế giới”: Java có thể gửi request tới server bằng HttpClient hay Socket, còn JavaScript dùng fetch() để lấy API về hiển thị ngay trên web.
Mình nhớ lần đầu thử gọi API thời tiết trong project JS cá nhân, chỉ vài dòng code mà trình duyệt hiển thị dữ liệu real-time — cảm giác lúc đó thật “kỳ diệu”, như code của mình có thể chạm vào thế giới thật. Hãy cùng mình tìm hiểu cách để những dòng lệnh của bạn “kết nối” và “lắng nghe” từ Internet nhé. 🌍

## Networking và HTTP Requests: Vai trò và nguyên tắc hoạt động cơ bản

### Kiến thức cốt lõi
Networking là trao đổi dữ liệu qua mạng (TCP/IP stack), HTTP là protocol application-layer cho web (request-response model). Vai trò chính: Client-server communication (browser request server data), API integration (RESTful endpoints), real-time (WebSockets nâng cao). Không networking, code isolated; có nó, apps connected như social media.

Nguyên tắc cốt lõi:
- **Request-Response Cycle**: Client gửi method (GET/POST), URL, headers/body; server respond status (200 OK, 404 Not Found), headers, body (JSON/HTML).
- **Methods và Status**: GET read, POST create, PUT update, DELETE remove. Headers: Content-Type, Authorization.
- **Protocols**: HTTP stateless (no session memory), HTTPS secure (TLS encryption).

Java: java.net.URL/HTTPURLConnection cho basic, Socket cho low-level TCP. Phù hợp server-side (Spring Boot REST), với async từ Java 11 HttpClient.

JavaScript: Fetch API (promises), XMLHttpRequest legacy. Lý tưởng client-side (browser/Node), với async/await cho readability.

**So sánh cốt lõi**: Java verbose nhưng robust (connection pooling), JS concise (built-in no libs). Cả hai handle JSON (Java Gson/Jackson, JS native), nhưng JS CORS restrict cross-origin.

Ví dụ GET request cơ bản:
```java
//java

// HttpURLConnection
URL url = new URL("https://api.example.com/data");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setRequestMethod("GET");
int responseCode = conn.getResponseCode();
```

```javascript
//javascript

// Fetch
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data));
```

### Góc nhìn cá nhân
Học về networking, mình thấy HTTPURLConnection của Java tuy hơi dài dòng nhưng lại rất rõ ràng khi cần xử lý status code hay headers – cực hữu ích cho đồ án backend. Còn bên JavaScript, fetch() thật sự “gọn nhẹ”, lý tưởng cho sinh viên mới bắt đầu làm web hoặc app nhỏ.
Nếu bạn mới, hãy thử gửi GET request đến API công khai như JSONPlaceholder hoặc OpenWeatherMap để hiểu vòng đời một request–response. Chỉ cần một lần gọi thành công, bạn sẽ thấy việc “nói chuyện với Internet” không còn trừu tượng nữa. 🌐✨

## Khai báo Networking và Operations: Clients, Headers và Body

### Kiến thức cốt lõi
Khai báo: Java HttpURLConnection conn = ..., JS fetch(url, options). Operations: Set headers (conn.setRequestProperty("Authorization", token)), send body (POST JSON).

Lý thuyết sâu: Connection lifecycle: Open, send, read response, close (Java try-with-resources, JS auto). Timeouts: Prevent hang (conn.setConnectTimeout(5000)). Parsing: Response body to object (JSON deserialization).

Java: POST với OutputStream, multi-part cho files (upload).

JS: Options object {method: 'POST', headers: {...}, body: JSON.stringify(data)}.

**So sánh**: Java manual stream handling (flexible), JS declarative (easy chaining). Practice: Luôn check response.status trước parse để handle errors.

Ví dụ POST request:
```java
//java 

conn.setRequestMethod("POST");
conn.setRequestProperty("Content-Type", "application/json");
OutputStream os = conn.getOutputStream();
os.write("{\"key\":\"value\"}".getBytes());
os.flush();
```

```javascript
//javascript

fetch('https://api.example.com/data', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({key: 'value'})
});
```

### Góc nhìn cá nhân 
Mình từng dùng OutputStream Java cho POST binary data trong đồ án – control tốt nhưng code dài. JS body JSON thì siêu dễ, dùng cho form submit ở web app cá nhân. Cá nhân mình thích Java cho custom headers phức tạp, JS cho quick prototypes. Bạn hay set header gì nhất?

## Các Hoạt động Phổ Biến: Async Handling, Error Response và Security

### Kiến thức cốt lõi
Async: Java CompletableFuture.supplyAsync() với HttpClient, JS async/await. Error: Handle 4xx/5xx (conn.getErrorStream()), security: HTTPS, auth (Basic/OAuth).

Lý thuyết: REST principles (stateless, uniform interface), WebSockets cho bidirectional (upgrade từ HTTP). Rate limiting: Avoid spam (throttle requests).

Java: Proxy support (conn.setProxy()), cookies via CookieHandler.

JS: AbortController cho cancel, Service Workers cho offline caching.

**So sánh**: Java enterprise features (load balancing), JS browser-centric (fetch polyfill Node). JS dễ cho SPAs, Java cho microservices.

Ví dụ async GET với error:
```java
// Java 11 HttpClient async

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
client.sendAsync(request, BodyHandlers.ofString()).thenApply(HttpResponse::body);
```

```javascript
//javascript

async function getData() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('HTTP error');
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}
```

### Góc nhìn cá nhân 
Async/await JS cứu mình khỏi .then() hell khi chain multiple APIs ở project nhóm – code đọc như sync! Java CompletableFuture thì mạnh cho backend parallel calls, nhưng học curve cao hơn. Mình khuyên: Bắt đầu với fetch async để quen error handling. Bạn gặp CORS error bao giờ chưa?

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Java Networking/HTTP         | JS Networking/HTTP            |
|-----------------------|------------------------------|-------------------------------|
| **API**              | HttpURLConnection/HttpClient | Fetch/XMLHttpRequest          |
| **Async**            | CompletableFuture, callbacks | Promises/async-await          |
| **Security**         | Built-in SSL, auth libs      | HTTPS, CORS handling          |
| **Error Handling**   | Exceptions, status codes     | .catch(), response.ok         |
| **Hiệu suất**        | Connection pooling           | Streaming, no block           |
| **Trường hợp dùng**  | Backend APIs, servers        | Frontend fetches, Node servers|

Java scalable cho backends, JS seamless cho clients.

### Tổng kết 
Qua ưu nhược điểm, thấy được Java HttpClient như "xe tải chở hàng nặng" cho server đồ án, JS fetch như "xe đạp nhanh" cho client-side. Java pooling cho perf cao, JS no-block cho UI mượt. Không cái nào vượt trội – mình dùng Java backend, JS frontend để full-stack!

## Kết luận: Kết nối code với internet

Networking mở ra thế giới API – thử GET random quote từ API public, parse JSON với collections (bài 8). Java dạy protocol depths, JS quick integrations. Áp dụng: Xây dựng weather app simple! Mình đã thử gọi OpenWeather API, và app "thông minh" hẳn lên.

Bạn đã gọi API nào thú vị? Bài sau: Testing và Unit Tests trong Java vs JS. Tiếp tục series để code testable. Happy networking! 🌐📡

<!--more-->