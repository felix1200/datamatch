# AGENTS.md

## 项目概述

VLOOKUP 公式助手 — 纯前端工具，帮助用户可视化生成 Excel VLOOKUP 公式。用户上传 Excel 文件，通过下拉框配置参数，批量生成公式并支持三种输出方式。

## 技术栈

- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- SheetJS (xlsx) 处理 Excel 文件
- pnpm 包管理器

## 目录结构

```
src/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面（步骤式流程）
│   └── globals.css         # 全局样式
├── components/
│   ├── ui/                 # shadcn/ui 组件库
│   ├── file-upload.tsx     # 拖拽上传组件
│   ├── data-preview.tsx    # 数据预览表格
│   ├── vlookup-config.tsx  # VLOOKUP 参数配置面板
│   └── output-panel.tsx    # 输出面板（公式/预览/下载）
├── lib/
│   ├── utils.ts            # cn 工具函数
│   ├── excel-utils.ts      # Excel 解析与导出
│   └── vlookup-engine.ts   # VLOOKUP 公式生成与执行
└── hooks/
    └── use-mobile.ts       # 移动端检测
```

## 核心功能

1. **文件模式切换**：支持单文件（不同工作表）和双文件两种模式
2. **文件上传**：支持 xlsx/xls/csv，最多 2 个文件，拖拽或点击上传
3. **数据预览**：表格展示，支持工作表切换，最多展示 50 行
4. **参数配置**：下拉框选择源文件/工作表、查找值列、目标文件/工作表、匹配列、范围结束列、返回列（多选）、匹配方式
5. **公式生成**：批量为所有行生成 VLOOKUP 公式
6. **三种输出**：复制公式文本、预览匹配结果、下载 Excel 文件

## 构建与运行

```bash
pnpm dev          # 开发环境
pnpm build        # 生产构建
pnpm start        # 生产启动
pnpm ts-check     # TypeScript 检查
pnpm lint         # ESLint 检查
```
