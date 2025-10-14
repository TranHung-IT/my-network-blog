+++
author = "Trần Việt Hưng"
title = "Serverless Architecture với AWS Lambda: Java vs Node.js cho Full-Stack Dev"
date = "2025-10-04"
description = "Tiếp nối series Java & JavaScript, bài viết khám phá Serverless với AWS Lambda. So sánh triển khai Java (Spring Cloud Function) và Node.js (Serverless Framework), từ setup, deployment đến scaling và troubleshooting!"
tags = [
    "java",
    "nodejs",
    "serverless",
    "aws-lambda",
    "spring-cloud-function",
    "serverless-framework",
    "deployment",
    "scaling",
    "devops",
]
categories = [
    "java",
    "javascript",
    "devops",
    "serverless",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, tiếp tục series về Java và JavaScript trên blog cá nhân. Sau bài về Docker vs Kubernetes, hôm nay mình sẽ đi sâu vào **Serverless Architecture** với **AWS Lambda** – một mô hình cloud-native nơi bạn chỉ trả tiền cho thời gian chạy code thực tế, không lo quản lý server hay infrastructure. Mình sẽ so sánh triển khai Serverless với **Java** (Spring Cloud Function) và **Node.js** (Serverless Framework), từ cách setup môi trường, viết handler functions, deployment qua API Gateway, đến scaling tự động, troubleshooting cold start, và phân tích chi phí/performance sâu hơn.

Nếu bạn là full-stack dev (Java backend + JS frontend), Serverless là một bước tiến lớn để build API scalable, cost-effective, đặc biệt cho microservices hoặc event-driven apps nơi traffic biến động cao. Chúng ta sẽ khám phá cách mô hình này thay đổi cách nghĩ về deployment, với ví dụ minh họa đơn giản về một API users (GET/POST) tích hợp DynamoDB – code dễ copy-paste, hướng dẫn từ zero to hero!

## Serverless Architecture: Ôn nhanh và lý do quan trọng

Serverless, hay FaaS (Function as a Service), là mô hình nơi developer viết functions chạy theo event triggers (HTTP request, S3 upload, Kinesis stream), provider (AWS Lambda) xử lý scaling, availability, và billing dựa trên execution time (100ms units). Không có server để manage, nhưng vẫn có "serverless illusion" – infrastructure ẩn sau abstraction layer.

Java (Spring Cloud Function) tận dụng Spring ecosystem cho enterprise integration, nhưng JVM startup làm cold start chậm (2-5s, do class loading), memory allocation dynamic. Node.js nhanh cold start (<100ms, V8 engine lightweight), memory fixed (128MB-10GB), phù hợp I/O-bound tasks. Lý do quan trọng: Giảm ops overhead 90% (no patching, scaling manual), auto-scale to millions requests/second, pay-per-use tiết kiệm 70% cost so VPS (chỉ charge invocation + duration). Khai thác: Setup AWS IAM roles cho least privilege, API Gateway cho routing/throttling, DynamoDB cho serverless DB, CloudWatch cho monitoring, VPC cho network isolation, hybrid với EKS cho legacy containers.

Serverless phù hợp API, webhooks, ETL pipelines, nhưng không cho long-running tasks (15min limit) hoặc stateful apps. So với Docker/K8s (self-managed infra), Serverless zero-ops nhưng vendor lock-in (AWS-specific features).

## Ví dụ cơ bản: Serverless API Users với AWS Lambda

Xây dựng Lambda handler trả danh sách users (từ DynamoDB) và thêm user mới, deploy qua API Gateway. Cần AWS account, CLI (`aws configure`), và DynamoDB table "Users" (Partition Key: id). Flow: Event → Handler → DynamoDB → Response, với error handling và logging.

### Java: Spring Cloud Function với AWS SAM

Spring Cloud Function abstract function as POJO, SAM (Serverless Application Model) deploy Lambda với CloudFormation. Handler extend SpringBootRequestHandler, process APIGatewayProxyRequestEvent.

#### pom.xml
{{< highlight xml >}}
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-function-adapter-aws</artifactId>
    </dependency>
    <dependency>
        <groupId>com.amazonaws</groupId>
        <artifactId>aws-lambda-java-events</artifactId>
    </dependency>
    <dependency>
        <groupId>com.amazonaws</groupId>
        <artifactId>aws-java-sdk-dynamodb</artifactId>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
</dependencies>
<version>3.2.0</version>
{{< /highlight >}}

#### User.java
POJO với @JsonProperty cho serialization, hỗ trợ DynamoDB attribute mapping.

{{< highlight java >}}
import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
    @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("email")
    private String email;

    public User() {}
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    // Getters/Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
{{< /highlight >}}

#### UserHandler.java (Spring Cloud Function)
Handler process event, use DynamoDB scan/put, error handling với try-catch, response with headers CORS.

{{< highlight java >}}
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cloud.function.adapter.aws.SpringBootRequestHandler;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class UserHandler extends SpringBootRequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {}

@org.springframework.stereotype.Component
public class UserFunction implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private final AmazonDynamoDB dynamoDB = AmazonDynamoDBClientBuilder.standard().build();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String TABLE_NAME = "Users";

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");

        try {
            String httpMethod = input.getHttpMethod();
            if ("GET".equals(httpMethod)) {
                return getAllUsers(headers);
            } else if ("POST".equals(httpMethod)) {
                return createUser(input, headers);
            }
            return createErrorResponse("Method not allowed", 405, headers);
        } catch (Exception e) {
            return createErrorResponse(e.getMessage(), 500, headers);
        }
    }

    private APIGatewayProxyResponseEvent getAllUsers(Map<String, String> headers) {
        ScanRequest scanRequest = new ScanRequest().withTableName(TABLE_NAME);
        ScanResult result = dynamoDB.scan(scanRequest);
        List<User> users = result.getItems().stream()
                .map(this::itemToUser)
                .collect(Collectors.toList());
        return createSuccessResponse(users, headers);
    }

    private APIGatewayProxyResponseEvent createUser(APIGatewayProxyRequestEvent input, Map<String, String> headers) {
        User user = objectMapper.readValue(input.getBody(), User.class);
        PutItemRequest putRequest = new PutItemRequest()
                .withTableName(TABLE_NAME)
                .withItem(userToItem(user));
        dynamoDB.putItem(putRequest);
        return createSuccessResponse(user, headers);
    }

    private User itemToUser(Map<String, AttributeValue> item) {
        return new User(item.get("id").getS(), item.get("name").getS(), item.get("email").getS());
    }

    private Map<String, AttributeValue> userToItem(User user) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("id", new AttributeValue().withS(user.getId()));
        item.put("name", new AttributeValue().withS(user.getName()));
        item.put("email", new AttributeValue().withS(user.getEmail()));
        return item;
    }

    private APIGatewayProxyResponseEvent createSuccessResponse(Object body, Map<String, String> headers) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(200);
        response.setHeaders(headers);
        response.setBody(objectMapper.writeValueAsString(body));
        return response;
    }

    private APIGatewayProxyResponseEvent createErrorResponse(String message, int statusCode, Map<String, String> headers) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(statusCode);
        response.setHeaders(headers);
        Map<String, Object> error = new HashMap<>();
        error.put("error", message);
        response.setBody(objectMapper.writeValueAsString(error));
        return response;
    }
}
{{< /highlight >}}

