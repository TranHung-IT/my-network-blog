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

Chào các bạn! Mình là Trần Việt Hưng, quay lại với series Java & JavaScript trên blog. Sau khi so sánh Streams vs. Array Methods, hôm nay chúng ta đi sâu vào **Socket Programming** – nền tảng của networking, dùng để xây dựng ứng dụng real-time như chat, game online. Mình sẽ so sánh **Java** (dùng ServerSocket cho TCP) và **Node.js** (dùng module 'net' – JS thuần, không cần Socket.io).

Nếu bạn full-stack, Socket giúp backend Java/Node giao tiếp trực tiếp với client mà không qua HTTP overhead. Chúng ta sẽ code một chat server đơn giản (echo messages từ client). Hãy cùng build nhé – code dễ copy-paste!

## Socket Programming là gì? Ôn nhanh

Socket là "cổng kết nối" giữa client-server qua TCP/IP. Quy trình cơ bản:
1. **Server**: Listen port, accept connections.
2. **Client**: Connect đến server IP:port, send/receive data.
3. **Data flow**: Stream bytes hai chiều, cần handle async (đọc/ghi không block).

Java: Blocking I/O (dễ cho beginner), Node.js: Non-blocking (event-driven, phù hợp high concurrency).

## Ví dụ cơ bản: Echo Server & Client

Giả sử server listen port 8080, echo lại message từ client.

### Java: ServerSocket (Blocking I/O)
Java dùng `java.net.ServerSocket` – đơn giản, thread-safe.

#### Server (EchoServer.java)
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

Chạy: `javac EchoServer.java && java EchoServer` (server), `java EchoClient` (client).

### Node.js: Module 'net' (Non-blocking I/O)
Node dùng `net.createServer()` – event-based, scale tốt cho nhiều connections.

#### Server (echo-server.js)
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

Chạy: `node echo-server.js` (server), `node echo-client.js` (client).

**So sánh**: Node ngắn gọn hơn (không cần thread, dùng events), Java verbose nhưng robust (exception handling tốt). Node tốt cho I/O heavy (chat với 1000 users), Java cho CPU-bound tasks.

## Xử lý Multiple Clients: Threading vs. Events

- **Java**: Dùng Thread pool (ExecutorService) để tránh tạo thread mới mỗi connection (tránh overhead).
  {{< highlight java >}}
  import java.util.concurrent.*;
  // Trong main: ExecutorService executor = Executors.newFixedThreadPool(10);
  // executor.execute(() -> handleClient(clientSocket));
  {{< /highlight >}}
- **Node**: Native non-blocking, handle hàng nghìn connections với single thread (event loop). Dùng cluster module cho multi-core nếu cần.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java Socket                    | Node.js 'net' Module           |
|-------------------|--------------------------------|-------------------------------|
| **Concurrency**  | Thread-based (blocking, scale kém nếu nhiều users) | Event-driven (non-blocking, scale cao) |
| **Performance**  | Tốt cho low-latency, enterprise | Tốt cho I/O, real-time (chat/game) |
| **Learning Curve** | Dễ cho OOP dev, nhiều docs | Dễ cho JS dev, callback/async |
| **Error Handling** | Explicit try-catch             | Events (on('error'))          |
| **Use Case**     | Backend services, Android      | WebSocket bridge, API real-time |

Cả hai đều low-level; cho production, dùng WebSocket (Spring WebSocket cho Java, Socket.io cho Node).

## Kết luận: Bắt đầu với cái nào?

Nếu bạn Java dev, bắt đầu với ServerSocket để hiểu TCP sâu; Node.js cho JS frontend real-time. Thử chạy code trên – connect 2 client cùng lúc để thấy echo! Kết hợp: Java server + Node gateway cho hybrid app.

Bạn đã build chat app chưa? Chia sẻ kinh nghiệm comment nhé. Bài sau: Microservices với Spring Boot vs. Express.js. Theo dõi để full-stack pro hơn!

Happy networking! 🔌💬

<!--more-->