# Brainstorming Visual Preview — 最佳实践

> 来源于 Zephyr's Lab 项目 2026-06-08 的 brainstorming 实战经验。

## 核心原则

**第一优先级：完整展示设计的真实页面效果**

当使用 brainstorming 的 visual companion 展示设计选项时，默认的 `cards` 三列网格会严重扭曲设计意图。必须先展示**全宽、嵌入页面的 mockup**，而不是把多个选项塞进卡片网格里。

## 问题场景

Linear.app 风格的 hero 是**垂直分层**的——每行一个元素，大量留白。如果把它放进 `cards` 的三列布局中：

1. 每个选项被压缩到 1/3 宽度
2. 本来垂直堆叠的元素被横向挤压
3. 用户看到的是扭曲的排版，无法判断真实效果
4. 用户会误解为"一行放了太多内容"

实际上问题不是设计本身，而是**预览容器选错了**。

## 正确做法

### 1. 先展示单个全宽嵌入 Mockup

使用 `mockup` 容器，让内容占满整个宽度：

```html
<div class="mockup">
  <div class="mockup-header">Preview: Full Page Slice</div>
  <div class="mockup-body" style="padding: 0; background: #08090A;">
    <!-- 这里放真实的页面 HTML -->
    <!-- header + hero + content + footer -->
  </div>
</div>
```

这样用户看到的是**真实的页面效果**，不是被卡片网格扭曲过的版本。

### 2. 对比时保持每个选项全宽

如果要做 A/B/C 对比，不要用 `cards` 网格。改为**垂直堆叠**的全宽选项：

```html
<div class="options">
  <div class="option" data-choice="A">
    <div class="letter">A</div>
    <div class="content">
      <h3>方案 A</h3>
      <div class="mockup">
        <div class="mockup-body">... 全宽预览 ...</div>
      </div>
    </div>
  </div>
  <!-- B, C 同样全宽堆叠 -->
</div>
```

### 3. 什么时候用 `cards` 网格

只有当设计本身是**卡片式组件**（如 dashboard widget、product card）时，才适合用 `cards` 网格展示。对于页面级布局（hero、header、footer），永远不要用。

## 反模式 vs 正模式

| 反模式 ❌ | 正模式 ✅ |
|-----------|-----------|
| `cards` 三列网格放 hero 选项 | `mockup` 全宽展示单个页面切片 |
| 每个选项被压缩到 300px 宽 | 内容按实际 max-width（如 720px）渲染 |
| 垂直元素被挤成横向 | 保持真实的垂直分层 |
| 用户说"一行太多内容" | 用户看到的是真实布局 |

## 快速检查清单

在写 brainstorming 预览前问自己：

- [ ] 这个组件在真实页面中是多宽的？
- [ ] `cards` 网格会扭曲它的布局吗？
- [ ] 是否使用了 `mockup` 容器来保持真实尺寸？
- [ ] 对比多个选项时，它们是垂直堆叠还是横向挤压？

## 应用到本项目的经验

本项目（Zephyr's Lab）的 hero 设计：
- 真实宽度：max-width 720px，居中
- 真实布局：垂直分层，每行一个元素
- 错误预览：三列卡片 → 每列 1/3 宽，内容被压扁
- 正确预览：全宽 mockup → 720px 内容区域，真实留白

当切换到全宽 mockup 后，用户立即认可了设计方向。
