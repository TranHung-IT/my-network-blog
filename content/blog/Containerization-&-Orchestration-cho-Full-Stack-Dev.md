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

Nếu bạn là full-stack dev (Java backend + JS frontend), hiểu Docker và K8s sẽ giúp deploy ứng dụng mượt mà, scale tự động, và tránh "it works on my machine". Chúng ta sẽ khám phá cách chúng hoạt động bên dưới, với ví dụ minh họa đơn giản – code dễ copy-paste!

## Docker vs Kubernetes: Ôn nhanh

- **Docker**: Công cụ containerization, dựa trên Linux kernel features như cgroups (resource isolation) và namespaces (process isolation) để tạo môi trường ảo nhẹ, chia sẻ kernel host nhưng cách ly filesystem/network. Mỗi container là instance chạy của image, built từ Dockerfile – template immutable chứa layers (base OS + app code + deps).
- **Kubernetes**: Nền tảng orchestration, quản lý cluster container qua control plane (API Server xử lý requests, etcd lưu state, Scheduler assign pods to nodes, Controller Manager reconcile desired vs actual state). Data plane dùng Kubelet (node agent) để run pods, Kube-proxy cho networking.

Docker tập trung vào packaging (build once, run anywhere), Kubernetes vào management (declarative state, self-healing). Docker giải quyết "dependency hell" bằng reproducible builds, Kubernetes giải quyết "orchestration hell" bằng controller loop – reconcile actual state với desired state từ YAML manifests.

## Containerization: Cách Docker hoạt động

Docker (2013) cách mạng hóa deployment bằng container – lightweight VM thay vì full VM. Kernel features: cgroups limit CPU/memory, namespaces isolate PID/network/UTS/mount. Image là read-only layers (union filesystem), container thêm writable layer.

Build process: Dockerfile instructions (FROM base image, RUN commands, COPY files, CMD entrypoint) tạo layers cached – chỉ rebuild changed layers. Runtime: Docker daemon (dockerd) manage lifecycle (create, start, stop), networking (bridge mode cho isolation), volumes cho persistent data.

Ví dụ Dockerfile cơ bản cho Spring Boot:
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

Build: `docker build -t spring-app .`. Lý do portable: Image chứa tất cả deps, chạy consistent trên dev/staging/prod. Nhược: Không auto-scale, manual networking (docker-compose cho multi-container local).

## Orchestration: Cách Kubernetes hoạt động

Kubernetes (K8s, 2014) là hệ thống phân tán quản lý container, dựa trên 4 nguyên tắc: Declarative config (YAML define desired state), Controller pattern (loop watch + act), API-driven (kubectl/yaml apply), Extensible (CRDs cho custom resources).

Core components: Pod (atomic unit, 1+ containers shared volume), ReplicaSet (maintain pod count), Deployment (rolling update ReplicaSet), Service (stable endpoint, load balance), Namespace (isolation), ConfigMap/Secret (inject config).

Deployment process: `kubectl apply -f deployment.yaml` → API Server validate → etcd store → Scheduler assign pod to node → Kubelet pull image, run container → Kube-proxy setup networking. Self-healing: Health checks (liveness/readiness probes) restart failed pods, node fail reschedule.

Ví dụ Deployment YAML cho Node.js:
```yaml
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
```

Apply: `kubectl apply -f deployment.yaml`. Lý do scalable: HPA (Horizontal Pod Autoscaler) auto scale dựa CPU/memory, rolling update zero-downtime. Nhược: YAML verbose, learning curve steep (kubectl commands, RBAC).

## So sánh: Container vs Orchestration

- **Portability**: Docker image consistent (build once, run anywhere), K8s YAML declarative (gitops, version control manifests).
- **Scaling**: Docker manual (`docker run --scale`), K8s HPA metrics-driven (custom metrics via Prometheus).
- **Resilience**: Docker single host fail toàn bộ, K8s self-healing (pod eviction, node drain).
- **Security**: Docker seccomp/AppArmor, K8s RBAC (role-based access), NetworkPolicy (pod-to-pod firewall).

Ví dụ server.js Node.js:
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/users', (req, res) => res.json([{ id: 1, name: 'Alice' }]));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

pom.xml Spring Boot:
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

UserController.java:
```java
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
```

Build/run: Docker cho local, K8s cho cluster.

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