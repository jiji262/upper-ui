import React, { useState } from 'react';
import {
  Button, 
  Input, 
  Textarea, 
  Switch, 
  Checkbox, // Assuming Checkbox is used in Form demo
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from './components/ui/data-entry';
import {
  Avatar, 
  Badge, 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter
} from './components/ui/data-display';
import {
  Progress, 
  Tooltip, TooltipProvider, 
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, 
  Alert,
  Skeleton
} from './components/ui/feedback';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuShortcut, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent
} from './components/ui/navigation';
import { Footer } from './components/ui/layout/footer';
import { Title, Text, Paragraph, Link } from './components/ui/general';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'; // Assuming this will be installed for Form demo
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./components/ui/navigation/select"; // Added for Form demo
import { User, CreditCard, Settings, Keyboard, Users, UserPlus, Mail, MessageSquare, PlusCircle } from "lucide-react"; // Icons for Dropdown

// Import Ant Design style components
// import ButtonAnt from './components/ui/general/Button'; // Removing this import
import { Input as InputAnt } from './components/ui/data-entry/input';
import { Checkbox as CheckboxAnt } from './components/ui/data-entry/checkbox';
import SelectAnt from './components/ui/data-entry/Select/Select';
import TextareaAnt from './components/ui/data-entry/Textarea/Textarea';
import Icon from './components/ui/general/Icon/Icon';
import Empty from './components/ui/data-display/Empty/Empty';
import Descriptions from './components/ui/data-display/Descriptions/Descriptions';
import DescriptionsItem from './components/ui/data-display/Descriptions/DescriptionsItem';
import Modal from './components/ui/feedback/Modal/Modal';

