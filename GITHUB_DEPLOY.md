# GitHub 推送指南

本指南将帮助您将智能家居控制面板项目推送到GitHub。

## 前提条件

1. 已安装 Git（如果未安装，请访问 https://git-scm.com/download/win）
2. 已注册 GitHub 账号（如果未注册，请访问 https://github.com/signup）
3. 项目目录已初始化 Git 仓库（已完成）

## 步骤一：在GitHub上创建仓库

1. 登录 GitHub 账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `smart-home-control-panel`（或您喜欢的名称）
   - **Description**: `智能家居控制面板 - 基于边缘计算的智能家居管理系统`
   - **Visibility**: 选择 **Public**（公开，阿里云ESA Pages需要公开仓库）
   - ⚠️ **不要**勾选 "Initialize this repository with a README"（因为本地已有代码）
4. 点击 "Create repository" 创建仓库

## 步骤二：提交本地更改

在项目目录下执行以下命令：

```bash
# 1. 查看当前状态
git status

# 2. 添加所有更改的文件（包括删除的文件）
git add -A

# 3. 提交更改
git commit -m "Initial commit: 智能家居控制面板项目"

# 如果您想提交更详细的信息：
git commit -m "Initial commit: 智能家居控制面板

- 完整的3D可视化功能
- 设备管理和控制
- 场景联动功能
- 能源管理
- 本地存储持久化"
```

## 步骤三：添加远程仓库

**如果GitHub仓库URL是 `https://github.com/您的用户名/仓库名.git`**，执行：

```bash
# 添加远程仓库（如果还没有）
git remote add origin https://github.com/您的用户名/仓库名.git

# 如果已经存在，可以更新URL
git remote set-url origin https://github.com/您的用户名/仓库名.git
```

**如果使用SSH（需要配置SSH密钥）：**

```bash
git remote add origin git@github.com:您的用户名/仓库名.git
```

## 步骤四：推送到GitHub

```bash
# 首次推送
git push -u origin main

# 如果遇到分支名称问题，使用以下命令：
git branch -M main
git push -u origin main
```

## 常见问题处理

### 1. 如果提示需要认证

GitHub已不再支持密码认证，需要使用Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" -> "Generate new token (classic)"
3. 设置Token名称和过期时间
4. 勾选权限：至少需要 `repo` 权限
5. 生成后复制Token（只显示一次）
6. 推送时用户名输入您的GitHub用户名，密码输入Token

### 2. 如果提示分支冲突

```bash
# 如果远程仓库有README等文件，先拉取
git pull origin main --allow-unrelated-histories

# 解决冲突后再次推送
git push -u origin main
```

### 3. 如果使用SSH但未配置

```bash
# 生成SSH密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制公钥内容
cat ~/.ssh/id_ed25519.pub

# 在GitHub上添加SSH密钥：
# Settings -> SSH and GPG keys -> New SSH key
```

### 4. 如果推送被拒绝（force push警告）

⚠️ **不要使用 `git push --force`**，除非您确定要覆盖远程代码。

如果需要强制推送（谨慎使用）：
```bash
git push -u origin main --force
```

## 步骤五：验证推送

1. 访问您的GitHub仓库页面：`https://github.com/您的用户名/仓库名`
2. 确认所有文件都已上传
3. 确认README.md正确显示

## 后续更新代码

当您修改代码后，使用以下命令更新GitHub：

```bash
# 1. 查看更改
git status

# 2. 添加更改的文件
git add .

# 3. 提交更改
git commit -m "描述您的更改"

# 4. 推送到GitHub
git push
```

## 为阿里云ESA Pages部署准备

推送完成后，您需要：

1. 确保仓库是公开的（Public）
2. 在阿里云ESA Pages控制台创建项目
3. 连接GitHub仓库
4. 配置构建命令：`npm run build`
5. 配置输出目录：`dist`
6. 部署并获取访问URL

祝您部署顺利！

