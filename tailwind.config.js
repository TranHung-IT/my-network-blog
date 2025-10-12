const theme = require("tailwindcss/defaultTheme");

module.exports = {
  important: true,
  content: [
    "content/**/*.md",
    "layouts/**/*.html",
    "./themes/**/layouts/**/*.html",
    "./content/**/layouts/**/*.html",
    "./layouts/**/*.html",
    "./content/**/*.html",
  ],
  safelist: ['pagination', 'page-item'],
  darkMode: "class", // 'media' or 'class'
  theme: {
    extend: {
      colors: {
        skillLight: '#272343',
        skillDark: '#739EC9',
      },
      backgroundColor: (theme) => ({
        darkest: theme(`colors.stone.900`),
        darker: theme(`colors.stone.800`),
        dark: theme(`colors.stone.700`),
      }),
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "code::before": false,
            "code::after": false,
            a: {
              color: "#123458",                // Light mode: #123458 như yêu cầu
              textDecoration: "underline",       // Underline mặc định
              textDecorationThickness: "1px",    // decoration-1
              textUnderlineOffset: "0.2em",      // underline-offset-2
              fontWeight: "600",                 // font-semibold
              letterSpacing: ".025em",           // tracking-wide
              "&:hover": {
                color: "#1A3B5E",                // Hover light: biến thể sáng hơn
                textDecoration: "underline",
              },
            },
            pre: {
              backgroundColor: "#f8f8f8",       // Light: Off-white như Quiet Light (gần trắng nhưng thoáng)
              color: "#000000",                 // Đen thuần cho text
              border: "1px solid #d4d4d4",      // Viền xám nhạt (như VS Code editor border)
              borderRadius: "0.5rem",           // Bo góc nhẹ
              padding: "1.25rem",               // Padding rộng như VS Code
              overflowX: "auto",
              fontFamily: "Monaco, 'Courier New', monospace",  // Font code chuẩn VS Code
              fontSize: "0.875rem",             // 14px nhỏ gọn
              lineHeight: "1.5",
            },
            code: { 
              color: "#000000",                 // Đen cho inline light
              backgroundColor: "#f1f1f1",       // Nền xám nhạt cho inline
              padding: "0.125rem 0.25rem",
              borderRadius: "0.25rem",
              fontFamily: "Monaco, 'Courier New', monospace",
            },
          },
        },
        invert: {
          css: {
            color: theme(`colors.gray.200`),
            a: {
              color: "#739EC9",
              textDecoration: "underline",
              textDecorationThickness: "1px",
              textUnderlineOffset: "0.2em",
              fontWeight: "600",
              letterSpacing: ".025em",
              "&:hover": { 
                color: "#5A94C9"
              },
            },
            h1: { color: theme(`colors.gray.200`) },
            h2: { color: theme(`colors.gray.200`) },
            h3: { color: theme(`colors.gray.200`) },
            h4: { color: theme(`colors.gray.200`) },
            h5: { color: theme(`colors.gray.200`) },
            h6: { color: theme(`colors.gray.200`) },
            strong: { color: theme(`colors.gray.200`) },
            td: { color: theme(`colors.gray.200`) },
            blockquote: { color: theme(`colors.gray.200`) },
            pre: {
              backgroundColor: "#1e1e1e",       // Dark: Xám đen như Dark+ theme
              color: "#d4d4d4",                 // Xám trắng cho text
              border: "1px solid #454545",      // Viền xám tối
              borderRadius: "0.5rem",
              padding: "1.25rem",
              overflowX: "auto",
              fontFamily: "Monaco, 'Courier New', monospace",
              fontSize: "0.875rem",
              lineHeight: "1.5",
            },
            code: { 
              color: "#d4d4d4",                 // Xám trắng cho inline dark
              backgroundColor: "#2d2d30",       // Nền xám tối cho inline
              padding: "0.125rem 0.25rem",
              borderRadius: "0.25rem",
              fontFamily: "Monaco, 'Courier New', monospace",
            },
          },
        },
      }),
    },
  },
  variants: { typography: ["invert"], extend: {} },
  plugins: [require("@tailwindcss/typography")],
};