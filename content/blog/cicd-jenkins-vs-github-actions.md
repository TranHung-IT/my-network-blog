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

Nếu bạn là full-stack dev, CI/CD giúp tiết kiệm thời gian, giảm lỗi khi deploy, và đẩy nhanh release. Hãy cùng build pipeline đơn giản để build, test, và deploy nhé – code dễ copy-paste!

## Jenkins vs GitHub Actions: Ôn nhanh

- **Jenkins**: Công cụ CI/CD mã nguồn mở, linh hoạt, chạy trên server riêng (on-premise hoặc cloud). Hỗ trợ pipeline bằng file `Jenkinsfile`, plugin phong phú, nhưng cần setup server.
- **GitHub Actions**: Dịch vụ CI/CD tích hợp sẵn trong GitHub, dùng YAML workflows, dễ setup, phù hợp cho dự án open-source hoặc team nhỏ. Tích hợp chặt chẽ với GitHub repo.

Jenkins mạnh cho enterprise phức tạp, GitHub Actions tiện lợi cho dự án hiện đại, cloud-native.

## Ví dụ cơ bản: CI/CD Pipeline cho ứng dụng

Xây dựng pipeline để build, test, và deploy ứng dụng Spring Boot (REST API) và Express.js (REST API). Giả sử repo có cấu trúc:

{{< highlight plaintext >}}
project/
├── java-app/  # Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── node-app/  # Express.js
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── Jenkinsfile
└── README.md
{{< /highlight >}}

### Jenkins: Pipeline với Jenkinsfile

Cài đặt Jenkins:
- Chạy: `docker run -p 8080:8080 jenkins/jenkins:lts`.
- Cần plugin: Maven, NodeJS, Docker, Git.
- Cấu hình JDK, Maven, NodeJS trong *Manage Jenkins > Global Tool Configuration*.

#### Jenkinsfile
{{< highlight groovy >}}
pipeline {
    agent any
    tools {
        jdk 'JDK17'
        maven 'Maven3'
        nodejs 'Node18'
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/TranHung-IT/project.git'
            }
        }
        stage('Build Java') {
            steps {
                dir('java-app') {
                    sh 'mvn clean package'
                }
            }
        }
        stage('Test Java') {
            steps {
                dir('java-app') {
                    sh 'mvn test'
                }
            }
        }
        stage('Build Node.js') {
            steps {
                dir('node-app') {
                    sh 'npm install'
                }
            }
        }
        stage('Test Node.js') {
            steps {
                dir('node-app') {
                    sh 'npm test'
                }
            }
        }
        stage('Deploy') {
            steps {
                dir('java-app') {
                    sh 'docker build -t java-app:latest .'
                    sh 'docker run -d -p 8080:8080 java-app:latest'
                }
                dir('node-app') {
                    sh 'docker build -t node-app:latest .'
                    sh 'docker run -d -p 3000:3000 node-app:latest'
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
{{< /highlight >}}

#### Dockerfile (Java)
{{< highlight dockerfile >}}
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/java-app.jar .
EXPOSE 8080
CMD ["java", "-jar", "java-app.jar"]
{{< /highlight >}}

#### Dockerfile (Node.js)
{{< highlight dockerfile >}}
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
{{< /highlight >}}

Chạy: Đặt `Jenkinsfile` và `Dockerfile` vào root repo, push lên GitHub. Trong Jenkins, tạo pipeline, chọn SCM (Git), và chạy build. Kiểm tra container chạy tại `localhost:8080` (Java) và `localhost:3000` (Node).

### GitHub Actions: Workflow YAML

Cấu hình GitHub:
- Tạo repo trên GitHub, push code.
- Thêm secret `GITHUB_TOKEN` trong *Settings > Secrets and variables > Actions*.
- Đặt `Dockerfile` như trên vào `java-app/` và `node-app/`.

#### .github/workflows/ci-cd.yml
{{< highlight yaml >}}
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Build Java
        run: |
          cd java-app
          mvn clean package

      - name: Test Java
        run: |
          cd java-app
          mvn test

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Build Node.js
        run: |
          cd node-app
          npm install

      - name: Test Node.js
        run: |
          cd node-app
          npm test

      - name: Build and Push Docker (Java)
        run: |
          cd java-app
          docker build -t ghcr.io/tranhung-it/java-app:latest .
          echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin     
          docker push ghcr.io/tranhung-it/java-app:latest

      - name: Build and Push Docker (Node.js)
        run: |
          cd node-app
          docker build -t ghcr.io/tranhung-it/node-app:latest .
          docker push ghcr.io/tranhung-it/node-app:latest

      - name: Deploy
        run: |
          docker run -d -p 8080:8080 ghcr.io/tranhung-it/java-app:latest
          docker run -d -p 3000:3000 ghcr.io/tranhung-it/node-app:latest
{{< /highlight >}}

Chạy: Push code lên `main` branch, xem pipeline trong *Actions* tab. Container chạy tại `localhost:8080` (Java) và `localhost:3000` (Node).

**So sánh**: Jenkins linh hoạt, cần server; GitHub Actions tích hợp GitHub, setup nhanh.

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