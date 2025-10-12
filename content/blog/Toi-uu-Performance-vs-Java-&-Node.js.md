+++
author = "Trần Việt Hưng"
title = "Tối ưu Performance với Java và Node.js: Bí kíp cho Full-Stack Dev"
date = "2025-10-09"
description = "Tiếp nối series Java & JavaScript, bài viết khám phá cách tối ưu performance cho ứng dụng Java (Spring Boot) và Node.js (Express). Hướng dẫn thực tế với profiling, caching và async!"
tags = [
    "java",
    "nodejs",
    "performance",
    "optimization",
    "spring-boot",
    "express",
    "profiling",
    "caching",
    "async",
]
categories = [
    "java",
    "javascript",
    "performance",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Sau bài về CI/CD với Jenkins vs GitHub Actions, hôm nay mình sẽ khám phá cách **tối ưu performance** cho ứng dụng **Spring Boot** (Java) và **Express.js** (Node.js). Tối ưu performance là yếu tố sống còn để ứng dụng chạy nhanh, tiết kiệm tài nguyên, và mang lại trải nghiệm mượt mà cho user.

Nếu bạn là full-stack dev (Java backend + JS frontend), bài này sẽ giúp bạn nắm các kỹ thuật như **profiling**, **caching**, và **async processing** để tăng tốc ứng dụng. Chúng ta sẽ build một REST API đơn giản, đo performance, và áp dụng cải tiến – code dễ copy-paste!

## Giới thiệu ngắn gọn: Performance Optimization Java vs Node.js

- **Java (Spring Boot)**: Mạnh về multithreading, type-safety, và JVM optimization (JIT, GC). Tuy nhiên, có thể chậm khởi động và nặng tài nguyên nếu không tối ưu.
- **Node.js (Express)**: Nhẹ, nhanh prototype, single-threaded nhưng mạnh về I/O-bound tasks nhờ event loop. Cần cẩn thận với CPU-bound tasks.

Cả hai đều có thể đạt performance cao với kỹ thuật đúng, nhưng Java tốt cho CPU-heavy, Node.js cho I/O-heavy. Mục tiêu: Giảm latency, tối ưu CPU/memory, và scale ứng dụng.

## Ví dụ cơ bản: REST API với performance issues

Giả sử bạn có API trả về danh sách users (giả lập 10,000 users), muốn lọc users có ID chẵn. API ban đầu chậm vì loop thủ công.

### Spring Boot: API ban đầu (chậm)

#### pom.xml
{{< highlight xml >}}
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
{{< /highlight >}}

#### User.java
{{< highlight java >}}
public class User {
    private Long id;
    private String name;
    private String email;

    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}
{{< /highlight >}}

#### UserController.java (chưa tối ưu)
{{< highlight java >}}
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final List<User> users = new ArrayList<>();

    public UserController() {
        // Giả lập 10,000 users
        for (long i = 1; i <= 10000; i++) {
            users.add(new User(i, "User" + i, "user" + i + "@email.com"));
        }
    }

    @GetMapping
    public List<User> getUsers() {
        // Xử lý chậm: loop và copy không cần thiết
        List<User> result = new ArrayList<>();
        for (User user : users) {
            if (user.getId() % 2 == 0) { // Lọc users có ID chẵn
                result.add(user);
            }
        }
        return result;
    }
}
{{< /highlight >}}

Chạy: `mvn spring-boot:run`. Test: `curl http://localhost:8080/api/users`. API chậm vì loop thủ công và copy list.

### Express.js: API ban đầu (chậm)

#### package.json
{{< highlight json >}}
{
  "dependencies": {
    "express": "^4.18.2"
  },
  "scripts": {
    "start": "node server.js"
  }
}
{{< /highlight >}}

#### server.js (chưa tối ưu)
{{< highlight javascript >}}
const express = require('express');
const app = express();
const PORT = 3000;

const users = [];
// Giả lập 10,000 users
for (let i = 1; i <= 10000; i++) {
    users.push({ id: i, name: `User${i}`, email: `user${i}@email.com` });
}

