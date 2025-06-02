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

## Preview

![Upper UI Component Library](./screenshots/homepage.png)

The screenshot above shows the main interface of the component library, featuring:
- Modern header with dark mode toggle
- Hero section with call-to-action buttons
- Comprehensive component showcase
- Quick stats and recent updates
- Clean and professional footer

## Installation

```bash
git clone https://github.com/jiji262/upper-ui.git
cd upper-ui
npm install
```

## Quick Start

```tsx
import { Button } from './components/ui/data-entry/button';

function App() {
  return <Button>Click me</Button>;
}
```

## Components

### Component Styles

This library provides two distinct styles of components:

1. **Tailwind CSS Components** - Modern style components built with Tailwind CSS, with a focus on clean design and accessibility
2. **Upper UI Style Components** - Components that follow the Upper UI design system, featuring black borders, box shadows, and a distinctive, playful style

You can use either style or mix them in your project, depending on your design requirements.

### Tailwind Style Components

#### Typography

Provides components for rendering common text elements like titles, paragraphs, links, and general text with various styles.

```tsx
import { Title, Text, Paragraph, Link, Input } from './components/ui/general';

// Title (Levels 1-5)
<Title level={1}>Main Heading (Default H1)</Title>
<Title level={2} className="text-purple-600">Styled H2 Heading</Title>
<Title level={3}>Sub-heading H3</Title>
<Title level={4}>Smaller Heading H4</Title>
<Title level={5}>Even Smaller H5</Title>

// Paragraph
<Paragraph className="text-slate-700 dark:text-slate-300">
  This is a paragraph with custom styling. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
</Paragraph>
<Paragraph>
  Standard paragraph. You can <Link href="#example" className="font-bold hover:text-destructive">include styled links</Link> too.
</Paragraph>

// Text (various styles and combinations)
<Text>Basic text element.</Text>
<Text strong>Strong (bold) text.</Text>
<Text italic>Italic text.</Text>
<Text underline>Underlined text.</Text>
<Text code>Inline code snippet: `const a = 10;`</Text>
<Text mark>Marked/highlighted text.</Text>
<Text type="secondary">Secondary color text.</Text>
<Text type="success" strong>Strong success text.</Text>
<Text type="warning" italic>Italic warning text.</Text>
<Text type="danger" size="lg">Large danger text.</Text>
<Text size="sm" className="text-blue-500">Small custom-colored text.</Text>
<Text disabled>This text is disabled.</Text>

// Using asChild prop (example with Text as a label)
<Text asChild strong>
  <label htmlFor="my-input">Label for Input:</label>
</Text>
{/* <Input id="my-input" placeholder="Input field" /> */}

// Link
<Link href="#example">Internal Link</Link>
<Link href="https://example.com" target="_blank">External Link (new tab)</Link>
```

#### Button

```tsx
import { Button } from './components/ui/data-entry/button';

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
import { Input } from './components/ui/data-entry/input';

// Basic usage
<Input placeholder="Enter text" />

// States
<Input disabled placeholder="Disabled" />
```

#### Textarea

```tsx
import { Textarea } from './components/ui/data-entry/textarea';

// Basic usage
<Textarea placeholder="Enter message" />

// States
<Textarea disabled placeholder="Disabled" />
```

#### Switch

```tsx
import { Switch } from './components/ui/data-entry/switch';

// Basic usage
<Switch checked={isChecked} onCheckedChange={setIsChecked} />
```

#### Form

A collection of components to build accessible and manageable forms, integrated with `react-hook-form` and `zod` for validation.

```tsx
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from './components/ui/data-entry/form';
import { Input } from './components/ui/data-entry/input';
import { Button } from './components/ui/data-entry/button';
import { Textarea } from './components/ui/data-entry/textarea';
import { Checkbox } from './components/ui/data-entry/checkbox';
import { Switch } from './components/ui/data-entry/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./components/ui/navigation/select"; // Note: Select is typically in navigation but used here
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 1. Define your form schema with Zod
const formSchema = z.object({
  username: z.string()
    .min(2, "Username must be at least 2 characters.")
    .max(50, "Username must be 50 characters or less."),
  email: z.string().email("Invalid email address."),
  bio: z.string().max(200).optional(),
  preferredFramework: z.enum(["react", "vue", "svelte", "angular"], { 
    required_error: "Please select a framework."
  }),
  agreesToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
  notifications: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// 2. Create your form component
function MyEnhancedForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { // It's good practice to set default values
      username: "",
      email: "",
      bio: "",
      // preferredFramework: undefined, // Or a default valid enum value
      agreesToTerms: false,
      notifications: false,
    },
  });

  function onSubmit(data: FormValues) {
    console.log("Form Submitted!", data);
    // Handle your form submission logic (e.g., API call)
  }

  return (
    <Form {...form}> {/* Pass all form methods and state */} 
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control} // Connects to react-hook-form state
          name="username" // Must match a key in your Zod schema
          render={({ field }) => ( // `field` contains onChange, onBlur, value, ref
            <FormItem> {/* Provides context for labels and messages */} 
              <FormLabel>Username</FormLabel>
              <FormControl> {/* Renders the actual input component */} 
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage /> {/* Displays validation errors for this field */} 
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredFramework"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred UI Framework</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose your favorite framework.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            // Example of custom layout for a form item
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Communication preferences</FormLabel>
                <FormDescription>
                  Receive email notifications.
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreesToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Agree to terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our <Link href="/terms">Terms of Service</Link>.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <Button type="submit">Submit Form</Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/data-display/card';

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
```

