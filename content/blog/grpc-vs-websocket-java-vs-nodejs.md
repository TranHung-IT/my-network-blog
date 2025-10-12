+++
author = "Trần Việt Hưng"
title = "gRPC vs WebSocket: So sánh triển khai với Java và Node.js cho ứng dụng real-time"
date = "2025-10-09"
description = "Tiếp nối series Java & JavaScript, bài viết so sánh gRPC và WebSocket khi triển khai với Java và Node.js. Hướng dẫn build một ứng dụng chat real-time đơn giản cho full-stack dev!"
tags = [
    "java",
    "nodejs",
    "grpc",
    "websocket",
    "real-time",
    "networking",
    "chat-app",
]
categories = [
    "javascript",
    "java",
    "networking",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series Java & JavaScript trên blog. Sau bài về GraphQL vs REST, hôm nay chúng ta đi sâu vào **gRPC** và **WebSocket** – hai công nghệ mạnh mẽ cho ứng dụng real-time như chat, livestream, hay game online. Mình sẽ so sánh cách triển khai một chat app đơn giản dùng **Java** (gRPC với Spring Boot, WebSocket với Java) và **Node.js** (gRPC với grpc-js, WebSocket với ws).

Nếu bạn là full-stack dev, hiểu gRPC và WebSocket sẽ giúp bạn xây dựng hệ thống hiệu suất cao, đặc biệt khi kết hợp Java backend và JS frontend. Hãy cùng code một chat server gửi/nhận tin nhắn nhé – code dễ copy-paste!

## gRPC vs WebSocket: Ôn nhanh

- **gRPC**: Framework RPC dựa trên HTTP/2, dùng Protocol Buffers (Protobuf) để định nghĩa API. Hiệu suất cao, type-safe, hỗ trợ bidirectional streaming, lý tưởng cho microservices hoặc real-time data.
- **WebSocket**: Giao thức full-duplex qua TCP, cho phép client-server giao tiếp liên tục (không cần polling). Phù hợp cho chat, notifications, hoặc game.

gRPC mạnh về performance và scalability, WebSocket đơn giản hơn cho real-time web apps.

## Ví dụ cơ bản: Chat App

Xây dựng chat server nhận tin nhắn từ client và broadcast đến tất cả client. Dùng in-memory storage cho đơn giản.

### gRPC: Java + Node.js

#### Java: gRPC với Spring Boot
Cần dependency `io.grpc:grpc-spring-boot-starter` và Protobuf plugin.

##### pom.xml
{{< highlight xml >}}
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>io.grpc</groupId>
        <artifactId>grpc-spring-boot-starter</artifactId>
        <version>2.14.0</version>
    </dependency>
</dependencies>
<build>
    <extensions>
        <extension>
            <groupId>kr.motd.maven</groupId>
            <artifactId>os-maven-plugin</artifactId>
            <version>1.7.0</version>
        </extension>
    </extensions>
    <plugins>
        <plugin>
            <groupId>org.xolstice.maven.plugins</groupId>
            <artifactId>protobuf-maven-plugin</artifactId>
            <version>0.6.1</version>
            <configuration>
                <protocArtifact>com.google.protobuf:protoc:3.19.4:exe:${os.detected.classifier}</protocArtifact>
                <pluginId>grpc-java</pluginId>
                <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.43.2:exe:${os.detected.classifier}</pluginArtifact>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>compile</goal>
                        <goal>compile-custom</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
{{< /highlight >}}

##### chat.proto (tại `src/main/proto/`)
{{< highlight proto >}}
syntax = "proto3";
option java_package = "com.example.chat";
service ChatService {
    rpc SendMessage (ChatMessage) returns (ChatResponse);
    rpc ChatStream (stream ChatMessage) returns (stream ChatResponse);
}
message ChatMessage {
    string user = 1;
    string message = 2;
}
message ChatResponse {
    string user = 1;
    string message = 2;
}
{{< /highlight >}}

##### ChatServiceImpl.java
{{< highlight java >}}
import io.grpc.stub.StreamObserver;
import org.lognet.springboot.grpc.GRpcService;
import java.util.ArrayList;
import java.util.List;

@GRpcService
public class ChatServiceImpl extends ChatServiceGrpc.ChatServiceImplBase {
    private final List<StreamObserver<ChatResponse>> clients = new ArrayList<>();

    @Override
    public void sendMessage(ChatMessage request, StreamObserver<ChatResponse> responseObserver) {
        ChatResponse response = ChatResponse.newBuilder()
                .setUser(request.getUser())
                .setMessage("Echo: " + request.getMessage())
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public StreamObserver<ChatMessage> chatStream(StreamObserver<ChatResponse> responseObserver) {
        clients.add(responseObserver);
        return new StreamObserver<ChatMessage>() {
            @Override
            public void onNext(ChatMessage msg) {
                ChatResponse response = ChatResponse.newBuilder()
                        .setUser(msg.getUser())
                        .setMessage(msg.getMessage())
                        .build();
                for (StreamObserver<ChatResponse> client : clients) {
                    client.onNext(response);
                }
            }
            @Override
            public void onError(Throwable t) {
                clients.remove(responseObserver);
            }
            @Override
            public void onCompleted() {
                clients.remove(responseObserver);
            }
        };
    }
}
{{< /highlight >}}

Chạy: `mvn spring-boot:run`. Test với gRPC client (e.g., BloomRPC), gửi `{ user: "Alice", message: "Hi" }` qua `ChatStream`.

#### Node.js: gRPC với grpc-js
Cài `npm i @grpc/grpc-js @grpc/proto-loader`.

##### package.json
{{< highlight json >}}
{
  "dependencies": {
    "@grpc/grpc-js": "^1.8.0",
    "@grpc/proto-loader": "^0.7.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}
{{< /highlight >}}

##### server.js (gRPC)
{{< highlight javascript >}}
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './chat.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const chatProto = grpc.loadPackageDefinition(packageDefinition).com.example.chat;

const clients = [];

function sendMessage(call, callback) {
    callback(null, { user: call.request.user, message: `Echo: ${call.request.message}` });
}

function chatStream(call) {
    clients.push(call);
    call.on('data', (msg) => {
        const response = { user: msg.user, message: msg.message };
        clients.forEach(client => client.write(response));
    });
    call.on('end', () => {
        clients.splice(clients.indexOf(call), 1);
    });
}

const server = new grpc.Server();
server.addService(chatProto.ChatService.service, { sendMessage, chatStream });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('gRPC Server running on port 50051');
    server.start();
});
{{< /highlight >}}

Chạy: `npm install && node server.js`. Test với gRPC client, gửi `{ user: "Alice", message: "Hi" }`.

### WebSocket: Java + Node.js

#### Java: WebSocket với Spring Boot
Dùng `spring-boot-starter-websocket`.

##### pom.xml
{{< highlight xml >}}
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
</dependencies>
{{< /highlight >}}

##### WebSocketConfig.java
{{< highlight java >}}
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new ChatWebSocketHandler(), "/chat").setAllowedOrigins("*");
    }
}
{{< /highlight >}}

