# Upper UI

A modern React component library with a playful and unique design style. Built with TypeScript, Tailwind CSS, and Radix UI primitives.

## Installation

```bash
npm install upper-ui
# or
yarn add upper-ui
# or
pnpm add upper-ui
```

## Components

### Layout Components

#### Flex
A flexible box layout component that makes it easy to create responsive layouts.

```tsx
<Flex direction="row" justify="between" align="center" gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

Props:
- `direction`: 'row' | 'column'
- `justify`: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
- `align`: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
- `wrap`: 'nowrap' | 'wrap' | 'wrap-reverse'
- `gap`: number

### Data Entry Components

#### Button
A versatile button component with multiple variants and sizes.

```tsx
<Button variant="default">Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
```

Props:
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `asChild`: boolean

#### Input
A text input component.

```tsx
<Input placeholder="Type here..." />
```

#### Textarea
A multiline text input component.

```tsx
<Textarea placeholder="Enter long text..." />
```

#### Switch
A toggle switch component.

```tsx
<Switch checked={value} onChange={setValue} />
```

#### Checkbox
A checkbox component with an optional label.

```tsx
<Checkbox label="Remember me" checked={value} onChange={setValue} />
```

### Data Display Components

#### Avatar
A component for displaying user avatars.

```tsx
<Avatar src="path/to/image.jpg" alt="User name" />
```

#### Badge
A component for displaying status indicators or counts.

```tsx
<Badge variant="secondary">New</Badge>
```

Props:
- `variant`: 'default' | 'secondary' | 'destructive' | 'outline'
- `size`: 'sm' | 'md' | 'lg'

#### Card
A container component for displaying content in a box.

```tsx
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

#### List
A component for displaying lists of items.

```tsx
<List bordered>
  <List.Item>Item 1</List.Item>
  <List.Item>Item 2</List.Item>
</List>
```

Props:
- `bordered`: boolean

### Navigation Components

#### Tabs
A component for switching between different views.

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

#### Select
A dropdown select component.

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Feedback Components

#### Alert
A component for displaying important messages.

```tsx
<Alert variant="default">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>
```

Props:
- `variant`: 'default' | 'destructive' | 'success' | 'warning'

#### Dialog
A modal dialog component.

```tsx
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

#### Progress
A progress indicator component.

```tsx
<Progress value={75} />
```

## Development

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```
3. Start the development server:
```bash
pnpm dev
```

## License

MIT