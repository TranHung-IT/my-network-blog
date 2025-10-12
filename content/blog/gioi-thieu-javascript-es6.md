+++
author = "Trần Việt Hưng"
title = "Giới thiệu JavaScript ES6: Arrow Functions và Destructuring – Những tính năng 'thần thánh' cho lập trình viên"
date = "2025-10-09"
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

Nếu bạn đang dùng Node.js, React, hay bất kỳ framework JS nào, ES6 là "must-know". Hãy cùng mình khám phá nhé!

## Arrow Functions: Hàm ngắn gọn, không lo 'this'

Trước ES6, để viết một hàm đơn giản, chúng ta thường dùng `function()`. Nhưng vấn đề lớn là ngữ cảnh `this` – nó dễ bị thay đổi, dẫn đến bug khó debug. Arrow Functions giải quyết bằng cách **gắn `this` với ngữ cảnh cha**, và syntax siêu ngắn.

### Cú pháp cơ bản
Arrow Function dùng dấu `=>` thay vì `function`. Ví dụ:

{{< highlight javascript >}}
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
{{< /highlight >}}

### Ví dụ thực tế: Với array.map()
Giả sử bạn có mảng số, muốn nhân đôi từng phần tử:

{{< highlight javascript >}}
const numbers = [1, 2, 3, 4];

// Trước
const doubled = numbers.map(function(num) {
  return num * 2;
});

// Sau: Arrow + implicit return
const doubled = numbers.map(num => num * 2);

console.log(doubled); // [2, 4, 6, 8]
{{< /highlight >}}

Lưu ý: Arrow Function không có `arguments` object riêng, và không dùng làm constructor (không `new`). Hoàn hảo cho callbacks trong event handlers hoặc promises!

## Destructuring: "Phá hủy" object/array để lấy giá trị nhanh

Destructuring cho phép "giải nén" object hoặc array trực tiếp vào biến, thay vì viết code dài dòng. Rất hữu ích khi làm việc với API responses hoặc props trong React.

### Destructuring object
Giả sử bạn có object user:

{{< highlight javascript >}}
const user = {
  name: "Trần VIệt Hưng",
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
{{< /highlight >}}

### Destructuring array
Với mảng:

{{< highlight javascript >}}
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
{{< /highlight >}}

### Kết hợp với Arrow Function
Siêu đỉnh khi dùng chung:

{{< highlight javascript >}}
const users = [
  { name: "Alice", score: 95 },
  { name: "Bob", score: 80 }
];

const highScorers = users
  .filter(({ score }) => score > 85)  // Destructuring trong param
  .map(({ name }) => name);           // Lấy name trực tiếp

console.log(highScorers); // ["Alice"]
{{< /highlight >}}

## Kết luận: Tại sao nên dùng ngay?

Arrow Functions và Destructuring làm code JS của bạn **ngắn gọn 30-50%**, dễ đọc hơn, và giảm lỗi `this`. Nếu bạn đang học JavaScript để chuyển sang full-stack (kết hợp với Java backend), đây là bước đầu tiên. Hãy thử viết một hàm nhỏ với hai tính năng này và chạy trên console browser nhé!

Bạn đã dùng ES6 chưa? Chia sẻ kinh nghiệm ở phần comment bên dưới (nếu blog hỗ trợ). Bài sau mình sẽ nói về **Async/Await** so với Promises. Theo dõi mình để không bỏ lỡ!

Cảm ơn bạn đã đọc. Happy coding! 🚀

<!--more-->