##### ChatWebSocketHandler.java
{{< highlight java >}}
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.util.ArrayList;
import java.util.List;

public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final List<WebSocketSession> sessions = new ArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        session.sendMessage(new TextMessage("Connected to chat server"));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(payload));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        sessions.remove(session);
    }
}
{{< /highlight >}}

Chạy: `mvn spring-boot:run`. Test với WebSocket client (e.g., wscat: `wscat -c ws://localhost:8080/chat`).

#### Node.js: WebSocket với ws
Cài `npm i ws`.

##### package.json
{{< highlight json >}}
{
  "dependencies": {
    "ws": "^8.9.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}
{{< /highlight >}}

##### server.js (WebSocket)
{{< highlight javascript >}}
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send('Connected to chat server');

    ws.on('message', (message) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket Server running on port 8080');
{{< /highlight >}}

Chạy: `npm install && node server.js`. Test với `wscat -c ws://localhost:8080`.

**So sánh**: gRPC nhanh, type-safe, cần Protobuf; WebSocket đơn giản, dễ tích hợp với browser.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | gRPC (Java/Node)              | WebSocket (Java/Node)        |
|-------------------|-------------------------------|------------------------------|
| **Performance**  | Cao (HTTP/2, binary)         | Tốt (TCP, text/binary)      |
| **Ease of Use**  | Phức tạp (Protobuf, schema)  | Đơn giản (JS native hỗ trợ) |
| **Type Safety**  | Cao (Protobuf contract)      | Thấp (manual parsing)       |
| **Use Case**     | Microservices, enterprise    | Web apps, chat, games       |
| **Tooling**      | gRPC clients, BloomRPC       | wscat, browser DevTools     |

gRPC lý tưởng cho backend-to-backend, WebSocket cho browser-based real-time.

## Kết luận: Chọn cái nào cho full-stack?

gRPC nếu bạn cần hiệu suất cao, type-safe cho microservices; WebSocket nếu làm web app (React, Vue) cần real-time đơn giản. Java mạnh về enterprise, Node.js nhanh prototype. Thử chạy code trên – gửi tin nhắn từ 2 client để thấy broadcast!

Bạn đã dùng gRPC hay WebSocket chưa? Comment chia sẻ nhé. Bài sau: CI/CD với Jenkins vs GitHub Actions. Theo dõi để full-stack pro hơn!

Happy networking! 🚀💬

<!--more-->