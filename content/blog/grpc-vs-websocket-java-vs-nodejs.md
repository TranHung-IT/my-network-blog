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

Nếu bạn là full-stack dev, hiểu gRPC và WebSocket sẽ giúp bạn xây dựng hệ thống hiệu suất cao, đặc biệt khi kết hợp Java backend và JS frontend. Hãy cùng khám phá cách chúng hoạt động bên dưới, với ví dụ minh họa đơn giản nhé!

## gRPC vs WebSocket: Ôn nhanh

- **gRPC**: Framework RPC dựa trên HTTP/2, dùng Protocol Buffers (Protobuf) để định nghĩa API. Hiệu suất cao nhờ binary serialization (nhỏ gọn hơn JSON), type-safe (schema contract), hỗ trợ bidirectional streaming (client-server hai chiều đồng thời), lý tưởng cho microservices hoặc real-time data nơi latency thấp là ưu tiên.
- **WebSocket**: Giao thức full-duplex qua TCP, bắt đầu bằng HTTP handshake (Upgrade header), sau đó duy trì connection persistent cho message framing (text/binary frames). Phù hợp cho chat, notifications, hoặc game, vì giảm overhead polling (không cần request lặp lại).

gRPC mạnh về performance và scalability nhờ HTTP/2 multiplexing (multiple streams on one connection), WebSocket đơn giản hơn cho real-time web apps nhờ native browser support. Cả hai đều non-blocking, nhưng gRPC schema-driven (compile-time check), WebSocket schema-less (runtime parsing).

## Ví dụ cơ bản: Chat App

Xây dựng chat server nhận tin nhắn từ client và broadcast đến tất cả client. Dùng in-memory storage cho đơn giản.

### gRPC: Java + Node.js

#### Java: gRPC với Spring Boot
Cần dependency `io.grpc:grpc-spring-boot-starter` và Protobuf plugin. gRPC hoạt động bằng cách define service trong .proto file, compile thành stub client/server, hỗ trợ 4 call types (unary, server-streaming, client-streaming, bidirectional).

##### chat.proto (tại `src/main/proto/`)
{{< highlight proto >}}
syntax = "proto3";
option java_package = "com.example.chat";
service ChatService {
    rpc SendMessage (ChatMessage) returns (ChatResponse); // Unary
    rpc ChatStream (stream ChatMessage) returns (stream ChatResponse); // Bidirectional
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
gRPC server extend ImplBase, implement rpc methods với StreamObserver cho streaming. Bidirectional stream cho phép client send/receive liên tục, tương tự WebSocket nhưng với Protobuf serialization.

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

Chạy: `mvn spring-boot:run`. Test với gRPC client (e.g., BloomRPC), gửi `{ user: "Alice", message: "Hi" }` qua `ChatStream`. gRPC bidirectional stream cho phép real-time chat mà không cần polling, với HTTP/2 head-of-line blocking avoidance.

#### Node.js: gRPC với grpc-js
gRPC-js là binding Node cho gRPC, load .proto dynamically, hỗ trợ streaming tương tự Java. Server addService, client call unary/bidirectional.

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
gRPC server bind port, addService với impl functions. ChatStream dùng call.on('data') để handle stream, forEach clients để broadcast, tương tự pub-sub pattern.

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

Chạy: `npm install && node server.js`. Test với gRPC client, gửi `{ user: "Alice", message: "Hi" }`. gRPC streaming non-blocking, scale tốt với HTTP/2, nhưng cần .proto schema – compile-time contract.

### WebSocket: Java + Node.js

#### Java: WebSocket với Spring Boot
WebSocket (RFC 6455) bắt đầu bằng HTTP upgrade handshake, sau đó frame messages (opcode: text/binary/close). Spring WebSocket dùng STOMP over WebSocket cho pub-sub, nhưng raw WebSocket cho simple chat.

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
Spring config registry handlers, enable SockJS fallback cho old browser.

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
Handler extend TextWebSocketHandler, afterConnectionEstablished add session to list, handleTextMessage broadcast, afterConnectionClosed remove.

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

Chạy: `mvn spring-boot:run`. Test với WebSocket client (e.g., wscat: `wscat -c ws://localhost:8080/chat`). WebSocket persistent connection giảm latency so HTTP polling, nhưng cần handle close codes (1000 normal, 1001 going away).

#### Node.js: WebSocket với ws
ws library implement RFC 6455, server on('connection') handle upgrade, on('message') frame parse.

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
ws Server listen port, on('connection') add client, on('message') broadcast to all readyState OPEN clients.

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

Chạy: `npm install && node server.js`. Test với `wscat -c ws://localhost:8080`. WebSocket frame-based (opcode, mask for client), support binary (images), nhưng no built-in auth (cần JWT in URL/query).

**So sánh**: gRPC binary-efficient, schema-enforced; WebSocket text-friendly, browser-native.

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