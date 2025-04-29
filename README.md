# Upper-UI

Upper-UI 是一个基于 React 和 Tailwind CSS 构建的现代化组件库，提供了一系列美观、可复用的 UI 组件。

## 特性

- 🎨 基于 Tailwind CSS 的样式系统
- ⚡️ 高性能的 React 组件
- 🎯 完全类型安全的 TypeScript 支持
- 🌙 内置暗色模式支持
- 📱 响应式设计
- 🎭 可定制的主题

## 安装

```bash
npm install upper-ui
# 或
yarn add upper-ui
```

## 快速开始

1. 首先，确保你的项目已经安装了必要的依赖：

```bash
npm install react react-dom tailwindcss postcss autoprefixer
```

2. 在你的项目的 `tailwind.config.js` 中添加 upper-ui 的配置：

```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/upper-ui/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. 在你的 React 应用中导入并使用组件：

```tsx
import { Button, Card, Input } from 'upper-ui';

function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Card>
        <Card.Header>
          <Card.Title>Welcome</Card.Title>
        </Card.Header>
        <Card.Content>
          <Input placeholder="Enter your name" />
        </Card.Content>
      </Card>
    </div>
  );
}
```

## 组件列表

### Button 按钮

提供多种样式和尺寸的按钮组件。

```tsx
import { Button } from 'upper-ui';

// 基本用法
<Button>Default Button</Button>

// 不同变体
<Button variant="outline">Outline Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="destructive">Destructive Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>

// 不同尺寸
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>

// 禁用状态
<Button disabled>Disabled Button</Button>
```

### Card 卡片

用于展示内容区块的卡片组件。

```tsx
import { Card } from 'upper-ui';

<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here</p>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Dialog 对话框

用于展示模态对话框的组件。

```tsx
import { Dialog } from 'upper-ui';

<Dialog>
  <Dialog.Trigger>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>
        Dialog description goes here
      </Dialog.Description>
    </Dialog.Header>
    <div className="py-4">
      <p>Dialog content</p>
    </div>
    <Dialog.Footer>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

### Input 输入框

提供多种类型的输入框组件。

```tsx
import { Input } from 'upper-ui';

// 基本输入框
<Input placeholder="Enter text" />

// 不同状态
<Input disabled placeholder="Disabled input" />
<Input defaultValue="Default value" />

// 不同类型
<Input type="password" placeholder="Password" />
<Input type="email" placeholder="Email" />
<Input type="number" placeholder="Number" />
<Input type="search" placeholder="Search" />
<Input type="tel" placeholder="Phone number" />
```

### Progress 进度条

用于展示进度的组件。

```tsx
import { Progress } from 'upper-ui';

<Progress value={75} />
```

### Switch 开关

用于切换状态的开关组件。

```tsx
import { Switch } from 'upper-ui';

<Switch />
```

### Textarea 文本域

用于多行文本输入的组件。

```tsx
import { Textarea } from 'upper-ui';

<Textarea placeholder="Enter your message" />
```

### Tooltip 提示框

用于显示提示信息的组件。

```tsx
import { Tooltip } from 'upper-ui';

<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

### Sonner 通知

用于显示通知消息的组件。

```tsx
import { toast } from 'upper-ui';

// 在组件中使用
toast.success("Operation successful!");
toast.error("Something went wrong!");
toast.warning("Please be careful!");
toast.info("Here's some information");
```

## 主题定制

Upper-UI 支持通过 Tailwind CSS 进行主题定制。你可以在 `tailwind.config.js` 中自定义颜色、间距、字体等样式。

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0070f3',
          dark: '#0061d5',
        },
      },
    },
  },
}
```

## 贡献指南

我们欢迎任何形式的贡献！如果你发现 bug 或有新功能建议，请提交 issue 或 pull request。

1. Fork 项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

MIT