# 项目执行规则

## 开发服务器运行规则

运行 `npm run dev` 或执行开发服务器时，必须使用以下方式：

1. 使用 nohup 在后台运行开发服务器
2. 抓取并显示服务 IP 地址

### 具体命令

```bash
# 运行开发服务器
nohup npm run dev > dev.log 2>&1 &
echo $! > dev.pid

# 等待服务器启动并获取 IP
sleep 2
tail -n 20 dev.log
```

### 说明
- 开发服务器输出将保存到 dev.log
- 进程 ID 将保存到 dev.pid
- 启动后会显示日志末尾，便于查看服务器地址和端口
