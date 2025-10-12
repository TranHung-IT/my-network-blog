+++
author = "Trần Việt Hưng"
title = "Microservices với Spring Boot vs. Express.js: Xây dựng hệ thống phân tán cho full-stack dev"
date = "2025-09-16"
description = "Bài viết so sánh Microservices architecture dùng Spring Boot (Java) và Express.js (Node.js) – từ setup service đến communication. Hướng dẫn build một user service đơn giản!"
tags = [
    "java",
    "nodejs",
    "microservices",
    "spring-boot",
    "express",
    "architecture",
]
categories = [
    "java",
    "javascript",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Java & JavaScript. Sau Socket Programming, hôm nay chúng ta khám phá **Microservices** – kiến trúc phân tán nơi app được chia thành các service độc lập (user service, order service), dễ scale và maintain. Mình sẽ so sánh **Spring Boot** (Java, enterprise-ready) và **Express.js** (Node.js, lightweight).

Nếu bạn full-stack, Microservices giúp backend linh hoạt: Spring Boot cho robust services, Express cho fast API. Chúng ta sẽ build một "User Service" đơn giản (GET/POST users) với REST API. Code dễ chạy – hãy cùng code nhé!

## Microservices là gì? Ôn nhanh

Microservices: App = nhiều service nhỏ, mỗi cái focus một domain (e.g., users, payments), giao tiếp qua HTTP/REST hoặc message queue (RabbitMQ). Ưu: Scale riêng lẻ, tech polyglot; Nhược: Complexity (service discovery, circuit breaker).

Spring Boot: Annotation-driven, auto-config (embedded Tomcat), tích hợp Eureka/Feign cho discovery/communication.
Express.js: Minimalist framework, middleware-based, dùng Nodemon cho dev, PM2 cho production.

## Ví dụ cơ bản: User Service (REST API)

Giả sử service quản lý users: GET all, POST new.

### Spring Boot (Java): @RestController + Spring Data JPA
Spring Boot dùng Maven/Gradle, JPA cho DB (H2 in-memory).

#### pom.xml (dependencies cơ bản)
{{< highlight xml >}}
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
{{< /highlight >}}

#### User.java (Entity)
{{< highlight java >}}
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User {
    @Id
    private Long id;
    private String name;
    private String email;

    // Constructors, getters, setters...
    public User() {}
    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    // Getters/setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
{{< /highlight >}}

#### UserController.java
{{< highlight java >}}
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
{{< /highlight >}}

#### UserRepository.java
{{< highlight java >}}
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
{{< /highlight >}}

Chạy: `mvn spring-boot:run`, test với Postman: GET /users, POST /users {id:1, name:"Alice", email:"alice@email.com"}.

### Express.js (Node.js): Routes + Middleware
Express dùng npm, Mongoose cho MongoDB (hoặc in-memory array cho đơn giản).

#### package.json (dependencies)
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

#### server.js
{{< highlight javascript >}}
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());  // Middleware parse JSON

let users = [];  // In-memory "DB"

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
{{< /highlight >}}

Chạy: `npm install && npm start`, test với curl: `curl http://localhost:3000/users`, `curl -X POST -H "Content-Type: application/json" -d '{"id":1,"name":"Alice","email":"alice@email.com"}' http://localhost:3000/users`.

**So sánh**: Spring Boot "zero-config" với JPA (auto DB schema), Express linh hoạt nhưng manual (thêm DB middleware như Mongoose). Spring tốt cho complex queries, Express nhanh prototype.

## Communication giữa Services: Feign vs. Axios

Giả sử User Service call Order Service.

### Spring Boot: Feign Client
Thêm dependency `spring-cloud-starter-openfeign`, annotate `@FeignClient`.

{{< highlight java >}}
@FeignClient(name = "order-service", url = "http://localhost:3001")
public interface OrderClient {
    @GetMapping("/orders/{userId}")
    List<Order> getOrders(@PathVariable Long userId);
}
{{< /highlight >}}

Inject `@Autowired OrderClient` vào controller.

### Express.js: Axios
Cài `npm i axios`, dùng trong route.

{{< highlight javascript >}}
const axios = require('axios');

app.get('/users/:id/orders', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3001/orders/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Service unavailable' });
  }
});
{{< /highlight >}}

**So sánh**: Feign declarative (annotation), auto retry/circuit breaker với Resilience4j; Axios imperative (async/await), dễ integrate Promise.

## Ưu nhược điểm tổng hợp

| Tiêu chí              | Spring Boot Microservices     | Express.js Microservices      |
|-----------------------|-------------------------------|-------------------------------|
| **Setup Speed**      | Chậm (Maven, annotations)    | Nhanh (npm, minimal code)    |
| **Scalability**      | Cao (Spring Cloud: Eureka, Gateway) | Cao (PM2, Docker, Kubernetes)|
| **DB Integration**   | Xuất sắc (JPA, Hibernate)    | Tốt (Mongoose, Sequelize)    |
| **Error Handling**   | Built-in (@ExceptionHandler) | Manual (try-catch middleware)|
| **Use Case**         | Enterprise, complex logic    | Startups, API-first          |

Cả hai hỗ trợ Docker/K8s cho deploy; Spring mạnh monitoring (Micrometer), Express nhẹ với Winston logging.

## Kết luận: Chọn cái nào cho full-stack?

Spring Boot cho Java backend ổn định, Express cho Node API nhanh. Kết hợp: Spring core services + Express edge services. Thử deploy user service lên Docker – bạn sẽ thấy sức mạnh microservices!

Bạn dùng framework nào cho microservices? Comment chia sẻ nhé. Bài sau: GraphQL vs. REST (Java vs. Node). Theo dõi series để kiến trúc vững!

Happy architecting! 🏗️🌐

<!--more-->