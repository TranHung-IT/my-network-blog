+++
author = "Trần Việt Hưng"
title = "Socket Programming cơ bản: Java vs. Node.js – Xây dựng chat app đơn giản cho full-stack dev"
date = "2025-09-01"
description = "Tiếp nối series, bài viết hướng dẫn Socket Programming cơ bản với Java (ServerSocket) và Node.js (net module). So sánh cách implement chat app real-time, giúp bạn hiểu low-level networking!"
tags = [
    "java",
    "nodejs",
    "socket-programming",
    "networking",
    "chat-app",
]
categories = [
    "java",
    "javascript",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, quay lại với series Java & JavaScript trên blog. Sau khi so sánh Streams vs. Array Methods, hôm nay chúng ta đi sâu vào **Socket Programming** – nền tảng cốt lõi của networking, nơi mọi giao tiếp client-server bắt đầu từ low-level connections. Socket Programming cho phép xây dựng ứng dụng real-time như chat hoặc game online bằng cách xử lý trực tiếp các stream dữ liệu qua TCP/IP, tránh overhead của HTTP.

Nếu bạn full-stack, Socket giúp backend Java/Node giao tiếp trực tiếp với client mà không qua HTTP overhead, tận dụng cơ chế blocking/non-blocking để xử lý concurrency. Chúng ta sẽ khám phá cách Java và Node.js tiếp cận socket qua mô hình threading vs event-driven, với ví dụ minh họa một chat server đơn giản (echo messages từ client) – code dễ copy-paste!

## Socket Programming: Nền tảng TCP/IP và mô hình I/O

Socket là abstraction của endpoint trong giao thức TCP/IP, đại diện cho "cổng kết nối" giữa client-server. TCP (Transmission Control Protocol) đảm bảo reliable, ordered delivery qua 3-way handshake (SYN, SYN-ACK, ACK), flow control (window size), và congestion avoidance (slow start). Quy trình: Server bind/listen port (e.g., 8080), accept connection tạo new socket, client connect gửi SYN packet; sau đó data flow qua bidirectional stream bytes, handle async để tránh block main thread.

Java dùng blocking I/O (synchronous, dễ cho beginner nhưng kém scale với nhiều connections vì thread per client tốn memory/context switch). Node.js non-blocking I/O (asynchronous, event-driven với libuv loop), single thread handle hàng nghìn connections qua callbacks, phù hợp high concurrency I/O-bound tasks. Sự khác biệt cốt lõi: Java thread model (OS threads, heavy), Node event loop (user-space, lightweight).

## Ví dụ cơ bản: Echo Server & Client

Giả sử server listen port 8080, echo lại message từ client. Ví dụ minh họa cách blocking I/O trong Java yêu cầu thread pool cho concurrency, trong khi Node dùng event emitters cho non-blocking.

### Java: ServerSocket (Blocking I/O)
Java.net.ServerSocket implement TCP server, accept() block đến connection mới, tạo Socket stream cho read/write. Để handle multiple clients, cần Thread per connection, tránh single thread block.

#### Server (EchoServer.java)
ServerSocket listen, accept loop tạo thread cho mỗi client, BufferedReader/PrintWriter cho line-based I/O, try-with-resources auto-close.

{{< highlight java >}}
import java.io.*;
import java.net.*;

public class EchoServer {
    public static void main(String[] args) {
        int port = 8080;
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Server listening on port " + port);
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("Client connected: " + clientSocket.getInetAddress());

                // Tạo thread riêng cho mỗi client (để handle multiple)
                new Thread(() -> handleClient(clientSocket)).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleClient(Socket clientSocket) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
             PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                System.out.println("Received: " + inputLine);
                out.println("Echo: " + inputLine);  // Echo back
                if ("bye".equalsIgnoreCase(inputLine)) break;
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                clientSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
{{< /highlight >}}

#### Client (EchoClient.java)
Client connect, bidirectional stream với PrintWriter/BufferedReader, loop read stdin/send until "bye".

{{< highlight java >}}
import java.io.*;
import java.net.*;

public class EchoClient {
    public static void main(String[] args) {
        String host = "localhost";
        int port = 8080;
        try (Socket socket = new Socket(host, port);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             BufferedReader stdIn = new BufferedReader(new InputStreamReader(System.in))) {
            String userInput;
            System.out.println("Connected to server. Type message (or 'bye' to quit):");
            while ((userInput = stdIn.readLine()) != null) {
                out.println(userInput);
                if ("bye".equalsIgnoreCase(userInput)) break;
                String response = in.readLine();
                System.out.println("Server: " + response);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
{{< /highlight >}}

Chạy: `javac EchoServer.java && java EchoServer` (server), `java EchoClient` (client). Java blocking I/O yêu cầu explicit thread management cho concurrency, dễ race condition nếu shared state.

### Node.js: Module 'net' (Non-blocking I/O)
net module cung cấp TCP/UDP sockets, createServer() callback on connection, on('data') non-blocking read, write() async send. Event-driven model dùng libuv loop, single thread handle multiple sockets qua epoll/kqueue.

#### Server (echo-server.js)
createServer callback per connection, on('data') trigger khi buffer ready, on('end') detect close, error handling với on('error').

{{< highlight javascript >}}
const net = require('net');

const PORT = 8080;
const server = net.createServer((socket) => {
  console.log('Client connected:', socket.remoteAddress + ':' + socket.remotePort);

  socket.on('data', (data) => {
    const message = data.toString().trim();
    console.log('Received:', message);
    socket.write(`Echo: ${message}\n`);
    if (message.toLowerCase() === 'bye') {
      socket.end();
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
{{< /highlight >}}

#### Client (echo-client.js)
createConnection callback on connect, stdin on('data') send, on('data') receive, on('end') exit.

{{< highlight javascript >}}
const net = require('net');

const HOST = 'localhost';
const PORT = 8080;
const client = net.createConnection({ host: HOST, port: PORT }, () => {
  console.log('Connected to server. Type message (or "bye" to quit):');
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', (data) => {
    const message = data.trim();
    client.write(message);
    if (message.toLowerCase() === 'bye') {
      client.end();
    }
  });
});

client.on('data', (data) => {
  console.log('Server:', data.toString().trim());
});

client.on('end', () => {
  console.log('Disconnected from server');
  process.exit(0);
});

client.on('error', (err) => {
  console.error('Client error:', err);
});
{{< /highlight >}}

Chạy: `node echo-server.js` (server), `node echo-client.js` (client). Node non-blocking scale tốt (C10K problem solved by event loop), không thread overhead, nhưng single-thread vulnerable to CPU-bound tasks.

**So sánh**: Java verbose với explicit threading (OS context switch heavy), Node concise event-driven (user-space scheduling lightweight). Java robust cho error (try-catch), Node callback-based dễ callback hell nếu nest sâu.

## Xử lý Multiple Clients: Threading vs. Events

Java blocking I/O yêu cầu Thread per connection (ExecutorService pool để limit threads, tránh OOM), mỗi thread có stack riêng (1MB default), scale kém với 1000+ clients do context switch. Node event loop (libuv) single-thread multiplex I/O với select/epoll, handle 100k connections, nhưng CPU-bound block loop (dùng child_process hoặc cluster cho multi-core).

Java ExecutorService:
```java
import java.util.concurrent.*;
ExecutorService executor = Executors.newFixedThreadPool(10);
executor.execute(() -> handleClient(clientSocket));
```

Node cluster module multi-process:
```javascript
const cluster = require('cluster');
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) cluster.fork();
}
```

Java thread model scalable với NIO (non-blocking I/O từ Java 4), Node native non-blocking.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java Socket                    | Node.js 'net' Module           |
|-------------------|--------------------------------|-------------------------------|
| **Concurrency**  | Thread-based (blocking, scale kém nếu nhiều users) | Event-driven (non-blocking, scale cao) |
| **Performance**  | Tốt cho low-latency, enterprise | Tốt cho I/O, real-time (chat/game) |
| **Learning Curve** | Dễ cho OOP dev, nhiều docs | Dễ cho JS dev, callback/async |
| **Error Handling** | Explicit try-catch             | Events (on('error'))          |
| **Use Case**     | Backend services, Android      | WebSocket bridge, API real-time |

Cả hai low-level; production dùng WebSocket (Spring WebSocket Java, Socket.io Node) cho browser compatibility.

## Kết luận: Bắt đầu với cái nào?

Java dev bắt đầu ServerSocket hiểu TCP sâu (handshake, stream semantics); Node.js dev cho JS frontend real-time (event loop handle I/O). Thử chạy code trên – connect 2 client cùng lúc để thấy echo! Kết hợp: Java server robust, Node gateway lightweight cho hybrid app.

Bạn đã build chat app chưa? Comment chia sẻ nhé. Bài sau: Microservices với Spring Boot vs. Express.js. Theo dõi để full-stack pro hơn!

Happy networking! 🔌💬

<!--more-->
