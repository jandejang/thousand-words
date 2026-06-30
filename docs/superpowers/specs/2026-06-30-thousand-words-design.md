# 千字文互动学习应用 - 设计文档

## 概述

基于南朝周兴嗣《千字文》的互动网页应用，支持儿童启蒙和成人研读两种深度，通过渐进展开的交互方式陪伴用户从识字到深度理解。移动端自适应。

## 目标受众

- **儿童启蒙**：拼音标注、简明释义，辅助识字和背诵
- **成人研读**：逐字注释、整句详解、典故出处原文与白话解读

不做英文对照，两种深度通过渐进展开自然过渡，无需切换模式。

## 技术栈

- **Vite + Vue 3 + Vue Router**
- 典故子页面路由懒加载
- 图片懒加载（`loading="lazy"` + Intersection Observer）
- CSS 变量驱动主题切换
- 纯前端，零后端依赖
- 部署方式暂不限定

## 项目结构

```
thousand-words/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   │   └── index.js
│   ├── components/
│   │   ├── CharGrid.vue          # 主页网格（250句平铺）
│   │   ├── CharCell.vue          # 单句卡片（ruby拼音 + 悬停释义）
│   │   ├── CharDetail.vue        # L2 展开层（逐字注释 + 整句详解）
│   │   └── ThemeSwitch.vue       # 主题切换器
│   ├── pages/
│   │   └── AllusionPage.vue      # L3 典故子页面（路由懒加载）
│   ├── data/
│   │   ├── characters.json       # 250句全量数据
│   │   └── allusions.json        # 典故数据
│   ├── assets/
│   │   └── images/               # 公共领域古画
│   └── styles/
│       ├── themes.css            # 三套主题 CSS 变量
│       └── main.css              # 全局样式
```

## 数据结构

### characters.json

每条记录对应一句四字（共250条）：

```json
{
  "id": 1,
  "text": "天地玄黄",
  "pinyin": ["tiān", "dì", "xuán", "huáng"],
  "briefMeaning": "天是青黑色，地是黄色",
  "charAnnotations": [
    { "char": "天", "meaning": "天空" },
    { "char": "地", "meaning": "大地" },
    { "char": "玄", "meaning": "青黑色，深远" },
    { "char": "黄", "meaning": "黄色" }
  ],
  "fullExplanation": "天的颜色是青黑的，地的颜色是黄的。开篇以天地引出宇宙万物的宏大主题。",
  "allusionId": "tianxuandihuang"
}
```

字段说明：
- `id`：顺序编号 1-250
- `text`：四字原文
- `pinyin`：四个字的拼音数组，与原文逐字对应
- `briefMeaning`：一句话白话翻译（L1 悬停显示）
- `charAnnotations`：逐字注释数组（L2 展开显示）
- `fullExplanation`：整句详解（L2 展开显示）
- `allusionId`：关联典故 ID，无典故时为 `null`

### allusions.json

典故数据，不是每句都有，仅有典故出处的句子关联：

```json
{
  "id": "tianxuandihuang",
  "title": "天玄地黄",
  "source": "《易经·坤卦》",
  "sourceText": "夫玄黄者，天地之杂也，天玄而地黄。",
  "interpretation": "古人观察天空呈青黑色，大地呈黄色，以此描述天地最基本的色彩特征，引申为宇宙初始的面貌。",
  "image": "images/kunqua.jpg",
  "imageSource": "故宫博物院藏《周易》抄本"
}
```

字段说明：
- `id`：唯一标识，用于路由和关联
- `title`：典故名称
- `source`：出处文献名
- `sourceText`：出处原文引用
- `interpretation`：白话解读
- `image`：配图路径（公共领域古画），无配图时为 `null`
- `imageSource`：图片来源说明

## 交互设计

### 三层渐进展开

#### L1 - 悬停简释

- PC：鼠标悬停句子卡片，显示气泡提示（tooltip），内容为 `briefMeaning`
- 移动端：无悬停能力，简释文字默认直接显示在句子下方
- 气泡样式：深色底 + 浅色字，箭头指向目标句子

#### L2 - 点击展开详解

- 点击任意句子，在网格中原位展开详情区域（占满整行宽度）
- 展开内容：
  - 上方：四字原文放大 + ruby 拼音
  - 中部：逐字注释卡片（4 格并排，移动端 2×2）
  - 下方：整句详解文字
  - 底部：若有关联典故，显示「典故出处 →」按钮
- 再次点击同一句收起；点击其他句子切换展开目标
- 展开/收起带平滑过渡动画

#### L3 - 典故子页面

- 点击「典故出处」按钮，通过 Vue Router 跳转到 `/allusion/:id`
- 页面内容：
  - 顶部：「← 返回全文」导航链接
  - 标题：典故名称
  - 出处标注：文献名
  - 引用区块：出处原文，左侧竖线装饰
  - 白话解读：段落文字
  - 配图：公共领域古画（如有），附图片来源说明
- 路由懒加载：`() => import('./pages/AllusionPage.vue')`

### 路由定义

| 路径 | 组件 | 加载方式 | 说明 |
|---|---|---|---|
| `/` | `CharGrid.vue` | 同步 | 主页，250句网格平铺 |
| `/allusion/:id` | `AllusionPage.vue` | 懒加载 | 典故详情子页面 |

## 排版设计

### 主页网格

- 四字一格，使用 CSS Grid 布局
- 每个字上方用 `<ruby>` / `<rt>` 标签精确对齐拼音
- 字间距（gap）保证拼音不挤压相邻字
- 响应式断点：
  - `>= 520px`：4 列
  - `360px - 519px`：2 列
  - `< 360px`：1 列

### 字体

- 正文汉字：`"Noto Serif SC", "Source Han Serif SC", serif`（衬线体，古典感）
- 拼音 / UI 文字：系统默认 sans-serif
- 字号：网格中汉字 26px，L2 展开放大至 32px，拼音 11-12px

## 视觉风格

### 三套主题，CSS 变量切换

通过 `<html data-theme="...">` 属性切换，用户选择持久化到 `localStorage`。

#### 暖宣纸（默认）

```
--bg: #faf6f0          米黄底色
--text: #2c1810        深棕文字
--accent: #8b5a2b      赭石色点缀
--subtle: rgba(139,90,43,0.06)  浅底色块
```

#### 水墨素雅

```
--bg: #f5f5f0          冷灰白底
--text: #1a1a1a        墨色文字
--accent: #666666      灰色点缀
--subtle: rgba(0,0,0,0.03)
```

#### 深色古卷

```
--bg: #1a1a2e          深蓝墨底
--text: #e8d5b7        金褐色文字
--accent: #c4a36e      金色点缀
--subtle: rgba(200,170,120,0.08)
```

### 主题切换器

- 位置：页面右上角
- 形态：圆形图标按钮，点击弹出三个主题选项
- 移动端同样保持右上角，尺寸缩小

## 配图策略

- 优先使用公共领域古画：维基共享资源、故宫博物院开放图库等
- 只在典故子页面（L3）展示配图，不在主页网格中使用
- 找不到合适古画的典故不配图，不用现代摄影或插画替代
- 所有图片标注来源
- 图片懒加载：`loading="lazy"` 属性 + Intersection Observer

## 移动端适配

- 网格列数响应式：4 → 2 → 1
- L1 悬停改为默认显示简释文字
- L2 展开区占满屏幕宽度，逐字注释 4 格变 2×2
- L3 典故子页面全屏展示
- 主题切换按钮尺寸缩小
- 触摸友好：点击区域足够大，间距适当
