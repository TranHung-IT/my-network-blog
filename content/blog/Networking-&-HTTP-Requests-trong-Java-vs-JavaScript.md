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

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Lập trình với Java vs JavaScript trên blog cá nhân. Sau bài về I/O và File Handling – nơi bạn học cách đọc/ghi dữ liệu local để persist – hôm nay, bài 13: **Networking và HTTP Requests** – "cánh cửa" mở code ra thế giới rộng lớn, giúp giao tiếp với server, gọi API như lấy thời tiết hoặc post dữ liệu user. Nếu bạn là sinh viên năm nhất hoặc mới tự học, networking là bước full-stack: Java backend với sockets/HTTP clients, JS frontend với fetch/XMLHttpRequest – xây dựng web apps thực tế mà không chỉ console log.

HTTP có thể tạm hiểu như "thư từ qua bưu điện" – request gửi, response nhận, headers như địa chỉ. Java dùng java.net (HttpURLConnection) hoặc Apache HttpClient, JS native fetch (ES6+) hoặc axios. Chúng khác ở model (Java sync/async, JS promise-based), security (Java SSL, JS CORS), và protocols (HTTP/1.1 vs 2/3). Hãy cùng khám phá để bạn gọi API đầu tiên, như GET JSON từ public endpoint!

## Networking và HTTP Requests: Vai trò và nguyên tắc hoạt động cơ bản

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

## Khai báo Networking và Operations: Clients, Headers và Body

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

## Các Hoạt động Phổ Biến: Async Handling, Error Response và Security

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

## Kết luận: Kết nối code với internet

Networking mở ra thế giới API – thử GET random quote từ API public, parse JSON với collections (bài 8). Java dạy protocol depths, JS quick integrations. Áp dụng: Xây dựng weather app simple!

Bạn đã gọi API nào thú vị? Comment nhé. Bài sau: Testing và Unit Tests trong Java vs JS. Tiếp tục series để code testable!

Happy networking! 🌐📡

<!--more-->