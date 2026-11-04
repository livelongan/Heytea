# 部署说明

1. 在项目根目录执行 `npm ci`。
2. 复制 `.env.example` 为 `.env.production`，按环境配置 `VITE_API_BASE_URL`。
3. 执行 `npm run test`，确认单元测试通过。
4. 执行 `npm run build`，生成 `dist/`。
5. 将 `dist/` 内容部署到静态站点目录。
6. 使用 Nginx 时，将 `nginx.conf` 配置到站点并将 `root` 指向静态文件目录。
7. 确认所有非静态资源路由回退到 `index.html`，以支持浏览器 history 路由。
8. 将 `/api` 请求代理到实际后端，或在本地开发时使用 MSW。
