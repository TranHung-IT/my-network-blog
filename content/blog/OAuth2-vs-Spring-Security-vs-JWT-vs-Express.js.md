+++
author = "Trần Việt Hưng"
title = "Security Best Practices: OAuth2 với Spring Security vs JWT với Express.js cho Full-Stack Dev"
date = "2025-10-10"
description = "Tiếp nối series Java & JavaScript, bài viết khám phá security best practices với OAuth2 (Spring Security) và JWT (Express.js). Hướng dẫn triển khai authentication/authorization cho API users!"
tags = [
    "java",
    "nodejs",
    "security",
    "oauth2",
    "jwt",
    "spring-security",
    "express",
    "authentication",
    "authorization",
]
categories = [
    "java",
    "javascript",
    "security",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Sau bài về Serverless Architecture với AWS Lambda (bài 10), hôm nay mình sẽ đi sâu vào **Security Best Practices** – yếu tố quan trọng nhất để bảo vệ ứng dụng khỏi các mối đe dọa như data breach hay session hijacking. Mình sẽ so sánh **OAuth2 với Spring Security** (Java) và **JWT với Express.js** (Node.js), từ cơ chế authentication/authorization đến cách implement secure API users (login, token validation, role-based access).

Nếu bạn là full-stack dev (Java backend + JS frontend), việc nắm vững security không chỉ giúp tránh lỗ hổng mà còn xây dựng hệ thống đáng tin cậy, tuân thủ các chuẩn như OWASP. Chúng ta sẽ khám phá cách hai cách tiếp cận này xử lý các khía cạnh cốt lõi như token lifecycle, error propagation, và integration với external providers, với ví dụ minh họa đơn giản – code dễ copy-paste!

## OAuth2 vs JWT: Cơ chế hoạt động và sự khác biệt

OAuth2 là một framework authorization mở (RFC 6749), không phải authentication protocol, tập trung vào delegation access (grant types: authorization code, client credentials, implicit). Trong Spring Security, OAuth2 resource server validate token từ issuer (Introspection endpoint hoặc JWT decoder), hỗ trợ scopes/roles cho fine-grained access. Ưu điểm: Federated identity (delegate to Google/Auth0), secure delegation (refresh token rotation chống replay attacks), nhưng phức tạp với multiple flows và state management.

JWT (RFC 7519) là compact token self-contained (header.payload.signature), encode claims (user info, expiry, issuer) trong Base64, sign bằng HMAC/RS256 để verify integrity. Trong Express.js, middleware như jsonwebtoken sign/verify token, stateless (no server state), phù hợp microservices. Ưu điểm: Lightweight, no DB lookup, nhưng nhược điểm: Token size lớn (overhead), revocation khó (blacklist hoặc short expiry).

Cả hai chống CSRF qua token binding, XSS qua input sanitization; OAuth2 mạnh về delegation (third-party access), JWT về statelessness (scale horizontal dễ).

## Ví dụ cơ bản: Secure User API

Xây dựng API users với login/register, role-based access (admin tạo user, user xem profile). Dùng H2 in-memory (Java) và array in-memory (Node) cho đơn giản, BCrypt cho password hash. Tập trung vào flow: AuthN (verify identity) → AuthZ (check permission).

### Java: Spring Security với OAuth2/JWT

Spring Security dùng filter chain (SecurityFilterChain) để intercept requests, auto-config OAuth2 cho resource server. Token validation qua JwtDecoder, role mapping từ claims.

#### pom.xml
{{< highlight xml >}}
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
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
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-oauth2-resource-server</artifactId>
    </dependency>
</dependencies>
{{< /highlight >}}

#### User.java (Entity)
Spring Security UserDetails interface cho authN, GrantedAuthority cho role mapping. Password hashed với BCrypt (salt automatic).

{{< highlight java >}}
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password; // Hashed with BCrypt
    private String email;
    private String role; // "USER" or "ADMIN"

    public User() {}
    public User(String username, String password, String email, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }
    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
{{< /highlight >}}

#### SecurityConfig.java
Filter chain intercept requests, session stateless cho API, OAuth2 resource server validate JWT từ issuer. Role-based access qua .hasRole().

{{< highlight java >}}
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                .requestMatchers("/api/users/admin").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())));
        return http.build();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri("http://localhost:8080/.well-known/jwks.json").build();
    }
}
{{< /highlight >}}

#### AuthController.java
AuthenticationManager verify credentials, JWT sign claims (subject, issuedAt, expiration) với HS512 algorithm, secure against tampering.

{{< highlight java >}}
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;

    private final String SECRET_KEY = "your-secret-key";
    private final long EXPIRATION_TIME = 86400000; // 24 hours

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        User user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()), request.getEmail(), "USER");
        userRepository.save(user);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String token = Jwts.builder()
            .setSubject(request.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
            .compact();
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", authentication.getAuthorities().iterator().next().getAuthority());
        return ResponseEntity.ok(response);
    }
}

