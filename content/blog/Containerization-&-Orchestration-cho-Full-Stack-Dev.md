+++
author = "Trần Việt Hưng"
title = "Docker vs Kubernetes: Containerization và Orchestration cho Full-Stack Dev"
date = "2025-09-18"
description = "Tiếp nối series Java & JavaScript, bài viết so sánh Docker và Kubernetes để container hóa và quản lý ứng dụng. Hướng dẫn deploy Spring Boot (Java) và Express.js (Node.js) trong container!"
tags = [
    "java",
    "nodejs",
    "docker",
    "kubernetes",
    "containerization",
    "orchestration",
    "devops",
    "deployment",
]
categories = [
    "java",
    "javascript",
    "devops",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Sau bài về tối ưu performance, hôm nay mình sẽ khám phá **Docker** và **Kubernetes** – hai công cụ cốt lõi trong DevOps để container hóa và orchestration ứng dụng. Docker giúp đóng gói app (Java/Node.js) thành container dễ deploy, Kubernetes (K8s) quản lý scale và high availability cho nhiều container.

Nếu bạn là full-stack dev (Java backend + JS frontend), hiểu Docker và K8s sẽ giúp deploy ứng dụng mượt mà, scale tự động, và tránh "it works on my machine". Chúng ta sẽ build container cho Spring Boot và Express.js, rồi deploy lên K8s – code dễ copy-paste!

## Docker vs Kubernetes: Ôn nhanh

- **Docker**: Công cụ containerization, tạo image từ Dockerfile (đóng gói app + dependencies). Nhẹ, portable, chạy trên local/server/cloud.
- **Kubernetes**: Orchestration platform, quản lý cluster container (deploy, scale, load balance, self-healing). Dựa trên Docker, dùng YAML manifests.

Docker lý tưởng cho dev/single app, Kubernetes cho production/multi-app. Cả hai hỗ trợ Java (Maven Docker plugin) và Node.js (multi-stage build).

## Ví dụ cơ bản: Container hóa ứng dụng

Xây dựng Docker image cho Spring Boot (REST API users) và Express.js (REST API users), rồi deploy lên K8s cluster (minikube local).

### Docker: Dockerfile cho Java và Node.js

#### Dockerfile (Spring Boot - Java)
{{< highlight dockerfile >}}
FROM maven:3.8.6-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
{{< /highlight >}}

#### Dockerfile (Express.js - Node.js)
{{< highlight dockerfile >}}
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
{{< /highlight >}}

#### server.js (Express.js ví dụ)
{{< highlight javascript >}}
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/users', (req, res) => res.json([{ id: 1, name: 'Alice' }]));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
{{< /highlight >}}

#### pom.xml (Spring Boot ví dụ)
{{< highlight xml >}}
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
{{< /highlight >}}

#### UserController.java (Spring Boot ví dụ)
{{< highlight java >}}
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping
    public List<User> getUsers() {
        return List.of(new User(1L, "Alice", "alice@email.com"));
    }
}

class User {
    private Long id;
    private String name;
    private String email;

    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    // Getters...
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}
{{< /highlight >}}

Build và run:
- Java: `docker build -t spring-app .` rồi `docker run -p 8080:8080 spring-app`.
- Node.js: `docker build -t node-app .` rồi `docker run -p 3000:3000 node-app`.

Test: `curl http://localhost:8080/api/users` (Java), `curl http://localhost:3000/api/users` (Node).

### Kubernetes: Deploy lên cluster

Cài Minikube: `minikube start`. Tạo manifests YAML.

#### deployment-java.yaml
{{< highlight yaml >}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spring-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: spring-app
  template:
    metadata:
      labels:
        app: spring-app
    spec:
      containers:
      - name: spring
        image: spring-app:latest
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: spring-service
spec:
  selector:
    app: spring-app
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
{{< /highlight >}}

#### deployment-node.yaml
{{< highlight yaml >}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
      - name: node
        image: node-app:latest
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: node-service
spec:
  selector:
    app: node-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
{{< /highlight >}}

Deploy: `kubectl apply -f deployment-java.yaml` và `kubectl apply -f deployment-node.yaml`. Scale: `kubectl scale deployment spring-app --replicas=5`. Test: `minikube service spring-service` (port-forward để access).

**So sánh**: Docker đơn giản cho local, K8s tự động scale/heal cho production.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Docker                        | Kubernetes                   |
|-------------------|-------------------------------|------------------------------|
| **Ease of Use**  | Dễ học, local dev            | Phức tạp, cần cluster        |
| **Scalability**  | Manual scale                 | Auto scale, rolling update   |
| **Portability**  | Cao (image chạy everywhere)  | Cao, multi-cloud             |
| **Monitoring**   | Basic logs                   | Built-in (metrics, logs)     |
| **Use Case**     | Dev/test, single app         | Production, microservices    |

Docker cho beginner, Kubernetes cho pro deployment.

## Kết luận: Chọn cái nào cho full-stack?

Docker cho dev nhanh, Kubernetes cho production scale. Kết hợp: Docker build image, K8s orchestrate. Thử deploy Spring Boot lên Minikube – bạn sẽ thấy sức mạnh container!

Bạn đã dùng Docker/K8s chưa? Comment chia sẻ nhé. Bài sau: Serverless với AWS Lambda (Java vs Node.js). Theo dõi để DevOps pro hơn!

Happy containerizing! 🐳☸

<!--more-->