app.get('/api/users', (req, res) => {
    // Xử lý chậm: filter lặp không tối ưu
    const result = users.filter(user => user.id % 2 === 0);
    res.json(result);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
{{< /highlight >}}

Chạy: `npm install express && node server.js`. Test: `curl http://localhost:3000/api/users`. API chậm với data lớn.

**So sánh**: Java verbose hơn, Node.js ngắn gọn nhưng cả hai đều chậm với data lớn do loop/filter cơ bản.

## Tối ưu 1: Profiling để tìm bottleneck

Profiling giúp đo CPU/memory để xác định vấn đề.

- **Java**: Dùng VisualVM hoặc IntelliJ Profiler. Kết quả: loop trong `getUsers` tốn CPU, copy list tốn memory.
- **Node.js**: Dùng `console.time` hoặc Chrome DevTools (`node --inspect server.js`). Kết quả: `filter` lặp tuần tự chậm.

### Fix Java: Dùng Stream
{{< highlight java >}}
@GetMapping
public List<User> getUsers() {
    return users.stream()
            .filter(user -> user.getId() % 2 == 0)
            .collect(Collectors.toList());
}
{{< /highlight >}}

### Fix Node.js: Dùng filter hiệu quả
{{< highlight javascript >}}
app.get('/api/users', (req, res) => {
    console.time('filter');
    const result = users.filter(user => user.id % 2 === 0);
    console.timeEnd('filter');
    res.json(result);
});
{{< /highlight >}}

**Cải thiện**: Stream ở Java lazy, giảm overhead; Node.js vẫn eager nhưng filter tối ưu hơn loop thủ công.

## Tối ưu 2: Caching với Redis

Dùng Redis để cache kết quả API, giảm tính toán lặp lại.

### Java: Spring Boot + Redis
Thêm dependency:
{{< highlight xml >}}
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
{{< /highlight >}}

Cấu hình Redis (application.properties):
```properties
spring.redis.host=localhost
spring.redis.port=6379
```

Cập nhật UserController.java:
{{< highlight java >}}
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final List<User> users = new ArrayList<>();
    @Autowired
    private RedisTemplate<String, List<User>> redisTemplate;

    public UserController() {
        for (long i = 1; i <= 10000; i++) {
            users.add(new User(i, "User" + i, "user" + i + "@email.com"));
        }
    }

    @GetMapping
    public List<User> getUsers() {
        String cacheKey = "users:even";
        List<User> cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }
        List<User> result = users.stream()
                .filter(user -> user.getId() % 2 == 0)
                .collect(Collectors.toList());
        redisTemplate.opsForValue().set(cacheKey, result, 10, TimeUnit.MINUTES);
        return result;
    }
}
{{< /highlight >}}

Chạy Redis: `docker run -d -p 6379:6379 redis`. Test lại: latency giảm đáng kể.

### Node.js: Express + Redis
Cài `npm i redis`.

Cập nhật server.js:
{{< highlight javascript >}}
const express = require('express');
const redis = require('redis');
const app = express();
const PORT = 3000;

const client = redis.createClient({ url: 'redis://localhost:6379' });
client.connect();

const users = [];
for (let i = 1; i <= 10000; i++) {
    users.push({ id: i, name: `User${i}`, email: `user${i}@email.com` });
}

app.get('/api/users', async (req, res) => {
    const cacheKey = 'users:even';
    const cached = await client.get(cacheKey);
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    const result = users.filter(user => user.id % 2 === 0);
    await client.setEx(cacheKey, 600, JSON.stringify(result));
    res.json(result);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
{{< /highlight >}}

Chạy Redis và test: latency giảm, CPU usage thấp.

**So sánh**: Spring Cache ở Java declarative (annotation), Redis npm ở Node.js manual nhưng linh hoạt.

## Tối ưu 3: Async Processing

- **Java**: Dùng `@Async` cho background tasks.
  Cập nhật UserController.java:
{{< highlight java >}}
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import java.util.concurrent.CompletableFuture;

@EnableAsync
@RestController
@RequestMapping("/api/users")
public class UserController {
    // ... (khởi tạo users và redisTemplate như trên)

    @GetMapping
    @Async
    public CompletableFuture<List<User>> getUsers() {
        String cacheKey = "users:even";
        List<User> cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return CompletableFuture.completedFuture(cached);
        }
        List<User> result = users.stream()
                .filter(user -> user.getId() % 2 == 0)
                .collect(Collectors.toList());
        redisTemplate.opsForValue().set(cacheKey, result, 10, TimeUnit.MINUTES);
        return CompletableFuture.completedFuture(result);
    }
}
{{< /highlight >}}

Cần `@EnableAsync` trong config class. API trả kết quả ngay, xử lý nặng chạy nền.

- **Node.js**: Dùng async/await.
  Cập nhật server.js:
{{< highlight javascript >}}
app.get('/api/users', async (req, res) => {
    const cacheKey = 'users:even';
    const cached = await client.get(cacheKey);
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    // Giả lập async task
    const result = await new Promise(resolve => {
        setImmediate(() => resolve(users.filter(user => user.id % 2 === 0)));
    });
    await client.setEx(cacheKey, 600, JSON.stringify(result));
    res.json(result);
});
{{< /highlight >}}

**So sánh**: @Async ở Java dễ, CompletableFuture mạnh cho parallel; async/await ở Node.js đơn giản cho I/O.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java (Spring Boot)            | Node.js (Express)            |
|-------------------|-------------------------------|------------------------------|
| **Profiling**    | VisualVM, IntelliJ Profiler  | Chrome DevTools, console.time |
| **Caching**      | Spring Cache, Redis          | redis npm, manual caching   |
| **Async**        | @Async, CompletableFuture    | Async/await, Promise        |
| **Performance**  | Tốt cho CPU-bound, multithread | Tốt cho I/O-bound, event loop |
| **Use Case**     | Enterprise, heavy data       | Web apps, quick prototype   |

Java mạnh về CPU-bound tasks, Node.js vượt trội cho I/O-bound.

## Kết luận: Chọn cái nào cho full-stack?

Dùng Java cho backend xử lý data lớn, Node.js cho API nhẹ, real-time. Kết hợp profiling, caching (Redis), và async để tối ưu. Thử áp dụng Redis cache vào project của bạn – bạn sẽ thấy tốc độ tăng rõ rệt!

Bạn đã tối ưu app chưa? Comment chia sẻ nhé. Bài sau: Docker vs Kubernetes cho full-stack. Theo dõi để pro hơn!

Happy optimizing! 🚀⚡

<!--more-->