#### Dialog

```tsx
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from './components/ui/feedback/dialog';
import { Button } from './components/ui/data-entry/button';

// Basic Dialog with trigger
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        This is a dialog component with custom styling.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <p>Dialog content goes here. You can add any UI elements, forms, or information.</p>
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Controlled Dialog
const [open, setOpen] = React.useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    {/* Dialog content */}
  </DialogContent>
</Dialog>

<Button onClick={() => setOpen(true)}>Open Dialog</Button>
```

### Upper UI Style Components

These components follow the Upper UI design system, featuring black borders, box shadows, and a distinctive, playful style.

#### InputAnt

```tsx
import { Input as InputAnt } from './components/ui/data-entry/input';

// Basic usage
<InputAnt placeholder="Basic usage" />

// Input Sizes
<InputAnt size="small" placeholder="Small size" />
<InputAnt placeholder="Default size" />
<InputAnt size="large" placeholder="Large size" />

// Input States
<InputAnt placeholder="Error" error={true} />
<InputAnt placeholder="Disabled" disabled />

// Input with Addons
<div className="flex items-center">
  <span className="mr-2 px-2 py-1 bg-gray-100 border rounded-l">http://</span>
  <InputAnt placeholder="Website" className="rounded-l-none" />
  <span className="ml-2 px-2 py-1 bg-gray-100 border rounded-r">.com</span>
</div>
```

#### TextareaAnt

```tsx
import TextareaAnt from './components/ui/data-entry/Textarea/Textarea';

// Basic TextArea
<TextareaAnt placeholder="Basic usage" />

// With Character Count
<TextareaAnt showCount maxLength={100} placeholder="With character count" />

// Error State
<TextareaAnt status="error" placeholder="Error" />
```

#### CheckboxAnt

```tsx
import { Checkbox as CheckboxAnt, IndeterminateCheckbox } from './components/ui/data-entry/checkbox';

// Basic Checkbox
<CheckboxAnt label="Basic Checkbox" />

// Controlled Checkbox
const [checked, setChecked] = React.useState(false);
<CheckboxAnt 
  label="Controlled Checkbox"
  checked={checked} 
  onChange={(e) => setChecked(e.target.checked)}
/>

// Checkbox States
<CheckboxAnt label="Disabled" disabled />
<CheckboxAnt label="Disabled Checked" disabled checked />
<IndeterminateCheckbox label="Indeterminate" />
```

#### SelectAnt

```tsx
import SelectAnt from './components/ui/data-entry/Select/Select';

// Basic Select
<SelectAnt
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ]}
  placeholder="Please select"
  value={selectValue}
  onChange={(value) => setSelectValue(value)}
/>

// Multiple Select
<SelectAnt
  mode="multiple"
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ]}
  placeholder="Select multiple"
/>

// Disabled Select
<SelectAnt
  disabled
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ]}
  placeholder="Disabled"
/>
```

#### Icon

```tsx
import Icon from './components/ui/general/Icon/Icon';

// Basic Icons
<Icon name="UploadOutlined" style={{ fontSize: '24px' }} />
<Icon name="LeftOutlined" style={{ fontSize: '24px' }} />
<Icon name="RightOutlined" style={{ fontSize: '24px' }} />

// Custom Color
<Icon name="UploadOutlined" style={{ fontSize: '24px', color: 'purple' }} />
```

#### Empty

```tsx
import Empty from './components/ui/data-display/Empty/Empty';

// Basic Empty
<Empty description="No data available" />

// With Custom Description
<Empty description="No items found. Try a different search." />
```

#### Descriptions

```tsx
import Descriptions from './components/ui/data-display/Descriptions/Descriptions';
import DescriptionsItem from './components/ui/data-display/Descriptions/DescriptionsItem';

// Basic Descriptions
<Descriptions title="User Information">
  <DescriptionsItem label="Name">John Doe</DescriptionsItem>
  <DescriptionsItem label="Email">john.doe@example.com</DescriptionsItem>
  <DescriptionsItem label="Status">Active</DescriptionsItem>
</Descriptions>

// Bordered Descriptions
<Descriptions title="Product Details" bordered>
  <DescriptionsItem label="Product">Upper UI Library</DescriptionsItem>
  <DescriptionsItem label="Version">1.0.0</DescriptionsItem>
  <DescriptionsItem label="License">MIT</DescriptionsItem>
  <DescriptionsItem label="Description">A React UI component library</DescriptionsItem>
</Descriptions>
```

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.