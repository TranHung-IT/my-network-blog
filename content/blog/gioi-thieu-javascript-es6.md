+++
author = "Trần Việt Hưng"
title = "Giới thiệu JavaScript ES6: Arrow Functions và Destructuring – Những tính năng 'thần thánh' cho lập trình viên"
date = "2025-09-10"
description = "Bài viết chia sẻ cơ bản về hai tính năng nổi bật trong ES6: Arrow Functions và Destructuring. Giúp code JavaScript ngắn gọn và dễ đọc hơn!"
tags = [
    "javascript",
    "es6",
    "arrow-function",
    "destructuring",
]
categories = [
    "javascript",
    "programming",
]
+++

Chào các bạn! Mình là Trần Việt Hưng, một lập trình viên đam mê Java và JavaScript. Trong series blog này, mình sẽ chia sẻ những kiến thức thực tế về lập trình, từ cơ bản đến nâng cao, để giúp các bạn – đặc biệt là những người mới bắt đầu – có thể áp dụng ngay vào dự án. Hôm nay, mình muốn nói về **JavaScript ES6** (ECMAScript 2015), một bản cập nhật lớn đã thay đổi cách chúng ta viết code JS. Cụ thể, mình sẽ tập trung vào hai "vũ khí bí mật": **Arrow Functions** và **Destructuring**. Chúng giúp code ngắn hơn, sạch hơn, và tránh được những lỗi phổ biến.

Nếu bạn đang dùng Node.js, React, hay bất kỳ framework JS nào, ES6 là "must-know". Hãy cùng mình khám phá cách chúng hoạt động bên dưới và lợi ích thực tế nhé!

## Arrow Functions: Hàm ngắn gọn, không lo 'this'

Trước ES6, hàm được định nghĩa bằng `function()`, nhưng ngữ cảnh `this` là một trong những nguồn lỗi phổ biến nhất. `this` trong function thường trỏ đến object gọi hàm (hoặc undefined trong strict mode), dẫn đến binding phức tạp khi dùng callback hoặc event handler. Arrow Functions giải quyết bằng cách **lexical scoping** – `this` được bind với ngữ cảnh cha (enclosing scope), không tạo scope mới, và syntax ngắn gọn với `=>`.

Điều này làm Arrow Functions lý tưởng cho callbacks ngắn, như trong array methods hoặc promises, vì giữ nguyên `this` từ outer function. Tuy nhiên, chúng không có `arguments` object riêng, không dùng làm constructor (không `new`), và không hoisting (phải declare trước dùng). Implicit return cho phép hàm một dòng bỏ `{}` và `return`, làm code concise hơn 50% so với function truyền thống.

Ví dụ cú pháp:
```javascript
// Trước ES6
function greet(name) {
  return "Xin chào, " + name + "!";
}

// Sau ES6: Arrow Function
const greet = (name) => {
  return "Xin chào, " + name + "!";
};

// Ngắn hơn nữa nếu chỉ một dòng
const greetShort = (name) => "Xin chào, " + name + "!";

// Không tham số
const sayHi = () => "Chào bạn!";
```

Ví dụ thực tế với array.map():
```javascript
const numbers = [1, 2, 3, 4];

// Trước
const doubled = numbers.map(function(num) {
  return num * 2;
});

// Sau: Arrow + implicit return
const doubled = numbers.map(num => num * 2);

console.log(doubled); // [2, 4, 6, 8]
```

Bằng cách giữ lexical `this`, Arrow Functions tránh bug phổ biến trong OOP (như trong class methods hoặc event listeners), làm code predictable hơn, đặc biệt trong framework như React nơi `this` dễ mất.

## Destructuring: "Phá hủy" object/array để lấy giá trị nhanh

Destructuring là tính năng ES6 cho phép trích xuất giá trị từ object/array vào biến riêng lẻ, dựa trên pattern matching – so sánh structure bên trái với bên phải. Với object, dùng key names (hoặc rename với :), với array dùng position. Hỗ trợ defaults (nếu undefined), rest operator (`...` cho phần còn lại), và nested destructuring.

Điều này giảm boilerplate code (thay vì `user.name`, `user.age` lặp lại), tăng readability, và dễ refactor khi API change. Trong functional programming, destructuring khuyến khích immutable data (không mutate origin), và kết hợp với spread (`...`) cho shallow copy/merge.

Ví dụ object:
```javascript
const user = {
  name: "Trần Việt Hưng",
  age: 28,
  city: "Hà Nội"
};

// Trước: Phải dùng dot notation
const name = user.name;
const age = user.age;

// Sau: Destructuring
const { name, age, city } = user;
console.log(name, age, city); // Trần Hưng 21 Lâm Đồng

// Đổi tên biến
const { name: userName, age: userAge } = user;
console.log(userName); // Trần Hưng
```

Ví dụ array:
```javascript
const colors = ["đỏ", "xanh", "vàng"];

// Lấy phần tử đầu tiên và phần còn lại
const [first, ...rest] = colors;
console.log(first); // đỏ
console.log(rest); // ["xanh", "vàng"]

// Với function params
function printColor([first, second]) {
  console.log(`Màu 1: ${first}, Màu 2: ${second}`);
}
printColor(colors); // Màu 1: đỏ, Màu 2: xanh
```

Kết hợp với Arrow Function:
```javascript
const users = [
  { name: "Alice", score: 95 },
  { name: "Bob", score: 80 }
];

const highScorers = users
  .filter(({ score }) => score > 85)  // Destructuring trong param
  .map(({ name }) => name);           // Lấy name trực tiếp

console.log(highScorers); // ["Alice"]
```

Destructuring làm code declarative hơn, giảm nesting, và dễ integrate với ES6 modules (import {x} from 'module').

## Kết luận: Tại sao nên dùng ngay?

Arrow Functions và Destructuring làm code JS của bạn **ngắn gọn 30-50%**, dễ đọc hơn, và giảm lỗi `this`. Nếu bạn đang học JavaScript để chuyển sang full-stack (kết hợp với Java backend), đây là bước đầu tiên. Hãy thử viết một hàm nhỏ với hai tính năng này và chạy trên console browser nhé!

Bạn đã dùng ES6 chưa? Chia sẻ kinh nghiệm ở phần comment bên dưới (nếu blog hỗ trợ). Bài sau mình sẽ nói về **Async/Await** so với Promises. Theo dõi mình để không bỏ lỡ!

Cảm ơn bạn đã đọc. Happy coding! 🚀

<!--more-->