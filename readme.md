# RTC Intro

这是《RTC 实时通信核心技术》的交互式课程工程，包含 51 页网页 slides、WebRTC 教学 Lab，以及 80 题自测 Quiz。

## 前置条件

- 安装 Node.js，建议使用 Node.js 22。
- 准备一个 vibe coding 工具，例如 Codex、Cursor、Claude Code 或类似 AI 编程环境，便于阅读代码、修改课件和继续扩展实验。
- 使用 Chrome 或 Edge 运行 WebRTC Lab，便于查看 `chrome://webrtc-internals/`。

## 安装

```bash
npm install
```

## 运行课程客户端

```bash
npm run dev
```

默认打开 Vite 输出的本地地址，例如：

```text
http://localhost:5173/
```

常用入口：

- Slides：`#/slide/1`
- Lab：`#/lab`
- Quiz：`#/quiz`

也可以直接访问公网前端：

```text
https://xiaojiongqian.github.io/rtc_intro
```

## 运行 WebRTC Lab

Lab 需要客户端和 WebRTC 房间信令服务同时运行。本地最简单方式：

```bash
npm run dev:lab
```

这会同时启动：

- Vite 客户端
- Node WebSocket 信令服务，默认 `ws://localhost:8787`

如果只想单独启动信令服务：

```bash
npm run signal
```

公网 GitHub Pages 只能托管静态前端，不能运行 WebSocket 服务。因此访问 `https://xiaojiongqian.github.io/rtc_intro/#/lab` 时，如果要真正入房通话，需要另外启动或部署信令服务，并在 Lab 顶部填写对应的 `ws://` 或 `wss://` 地址。

## 查看 WebRTC 统计

Lab 跑起来并加入房间后，可以在 Chrome 地址栏打开：

```text
chrome://webrtc-internals/
```

这里可以查看浏览器原始 WebRTC 统计信息，例如 candidate pair、RTT、码率、丢包、jitter buffer、NACK/PLI/FIR 等。Lab 的 Stats 面板也提供了这个地址的复制按钮。

## 使用 Quiz 自测

进入：

```text
#/quiz
```

Quiz 共 80 题，满分 100 分：

- 70 道单选题，每题 1 分
- 10 道填空题，每题 3 分

提交后会自动批改，展示总分、分项得分、章节得分、错题答案和解释。填空题会直接显示参考答案与原理解析，适合复盘知识点。

## 构建

```bash
npm run build
```

本地预览生产构建：

```bash
npm run preview
```

## 相关文档

- `doc/web-slides-plan.md`：51 页课程 slides 策划与交互说明
- `doc/webrtc-teaching-lab-design.md`：WebRTC Lab 设计与实现说明
- `doc/github-pages-deployment.md`：GitHub Pages 和公网信令服务部署说明
- `doc/deep-research-report.md`：RTC 技术报告与课堂素材包
