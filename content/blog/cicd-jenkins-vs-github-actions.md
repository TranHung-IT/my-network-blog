+++
author = "Trần Việt Hưng"
title = "CI/CD với Jenkins vs GitHub Actions: Tự động hóa quy trình triển khai cho full-stack dev"
date = "2025-09-03"
description = "Tiếp nối series Java & JavaScript, bài viết so sánh Jenkins và GitHub Actions để tự động hóa CI/CD. Hướng dẫn build pipeline triển khai ứng dụng Java (Spring Boot) và Node.js (Express)!"
tags = [
    "java",
    "nodejs",
    "cicd",
    "jenkins",
    "github-actions",
    "devops",
    "automation",
]
categories = [
    "javascript",
    "java",
    "devops",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Java & JavaScript trên blog. Sau bài về gRPC vs WebSocket, hôm nay chúng ta khám phá **CI/CD** – chìa khóa để tự động hóa quy trình phát triển và triển khai phần mềm. Mình sẽ so sánh **Jenkins** (công cụ CI/CD truyền thống) và **GitHub Actions** (giải pháp hiện đại tích hợp GitHub), đồng thời hướng dẫn xây dựng pipeline triển khai ứng dụng **Spring Boot** (Java) và **Express.js** (Node.js).

Nếu bạn là full-stack dev, CI/CD giúp tiết kiệm thời gian, giảm lỗi khi deploy, và đẩy nhanh release. Hãy cùng khám phá cách nó hoạt động bên dưới, với ví dụ minh họa nhé!

## CI/CD: Nền tảng và tầm quan trọng

CI/CD (Continuous Integration/Continuous Delivery/Deployment) là thực hành DevOps để tự động hóa build, test, và deploy code. **CI** (Continuous Integration): Merge code thường xuyên, build/test tự động để phát hiện lỗi sớm. **CD** (Continuous Delivery): Tự động deploy đến staging, ready for production; **Continuous Deployment**: Auto deploy to production nếu test pass.

CI/CD dựa trên version control (Git), containerization (Docker), và orchestration (K8s), giảm manual work, tăng velocity (deploy hàng ngày thay tuần). Vấn đề với manual: Human error, slow feedback loop, bottleneck. CI/CD giải quyết bằng pipeline (DAG - Directed Acyclic Graph), stages sequential/parallel.

Ví dụ flow: Commit → Trigger build → Run tests → Scan security → Deploy staging → Manual approval → Deploy production.

## Jenkins: Architecture và Pipeline

Jenkins là CI/CD server mã nguồn mở (2004, Hudson fork), chạy on-premise/cloud, hỗ trợ 1,800+ plugins. Architecture: Master-slave (master orchestrate, slave run jobs), Groovy DSL cho scripted pipeline, Declarative syntax cho readable.

### Pipeline Model
- **Scripted Pipeline**: Groovy script, flexible nhưng verbose.
- **Declarative Pipeline**: DSL structured (stages, steps, agents), easier maintain.

Jenkins dùng Job (Freestyle, Pipeline), Trigger (webhook, poll SCM), Artifacts (build output), Plugins (Maven, Docker). Scale bằng distributed builds (agent labels).

Ví dụ Declarative Pipeline cơ bản:
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
    }
}
```

Ưu: Customizable, plugin ecosystem; Nhược: Setup heavy, security risks nếu plugin vulnerable.

## GitHub Actions: Workflows và Events

GitHub Actions (2019) là SaaS CI/CD, tích hợp GitHub, dùng YAML workflows (.github/workflows/*.yml). Architecture: Virtual machines (runners: Ubuntu, Windows, macOS), Events trigger (push, pull_request), Jobs parallel, Steps sequential.

### Workflow Model
- **Events**: Trigger (push to main, PR open).
- **Jobs**: Parallel units (matrix strategy cho multi-env).
- **Steps**: Commands (run, uses actions/checkout).
- **Artifacts**: Upload/download build output.

Actions marketplace (re-usable actions), Secrets (env vars secure), Caching (speed up npm/mvn). Scale tự động, pay-per-minute (2,000 free minutes/month).

Ví dụ YAML workflow cơ bản:
```yaml
name: CI Pipeline
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
```

Ưu: Zero-setup, GitHub integration; Nhược: Vendor lock-in, minute limits.

## So sánh: Pipeline Execution và Scaling

- **Execution**: Jenkins sequential/parallel stages, GitHub Actions jobs parallel (matrix for cross-platform).
- **Scaling**: Jenkins agents (Kubernetes plugin), GitHub self-hosted runners.
- **Security**: Jenkins RBAC, GitHub OIDC for AWS.

Ví dụ multi-env GitHub:
```yaml
strategy:
  matrix:
    os: [ubuntu, windows]
    node: [16, 18]
```

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Jenkins                       | GitHub Actions               |
|-------------------|-------------------------------|------------------------------|
| **Setup**        | Cần server, cấu hình phức tạp | Tích hợp GitHub, dễ bắt đầu |
| **Scalability**  | Linh hoạt, hỗ trợ cluster    | Giới hạn bởi GitHub runners |
| **Cost**         | Miễn phí (on-premise)        | Miễn phí cho public repo    |
| **Ecosystem**    | Plugin đa dạng, enterprise   | Actions marketplace, cloud-native |
| **Use Case**     | Dự án lớn, legacy            | Dự án nhỏ, open-source      |

Jenkins phù hợp cho hệ thống phức tạp, GitHub Actions lý tưởng cho team nhỏ, DevOps hiện đại.

## Kết luận: Chọn cái nào cho full-stack?

Jenkins nếu bạn cần tùy chỉnh sâu, chạy on-premise; GitHub Actions nếu muốn nhanh, tích hợp GitHub. Java dev có thể dùng Jenkins cho Maven, Node.js dev hợp với Actions cho npm. Thử setup pipeline trên và deploy thử – bạn sẽ thấy quy trình mượt mà!

Bạn đã dùng CI/CD chưa? Comment chia sẻ nhé. Bài sau: Tối ưu performance với Java và Node.js. Theo dõi để full-stack pro hơn!

Happy automating! 🚀🔧

<!--more-->