#### template.yaml (AWS SAM)
SAM dùng CloudFormation để provision resources, integrate Lambda với API Gateway/DynamoDB, auto IAM roles.

{{< highlight yaml >}}
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Resources:
  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: Users
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      BillingMode: PAY_PER_REQUEST

  UserFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: target/
      Handler: com.example.UserHandler::handleRequest
      Runtime: java17
      Events:
        GetUsers:
          Type: Api
          Properties:
            Path: /users
            Method: get
        CreateUser:
          Type: Api
          Properties:
            Path: /users
            Method: post
      Environment:
        Variables:
          TABLE_NAME: !Ref UsersTable
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
Outputs:
  ApiURL:
    Description: "API endpoint URL"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"
{{< /highlight >}}

Deploy: `sam build && sam deploy --guided`. Test: `curl <API_URL>/users`.

### Node.js: Serverless Framework với AWS Lambda

Serverless Framework dùng YAML config, sls CLI deploy, hỗ trợ multi-provider (AWS, Azure). Handler export functions, AWS SDK cho DynamoDB.

#### package.json
{{< highlight json >}}
{
  "dependencies": {
    "aws-sdk": "^2.1400.0"
  },
  "devDependencies": {
    "serverless": "^3.30.0"
  }
}
{{< /highlight >}}

#### handler.js
Handler async, DynamoDB scan/put non-blocking, error handling với try-catch, response CORS headers.

{{< highlight javascript >}}
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

module.exports.getUsers = async (event) => {
    const params = {
        TableName: TABLE_NAME
    };
    const result = await dynamoDB.scan(params).promise();
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result.Items)
    };
    return response;
};

