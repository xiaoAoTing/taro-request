# 发布指南

## 📦 发布前检查清单

- [x] 代码已重构，移除项目特定依赖
- [x] 构建成功（`npm run build`）
- [x] 打包测试通过（`npm pack --dry-run`）
- [x] README.md 文档完整
- [x] package.json 配置正确
- [x] 已登录 NPM 账号（`npm whoami` 显示 `lightgreen`）

## 🚀 发布步骤

### 1. 确认当前状态

```bash
cd packages/taro-request

# 确认已登录
npm whoami
# 应该显示: lightgreen

# 确认构建成功
npm run build

# 测试打包
npm pack --dry-run
```

### 2. 发布到 NPM

```bash
# 发布（会自动运行 prepublishOnly 脚本进行构建）
npm publish --access public
```

**注意**：由于包名是 `@lightgreen/taro-request`（作用域包），需要使用 `--access public` 参数发布为公共包。

### 3. 验证发布

发布成功后，可以：

1. 访问 NPM 页面：https://www.npmjs.com/package/@lightgreen/taro-request
2. 测试安装：
   ```bash
   npm install @lightgreen/taro-request
   ```

## 📝 版本更新

发布新版本时：

```bash
# 1. 更新版本号（会自动更新 package.json）
npm version patch  # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0

# 2. 发布
npm publish --access public
```

## 🔍 常见问题

### Q: 发布时提示包名已存在？

A: 检查 NPM 上是否已有同名包，或修改 package.json 中的包名。

### Q: 发布时提示需要验证邮箱？

A: 首次发布需要验证邮箱，请检查注册邮箱并完成验证。

### Q: 如何撤销已发布的版本？

A: 如果版本发布错误，可以在 72 小时内撤销：

```bash
npm unpublish @lightgreen/taro-request@1.0.0
```

**注意**：撤销操作不可逆，请谨慎操作。

## 📊 发布后操作

1. 在项目中测试安装和使用
2. 更新项目中的导入路径
3. 提交代码到 Git（如果使用版本控制）