class RegisterRequest {
    private String username;
    private String password;
    private String email;
    // Getters/Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

class LoginRequest {
    private String username;
    private String password;
    // Getters/Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
{{< /highlight >}}

#### UserController.java (Secure)
Authentication từ SecurityContextHolder, hasRole() check authority prefix "ROLE_".

{{< highlight java >}}
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/admin")
    public ResponseEntity<User> createUser(@RequestBody User user, Authentication authentication) {
        if (!authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        user.setRole("USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }
}
{{< /highlight >}}

Chạy: `mvn spring-boot:run`. Test: Register POST /api/auth/register { "username": "alice", "password": "pass", "email": "alice@email.com" }, Login POST /api/auth/login { "username": "alice", "password": "pass" } (lấy token), GET /api/users Authorization: Bearer <token>, POST /api/users/admin Authorization: Bearer <admin_token> { "username": "bob", "password": "pass", "email": "bob@email.com" }.

### Node.js: Express.js với JWT

Express middleware pattern cho flexible auth, jsonwebtoken sign/verify token stateless.

#### package.json
{{< highlight json >}}
{
  "dependencies": {
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5"
  },
  "scripts": {
    "start": "node server.js"
  }
}
{{< /highlight >}}

#### server.js
Middleware authenticateToken verify signature, check expiry/claims. BCrypt hash salt automatic, chống rainbow table attacks.

{{< highlight javascript >}}
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const users = []; // In-memory
const SECRET_KEY = 'your-secret-key';
const EXPIRATION_TIME = '24h';

app.post('/api/auth/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), username, password: hashedPassword, email, role: 'USER' };
    users.push(user);
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
        res.json({ token, role: user.role });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/api/users', authenticateToken, (req, res) => {
    res.json(users.map(u => ({ id: u.id, username: u.username, email: u.email })));
});

app.post('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), username, password: hashedPassword, email, role: 'USER' };
    users.push(user);
    res.status(201).json(user);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
{{< /highlight >}}

Chạy: `npm install && node server.js`. Test: Register POST /api/auth/register { "username": "alice", "password": "pass", "email": "alice@email.com" }, Login POST /api/auth/login { "username": "alice", "password": "pass" } (lấy token), GET /api/users Authorization: Bearer <token>, POST /api/users Authorization: Bearer <admin_token> { "username": "bob", "password": "pass", "email": "bob@email.com" }.

**So sánh**: Spring Security config-heavy nhưng robust (filter chain, CSRF protection), Express middleware simple nhưng manual (cần handle CORS, rate limit).

## Best Practices: Salt Hashing, Token Expiry, và Rate Limiting

Salt hashing với BCrypt thêm random salt per password, chống rainbow table và dictionary attacks – BCrypt adaptive (cost factor tăng theo hardware). Token expiry (24h access, 7d refresh) giảm exposure nếu token leak, refresh rotation invalidate old token để chống replay. Rate limiting chống DDoS/brute-force, token bucket algorithm cho burst tolerance.

Ví dụ rate limiting Express.js:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

Spring Boot rate limiting:
```java
@Bean
public RateLimiterRegistry rateLimiterRegistry() {
    return RateLimiterRegistry.of(RateLimiter.fixed().rate(100).build());
}
```

Spring built-in, Express external middleware.

## Troubleshooting: Common Security Issues

CSRF (Cross-Site Request Forgery) khai thác session cookie, Spring auto-protect với CSRF token, Express cần csurf middleware generate/validate token. XSS (Cross-Site Scripting) inject script, Spring escape HTML in Thymeleaf, Express sanitize input với express-validator. SQL Injection parameterized queries tránh, JPA auto, Express dùng prepared statements (mysql2).

Token leak: HTTPS enforce, short expiry, HttpOnly/Secure cookies cho refresh token (không JS access). Ví dụ secure cookie Express.js:
```javascript
res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

Secure header Spring:
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.headers(headers -> headers
        .frameOptions().sameOrigin()
        .httpStrictTransportSecurity(hsts -> hsts.maxAgeInSeconds(31536000))
        .contentSecurityPolicy("script-src 'self'"));
    // ... rest
}
```

Spring comprehensive (auto headers, CSRF), Express flexible manual config.

## Ưu nhược điểm tổng hợp

| Tiêu chí          | OAuth2 (Spring Security)     | JWT (Express.js)             |
|-------------------|-------------------------------|------------------------------|
| **Setup**        | Config-heavy, robust         | Middleware simple, quick     |
| **Federation**   | Native (Google, Auth0)       | Manual integration           |
| **State**        | Stateless (JWT), stateful session | Stateless                   |
| **Performance**  | Filter chain overhead        | Lightweight middleware       |
| **Security**     | Built-in CSRF, XSS protection | Manual (bcrypt, rate-limit)  |
| **Use Case**     | Enterprise, social login     | Microservices, SPA           |

OAuth2 cho enterprise, JWT cho modern web apps.

## Kết luận: Chọn cái nào cho full-stack?

OAuth2 với Spring Security cho robust enterprise, JWT với Express.js cho lightweight APIs. Best practices: Hash password, short token, rate limit, HTTPS. Thử implement login API với JWT – bạn sẽ thấy security mượt mà!

Bạn đã implement auth chưa? Comment chia sẻ nhé. Bài sau: Monitoring với Prometheus vs Grafana. Theo dõi để secure pro hơn!

Happy securing! 🔒🛡️

<!--more-->