module.exports.createUser = async (event) => {
    const user = JSON.parse(event.body);
    const params = {
        TableName: TABLE_NAME,
        Item: user
    };
    await dynamoDB.put(params).promise();
    const response = {
        statusCode: 201,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(user)
    };
    return response;
};
{{< /highlight >}}

#### serverless.yml
Provider IAM least privilege, functions event-driven qua HTTP API, resources provision DynamoDB table on-deploy.

{{< highlight yaml >}}
service: user-service
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Scan
        - dynamodb:PutItem
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/Users"

functions:
  getUsers:
    handler: handler.getUsers
    events:
      - httpApi:
          path: /users
          method: get
  createUser:
    handler: handler.createUser
    events:
      - httpApi:
          path: /users
          method: post

resources:
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: Users
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
{{< /highlight >}}

Deploy: `sls deploy`. Test: `curl <API_URL>/users`.

**So sánh**: SAM (Java) tích hợp Spring ecosystem cho complex logic, Serverless Framework (Node.js) nhanh setup với YAML declarative, dễ multi-cloud.

## Troubleshooting: Cold Start và Scaling

Cold Start xảy ra khi Lambda scale từ 0, JVM (Java) load classes/bootstrap chậm (2-5s), V8 (Node.js) nhanh (<100ms). Nguyên nhân: Initialization phase (global vars, connections). Fix: Provisioned Concurrency (pre-warm instances, cost +0.5$/GB/s), optimize handler (lazy init, keep-alive connections), hoặc Fargate (container-based, no cold start).

Scaling: Lambda concurrent executions auto-scale (1000 default, burst 5000), throttled nếu exceed (retry exponential backoff). Monitor CloudWatch metrics (Duration, Errors, Throttles, ConcurrentExecutions).

Ví dụ CloudWatch Logs Java:
```java
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class UserHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {
    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
        context.getLogger().log("Processing request: " + input);
        // ... logic
        return output;
    }
}
```

Node.js:
```javascript
module.exports.getUsers = async (event) => {
    console.log('Processing request:', JSON.stringify(event, null, 2));
    // ... logic
    return response;
};
```

Troubleshooting: Set timeout 15s (default 3s), memory 128MB-10GB (tăng memory = tăng CPU proportionally), dead letter queues cho failed invocations.

## Chi phí và Monitoring

Chi phí Lambda: $0.20/1M requests + $0.00001667/GB-second duration. Ví dụ: 1M requests, 100ms each, 128MB = ~$0.20 free tier. DynamoDB $0.25/1M reads, $1.25/1M writes, provisioned capacity cho predictable load.

Monitoring: CloudWatch Logs (structured JSON), Metrics (Duration histogram, Invocations), X-Ray tracing (end-to-end latency, service map). Java: Actuator endpoints expose /actuator/prometheus, Node.js middleware log request ID.

Ví dụ X-Ray Java:
```xml
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-xray-recorder-sdk-spring</artifactId>
</dependency>
```

Node.js:
```javascript
const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
```

**So sánh**: Chi phí Node.js thấp hơn (cold start nhanh, memory thấp), Java ổn định hơn với high load (JVM optimize long-running).

## Ưu nhược điểm tổng hợp

| Tiêu chí          | Java (Spring Cloud Function) | Node.js (Serverless Framework) |
|-------------------|-------------------------------|-------------------------------|
| **Cold Start**   | Chậm (JVM init 2-5s)         | Nhanh (<100ms)                |
| **Setup**        | SAM CLI, Spring config        | sls CLI, YAML đơn giản        |
| **Integration**  | Spring ecosystem, DynamoDB   | Native AWS SDK, easy async    |
| **Performance**  | Tốt cho complex logic        | Tốt cho I/O, lightweight      |
| **Cost**         | Cao hơn do memory            | Thấp hơn, pay-per-use         |
| **Use Case**     | Enterprise, heavy processing | API, webhooks, event-driven   |

Java cho business logic phức tạp, Node.js cho quick APIs.

## Kết luận: Chọn cái nào cho full-stack?

Serverless với AWS Lambda cách mạng hóa deployment bằng zero-server management, auto-scaling, và pay-per-use billing, làm dev focus business logic thay vì infra. Java phù hợp enterprise integration, Node.js cho rapid prototyping. Thử deploy API users lên Lambda – bạn sẽ thấy cost giảm và scale tự động, dù cold start là trade-off cần cân nhắc.

Bạn đã dùng Serverless chưa? Comment chia sẻ nhé. Bài sau: Security Best Practices (OAuth2 Java vs JWT Node.js). Theo dõi để full-stack pro hơn!

Happy serverless! ☁️🚀

<!--more-->