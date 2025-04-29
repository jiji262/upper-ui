# Upper UI Component Library

A modern, accessible, and customizable component library built with React and Tailwind CSS.

## Features

- 🎨 Modern and clean design
- ♿️ Fully accessible components
- 🎯 Built with React and TypeScript
- 🎨 Styled with Tailwind CSS
- 📱 Responsive and mobile-friendly
- 🎨 Customizable theme support
- 📦 Easy to install and use

## Installation

```bash
npm install @upper-ui/core
# or
yarn add @upper-ui/core
```

## Quick Start

```tsx
import { Button } from '@upper-ui/core';

function App() {
  return <Button>Click me</Button>;
}
```

## Components

### Data Entry

#### Button

```tsx
import { Button } from '@upper-ui/core';

// Basic usage
<Button>Default</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
```

#### Input

```tsx
import { Input } from '@upper-ui/core';

// Basic usage
<Input placeholder="Enter text" />

// States
<Input disabled placeholder="Disabled" />
```

#### Textarea

```tsx
import { Textarea } from '@upper-ui/core';

// Basic usage
<Textarea placeholder="Enter message" />

// States
<Textarea disabled placeholder="Disabled" />
```

#### Switch

```tsx
import { Switch } from '@upper-ui/core';

// Basic usage
<Switch checked={isChecked} onCheckedChange={setIsChecked} />
```

### Data Display

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@upper-ui/core';

// Basic usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// With shadow
<Card className="shadow-md">
  {/* ... */}
</Card>

// With border
<Card className="border-2 border-gray-200">
  {/* ... */}
</Card>

// Flat style
<Card className="bg-gray-50">
  {/* ... */}
</Card>
```

#### Avatar

```tsx
import { Avatar } from '@upper-ui/core';

// With image
<Avatar src="https://example.com/avatar.jpg" />

// With initials
<Avatar>JD</Avatar>

// Sizes
<Avatar size="sm" src="..." />
<Avatar size="default" src="..." />
<Avatar size="lg" src="..." />
```

#### Badge

```tsx
import { Badge } from '@upper-ui/core';

// Basic usage
<Badge>Default</Badge>

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Feedback

#### Progress

```tsx
import { Progress } from '@upper-ui/core';

// Basic usage
<Progress value={75} />
```

#### Alert

```tsx
import { Alert } from '@upper-ui/core';

// Basic usage
<Alert>Default alert</Alert>

// Variants
<Alert variant="default">Default</Alert>
<Alert variant="success">Success</Alert>
<Alert variant="warning">Warning</Alert>
<Alert variant="destructive">Destructive</Alert>
```

#### Tooltip

```tsx
import { Tooltip, TooltipProvider } from '@upper-ui/core';

// Basic usage
<TooltipProvider>
  <Tooltip content="Tooltip content">
    <Button>Hover me</Button>
  </Tooltip>
</TooltipProvider>
```

### Navigation

#### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@upper-ui/core';

// Basic usage
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <p>Account content</p>
  </TabsContent>
  <TabsContent value="password">
    <p>Password content</p>
  </TabsContent>
</Tabs>
```

#### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@upper-ui/core';

// Basic usage
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description goes here.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <p>Dialog content goes here.</p>
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Customization

### Theme

You can customize the theme by extending the Tailwind configuration:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
      },
    },
  },
}
```

### Styling

All components can be styled using Tailwind CSS classes:

```tsx
<Button className="bg-custom-color hover:bg-custom-color-dark">
  Custom Button
</Button>
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Your Name]