function App() {
  const [progress, setProgress] = React.useState(13);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState<string>("button");
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [checkboxValue, setCheckboxValue] = React.useState(false);
  const [selectValue, setSelectValue] = React.useState<string | number | (string | number)[]>('');

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar src="https://i.pravatar.cc/150?img=1" size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Component Library</h1>
                <p className="text-sm text-gray-500">A collection of beautiful UI components</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Switch 
                id="dark-mode" 
                checked={darkModeEnabled} 
                onCheckedChange={setDarkModeEnabled}
              />
              <label htmlFor="dark-mode" className="text-sm text-gray-600">Dark Mode</label>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <section className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Our Component Library</h2>
              <p className="text-lg text-gray-600 mb-6">
                Explore our collection of carefully crafted UI components designed to help you build beautiful applications.
              </p>
              <div className="flex space-x-4">
                <Button size="lg">Get Started</Button>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </section>

            {/* Components Showcase */}
            <section className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Components</h2>
              
              {/* Upper UI Components */}
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upper UI Style Components</h3>
              
              {/* General Components */}
              <h4 className="text-lg font-medium text-gray-700 mb-3 mt-6">General Components</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buttons */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                    <CardDescription>Various button styles and variants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Button Variants</h5>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline">Default</Button>
                          <Button>Primary</Button>
                          <Button variant="outline" className="border-dashed">Dashed</Button>
                          <Button variant="ghost">Text</Button>
                          <Button variant="link">Link</Button>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Button Sizes</h5>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm">Small</Button>
                          <Button>Default</Button>
                          <Button size="lg">Large</Button>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Button States</h5>
                        <div className="flex flex-wrap gap-2">
                          <Button disabled>Disabled</Button>
                          <Button loading>Loading</Button>
                          <Button variant="destructive">Danger</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Icons */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Icons</CardTitle>
                    <CardDescription>Simple icon components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                        <Icon name="UploadOutlined" style={{ fontSize: '24px' }} />
                        <span className="text-sm mt-2">Upload</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                        <Icon name="LeftOutlined" style={{ fontSize: '24px' }} />
                        <span className="text-sm mt-2">Left</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                        <Icon name="RightOutlined" style={{ fontSize: '24px' }} />
                        <span className="text-sm mt-2">Right</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                        <Icon name="UploadOutlined" style={{ fontSize: '24px', color: 'purple' }} />
                        <span className="text-sm mt-2">Custom Color</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Data Entry Components */}
              <h4 className="text-lg font-medium text-gray-700 mb-3 mt-6">Data Entry Components</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Inputs</CardTitle>
                    <CardDescription>Text input components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Basic Input</h5>
                        <InputAnt placeholder="Basic usage" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Input Sizes</h5>
                        <div className="space-y-2">
                          <InputAnt size="small" placeholder="Small size" />
                          <InputAnt placeholder="Default size" />
                          <InputAnt size="large" placeholder="Large size" />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Input States</h5>
                        <div className="space-y-2">
                          <InputAnt placeholder="Error" error={true} />
                          <InputAnt placeholder="Disabled" disabled />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Input with Addons</h5>
                        <div className="flex items-center">
                          <span className="mr-2 px-2 py-1 bg-gray-100 border rounded-l">http://</span>
                          <InputAnt placeholder="Website" className="rounded-l-none" />
                          <span className="ml-2 px-2 py-1 bg-gray-100 border rounded-r">.com</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* TextArea */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>TextArea</CardTitle>
                    <CardDescription>Multi-line text input</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Basic TextArea</h5>
                        <TextareaAnt placeholder="Basic usage" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">With Character Count</h5>
                        <TextareaAnt showCount maxLength={100} placeholder="With character count" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Error State</h5>
                        <TextareaAnt status="error" placeholder="Error" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Checkbox & Radio */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Checkbox</CardTitle>
                    <CardDescription>Selection controls</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Basic Checkbox</h5>
                        <div className="space-y-2">
                          <CheckboxAnt label="Basic Checkbox" />
                          <CheckboxAnt 
                            label="Controlled Checkbox"
                            checked={checkboxValue} 
                            onChange={(e) => setCheckboxValue(e.target.checked)}
                          />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Checkbox States</h5>
                        <div className="space-y-2">
                          <CheckboxAnt label="Disabled" disabled />
                          <CheckboxAnt label="Disabled Checked" disabled checked />
                          <CheckboxAnt label="Indeterminate" indeterminate />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Select */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Select</CardTitle>
                    <CardDescription>Dropdown selection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Basic Select</h5>
                        <SelectAnt
                          options={[
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                            { label: 'Option 3', value: '3' },
                          ]}
                          placeholder="Please select"
                          value={selectValue}
                          onChange={(value) => setSelectValue(typeof value === 'string' || typeof value === 'number' ? value : value[0])}
                        />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Multiple Select</h5>
                        <SelectAnt
                          mode="multiple"
                          options={[
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                            { label: 'Option 3', value: '3' },
                          ]}
                          placeholder="Select multiple"
                        />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Disabled Select</h5>
                        <SelectAnt
                          disabled
                          options={[
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                          ]}
                          placeholder="Disabled"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Data Display Components */}
              <h4 className="text-lg font-medium text-gray-700 mb-3 mt-6">Data Display Components</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Empty Component */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Empty</CardTitle>
                    <CardDescription>Empty state placeholder</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Basic Empty</h5>
                        <Empty description="No data available" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">With Custom Description</h5>
                        <Empty description="No items found. Try a different search." />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Descriptions Component */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Descriptions</CardTitle>
                    <CardDescription>Display detailed information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Basic Descriptions</h5>
                        <Descriptions title="User Information">
                          <DescriptionsItem label="Name">John Doe</DescriptionsItem>
                          <DescriptionsItem label="Email">john.doe@example.com</DescriptionsItem>
                          <DescriptionsItem label="Status">Active</DescriptionsItem>
                        </Descriptions>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Bordered Descriptions</h5>
                        <Descriptions title="Product Details" bordered>
                          <DescriptionsItem label="Product">Upper UI Library</DescriptionsItem>
                          <DescriptionsItem label="Version">1.0.0</DescriptionsItem>
                          <DescriptionsItem label="License">MIT</DescriptionsItem>
                          <DescriptionsItem label="Description">A React UI component library</DescriptionsItem>
                        </Descriptions>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Feedback Components */}
              <h4 className="text-lg font-medium text-gray-700 mb-3 mt-6">Feedback Components</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Modal Component */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Modal</CardTitle>
                    <CardDescription>Dialog box for important content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Basic Modal</h5>
                        <div className="flex justify-center">
                          <Button onClick={() => setModalOpen(true)}>
                            Open Modal
                          </Button>
                        </div>
                        <Modal 
                          title="Upper UI Modal"
                          open={modalOpen}
                          onOk={() => setModalOpen(false)}
                          onCancel={() => setModalOpen(false)}
                          footer={[
                            <Button key="back" onClick={() => setModalOpen(false)}>
                              Cancel
                            </Button>,
                            <Button key="submit" onClick={() => setModalOpen(false)}>
                              OK
                            </Button>,
                          ]}
                        >
                          <p>This is a modal dialog with upper-ui styling. It has black borders, box shadows, and purple accents.</p>
                          <p>You can add any content here.</p>
                        </Modal>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Components</span>
                  <Badge>12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <Badge>4</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
              </div>
            </section>

            {/* Recent Updates */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Badge variant="secondary">New</Badge>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Added new components</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="secondary">Update</Badge>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Improved documentation</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <span>View Documentation</span>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span>Report an Issue</span>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span>Request a Feature</span>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Component Preview</DialogTitle>
            <DialogDescription>
              This is a preview of our dialog component.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>You can use this dialog to show important information or gather user input.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Helper for Form Demo
const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(50, { message: "Username must be 50 characters or less." }),
  email: z.string().email({ message: "Invalid email address." }),
  bio: z.string().max(200, { message: "Bio must be 200 characters or less." }).optional(),
  preferredFramework: z.enum(["react", "vue", "svelte", "angular"], { errorMap: () => ({ message: "Please select a framework." }) }),
  agreesToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." }),
  notifications: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function DemoForm() {
  const [submittedData, setSubmittedData] = React.useState<FormValues | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      preferredFramework: undefined, // Explicitly set undefined for enum if no default is selected
      agreesToTerms: false,
      notifications: false,
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    setSubmittedData(values);
    alert('Form submitted! Check console and displayed data below.');
  }

  function handleReset() {
    form.reset();
    setSubmittedData(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name (min 2, max 50 chars).
              </FormDescription>
              <FormMessage />
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
                <Input type="email" placeholder="Enter your email" {...field} />
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
                <Textarea placeholder="Tell us a little about yourself (max 200 chars)" {...field} />
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
              <FormLabel>Preferred Framework</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Enable Notifications</FormLabel>
                <FormDescription>
                  Receive updates about your account.
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Agree to terms and conditions
                </FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="flex space-x-2">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={handleReset}>Reset Form</Button>
        </div>
      </form>
      {submittedData && (
        <div className="mt-6 p-4 border rounded-md bg-muted">
          <Title level={4} className="mb-2">Submitted Data:</Title>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </Form>
  );
}

export default App;