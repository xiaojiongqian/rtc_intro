# GitHub Pages 公网部署说明

## 结论

当前工程可以通过 GitHub Pages 部署到公网，但 GitHub Pages 只能承载静态前端，不能运行 WebSocket 信令服务。

部署后可访问：

- 课程页面：`https://xiaojiongqian.github.io/rtc_intro/`
- WebRTC 实验台：`https://xiaojiongqian.github.io/rtc_intro/#/lab`

实验台的音视频媒体仍然是浏览器之间的 P2P WebRTC 连接；信令服务只负责转发 SDP 和 ICE。

## 已加入的部署配置

仓库已增加 `.github/workflows/deploy-pages.yml`。

该 workflow 在 `main` 分支 push 后自动执行：

1. 安装 Node.js 22。
2. 使用 `npm ci` 安装依赖。
3. 使用 GitHub Pages 子路径构建 Vite 静态资源。
4. 上传 `dist/` 并发布到 GitHub Pages。

也可以在 GitHub Actions 页面手动运行 `Deploy GitHub Pages`。

## 信令服务要求

公网实验时，浏览器页面是 HTTPS，因此信令地址必须使用 `wss://`，不能使用 `ws://`，否则会被浏览器当作 mixed content 拦截。

当前仓库里的本地信令服务入口是：

```bash
node server/signaling.mjs
```

它可以部署到 Render、Fly.io、Railway、VPS、Kubernetes 等能长期运行 Node WebSocket 服务的平台。仅依赖 GitHub 无法完成这一步：GitHub Pages 不运行 Node 服务，GitHub Actions 也不是常驻进程。

公网信令服务需要暴露为类似：

```text
wss://your-signaling.example.com
```

部署完成后有两种填写方式：

1. 在实验台顶部“信令服务器”输入框里手动填写 `wss://...`。
2. 在 GitHub 仓库 Settings -> Secrets and variables -> Actions -> Variables 中新增 `VITE_SIGNALING_URL`，重新运行 Pages workflow 后会作为默认值填入页面。

### Render 最小部署路径

仓库已增加 `render.yaml`，可作为 Render Blueprint 使用。

1. 打开 Render，新建 Blueprint 或 Web Service。
2. 选择 GitHub 仓库 `xiaojiongqian/rtc_intro`。
3. 使用仓库中的 `render.yaml`。
4. 部署完成后，Render 会提供 HTTPS 域名，例如：

```text
https://rtc-intro-signaling.onrender.com
```

实验台里填写对应的 WebSocket 地址：

```text
wss://rtc-intro-signaling.onrender.com
```

如果希望 Pages 页面默认带上这个地址，可在本机执行：

```bash
gh variable set VITE_SIGNALING_URL --repo xiaojiongqian/rtc_intro --body "wss://rtc-intro-signaling.onrender.com"
gh workflow run deploy-pages.yml --repo xiaojiongqian/rtc_intro
```

Render Free 服务空闲后可能休眠，第一次连接会慢一些。课堂演示前建议先访问 `/health` 唤醒服务。

## GitHub Pages 设置

如果仓库 Pages 尚未启用：

1. 打开 GitHub 仓库 `xiaojiongqian/rtc_intro`。
2. 进入 Settings -> Pages。
3. Build and deployment 选择 GitHub Actions。
4. push `main` 或手动运行 `Deploy GitHub Pages` workflow。

仓库当前是 Private。是否能从 Private 仓库发布 Pages 取决于账号或组织的 GitHub Pages 权限；如果目标是完全公开访问，最稳妥的方式是将仓库转为 Public，或确认当前账号计划支持 Private repo Pages。

## 教学演示限制

- GitHub Pages 只解决前端公网访问，不提供信令服务。
- 没有 TURN 时，复杂 NAT 或企业网络下 P2P 可能连接失败。
- 摄像头和麦克风在 GitHub Pages HTTPS 页面上可以正常请求权限。
- 多人通话仍按课程设计限制为最多 4 人全 P2P Mesh。
