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
              
              {/* Tailwind Components */}
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tailwind Style Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Buttons */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                    <CardDescription>Various button styles and variants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm">Small</Button>
                        <Button>Default</Button>
                        <Button size="lg">Large</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button disabled>Disabled</Button>
                        <Button loading>Loading</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inputs */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Inputs</CardTitle>
                    <CardDescription>Form input components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input placeholder="Enter your name" />
                      <Input placeholder="With error" error />
                      <Input placeholder="Disabled" disabled />
                      <Textarea placeholder="Enter your message" />
                      <Textarea placeholder="With error" error />
                      <Textarea placeholder="Disabled" disabled />
                    </div>
                  </CardContent>
                </Card>

                {/* Cards */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Cards</CardTitle>
                    <CardDescription>Card components with different styles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Card className="border-0 shadow-md">
                        <CardHeader>
                          <CardTitle>Shadow Card</CardTitle>
                          <CardDescription>Card with shadow effect</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>This card has a shadow effect.</p>
                        </CardContent>
                        <CardFooter>
                          <Button>Action</Button>
                        </CardFooter>
                      </Card>

                      <Card className="border-2 border-gray-200 shadow-none">
                        <CardHeader>
                          <CardTitle>Bordered Card</CardTitle>
                          <CardDescription>Card with border style</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>This card has a border and no shadow.</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline">Action</Button>
                        </CardFooter>
                      </Card>

                      <Card className="bg-gray-50 border-0 shadow-none">
                        <CardHeader>
                          <CardTitle>Flat Card</CardTitle>
                          <CardDescription>Card with background color</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>This card has a light background and no shadow.</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="ghost">Action</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Typography - NEW SECTION */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Typography</CardTitle>
                    <CardDescription>Text elements and styles. Click titles to see `asChild` in action.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Title level={1} onClick={() => alert('Clicked H1')} className="cursor-pointer hover:text-primary">Title H1 (Clickable)</Title>
                    <Title level={2} className="text-purple-600">Title H2 (Custom Color)</Title>
                    <Title level={3}>Title H3</Title>
                    <Title level={4}>Title H4</Title>
                    <Title level={5}>Title H5</Title>
                    <Paragraph className="text-slate-700 dark:text-slate-300">
                      This is a paragraph of text, demonstrating a slightly different color. It can be used to display longer form content,
                      like describing features or providing detailed information. You can also <Link href="#" className="font-bold hover:text-destructive">include styled links</Link> within your text.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Paragraph>
                    <Paragraph>
                      <Text asChild strong>
                        <label htmlFor="demo-input">This strong text is a label (using asChild)</label>
                      </Text>
                      <Input id="demo-input" placeholder="Demo input" className="mt-1"/>
                    </Paragraph>
                    <Text>This is a general text element.</Text>
                    <Text strong italic size="lg">Large, strong, and italic text.</Text>
                    <Text code type="success">Successful code output.</Text>
                    <Text mark type="warning" size="sm">Small marked warning.</Text>
                    <Text disabled>This text is disabled.</Text>
                    <Text type="secondary">This is secondary text, useful for sub-details.</Text>
                    <Text type="success">This is success text, perhaps for a success message.</Text>
                    <Text type="warning">This is warning text, for alerts or cautions.</Text>
                    <Text type="danger" strong>This is strong danger text.</Text>
                    <Text size="sm">Small text, for fine print.</Text>
                    <Text size="lg" className="text-blue-500">Large text with custom color.</Text>
                    <Link href="https://example.com" target="_blank">External Link (opens in new tab)</Link>
                  </CardContent>
                </Card>

                {/* Form - NEW SECTION */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Form Example</CardTitle>
                    <CardDescription>Using new Form components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DemoForm />
                  </CardContent>
                </Card>

                {/* Feedback Components */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Feedback</CardTitle>
                    <CardDescription>Progress, alerts and badges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Progress value={progress} className="w-full" />
                        <Progress value={75} className="w-full" />
                        <Progress value={100} className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <Alert variant="default">This is a default alert</Alert>
                        <Alert variant="success">Operation completed successfully!</Alert>
                        <Alert variant="warning">This is a warning message</Alert>
                        <Alert variant="destructive">Something went wrong!</Alert>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                      </div>
                      {/* Skeleton Demo */}
                      <div className="space-y-2 pt-4">
                        <Title level={4}>Skeleton Loader Examples</Title>
                        <Paragraph className="text-sm text-muted-foreground">
                          Skeletons are used to provide a visual placeholder while content is loading.
                        </Paragraph>
                        
                        <Text strong>Basic List Item:</Text>
                        <div className="flex items-center space-x-4 p-2 border rounded-md">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>

                        <Text strong className="pt-2 block">Card Placeholder:</Text>
                        <Card>
                          <CardHeader>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                          </CardContent>
                          <CardFooter>
                            <Skeleton className="h-10 w-24" />
                          </CardFooter>
                        </Card>

                        <Text strong className="pt-2 block">Full Width Block:</Text>
                        <Skeleton className="h-8 w-full mt-2" />
                        <Text strong className="pt-2 block">Custom Shape (Button like):</Text>
                        <Skeleton className="h-10 w-32 rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Components */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Navigation</CardTitle>
                    <CardDescription>Tabs and dialogs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Tabs defaultValue="preview">
                        <TabsList>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                          <TabsTrigger value="code">Code</TabsTrigger>
                          <TabsTrigger value="docs">Docs</TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview">
                          <div className="p-4">
                            <p>Preview content goes here</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="code">
                          <div className="p-4">
                            <p>Code content goes here</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="docs">
                          <div className="p-4">
                            <p>Documentation content goes here</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                      <div className="flex justify-center space-x-2">
                        <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">Open Menu</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Keyboard className="mr-2 h-4 w-4" />
                                <span>Keyboard shortcuts</span>
                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Team</span>
                              </DropdownMenuItem>
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  <span>Invite users</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem>
                                      <Mail className="mr-2 h-4 w-4" />
                                      <span>Email</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageSquare className="mr-2 h-4 w-4" />
                                      <span>Message</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <PlusCircle className="mr-2 h-4 w-4" />
                                      <span>More...</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem>
                              Status Bar
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuRadioGroup value={"bottom" /* Replace with state */}>
                              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                              <span>API (Disabled)</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Display Components */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Data Display</CardTitle>
                    <CardDescription>Avatar and tooltips</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar src="https://i.pravatar.cc/150?img=1" size="sm" />
                        <Avatar src="https://i.pravatar.cc/150?img=2" />
                        <Avatar src="https://i.pravatar.cc/150?img=3" size="lg" />
                        <Avatar>JD</Avatar>
                      </div>
                      <div className="flex items-center space-x-4">
                        <TooltipProvider>
                          <Tooltip content="This is a tooltip!">
                            <Button variant="outline">Hover Me</Button>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Table Demo */}
                      <div className="pt-4">
                        <Title level={4} className="mb-2">Enhanced Table</Title>
                        <div className="max-h-96 overflow-y-auto rounded-md border">
                          <Table>
                            <TableCaption>A list of your recent invoices. (Scroll for more)</TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...Array(15)].map((_, i) => (
                                <TableRow key={`INV00${i + 1}`} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                                  <TableCell className="font-medium">INV00{i + 1}</TableCell>
                                  <TableCell>
                                    <Badge variant={i % 3 === 0 ? "success" : i % 3 === 1 ? "warning" : "default"}>
                                      {i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Unpaid"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>Customer {String.fromCharCode(65 + i)}</TableCell>
                                  <TableCell>{i % 2 === 0 ? "Credit Card" : "PayPal"}</TableCell>
                                  <TableCell className="text-right">${(Math.random() * 200 + 50).toFixed(2)}</TableCell>
                                  <TableCell className="text-center">
                                    <Button variant="outline" size="sm" onClick={() => alert(`Viewing INV00${i+1}`)}>View</Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell colSpan={5} className="text-right font-medium">Total Amount (Visible)</TableCell>
                                <TableCell className="text-right font-bold">$XXXX.XX</TableCell>{/* Replace with actual calculation if needed */}
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Ant Design Components */}
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upper UI Style Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buttons */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Upper UI Buttons</CardTitle>
                    <CardDescription>Various button styles and variants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline">Default</Button>
                        <Button>Primary</Button>
                        <Button variant="outline" className="border-dashed">Dashed</Button>
                        <Button variant="ghost">Text</Button>
                        <Button variant="link">Link</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm">Small</Button>
                        <Button>Default</Button>
                        <Button size="lg">Large</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button disabled>Disabled</Button>
                        <Button loading>Loading</Button>
                        <Button variant="destructive">Danger</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inputs */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Upper UI Inputs</CardTitle>
                    <CardDescription>Form input components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <InputAnt placeholder="Basic usage" />
                      <InputAnt size="large" placeholder="Large size" error={false} />
                      <InputAnt placeholder="Error" error={true} />
                      <InputAnt placeholder="Warning" error={true} />
                      <div className="flex items-center">
                        <span className="mr-2">http://</span>
                        <InputAnt placeholder="Website" />
                        <span className="ml-2">.com</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">￥</span>
                        <InputAnt placeholder="Price" />
                        <span className="ml-2">RMB</span>
                      </div>
                      <InputAnt placeholder="Clearable input" />
                      <InputAnt placeholder="Disabled" disabled />
                      
                      <TextareaAnt placeholder="Basic usage" />
                      <TextareaAnt showCount maxLength={100} placeholder="With character count" />
                      <TextareaAnt status="error" placeholder="Error" />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Checkbox & Select */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Upper UI Form Controls</CardTitle>
                    <CardDescription>Checkboxes and Selects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <CheckboxAnt label="Checkbox" />
                        <CheckboxAnt 
                          label="Controlled Checkbox"
                          checked={checkboxValue} 
                          onChange={(e) => setCheckboxValue(e.target.checked)}
                        />
                        <CheckboxAnt label="Disabled" disabled />
                        <CheckboxAnt label="Indeterminate" indeterminate />
                      </div>
                      
                      <div className="space-y-2">
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
                        <SelectAnt
                          mode="multiple"
                          options={[
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                            { label: 'Option 3', value: '3' },
                          ]}
                          placeholder="Select multiple"
                        />
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
                
                {/* Icons */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Upper UI Icons</CardTitle>
                    <CardDescription>Simple icon components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex flex-col items-center">
                        <Icon name="UploadOutlined" style={{ fontSize: '24px' }} />
                        <span className="text-sm mt-1">Upload</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Icon name="LeftOutlined" style={{ fontSize: '24px' }} />
                        <span className="text-sm mt-1">Left</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Icon name="RightOutlined" style={{ fontSize: '24px' }} />
                        <span className="text-sm mt-1">Right</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Icon name="UploadOutlined" style={{ fontSize: '24px', color: 'purple' }} />
                        <span className="text-sm mt-1">Custom Color</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Empty Component */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Upper UI Empty</CardTitle>
                    <CardDescription>Empty state placeholder</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Empty description="No data available" />
                      <Empty description="No items found" />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Descriptions Component */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Upper UI Descriptions</CardTitle>
                    <CardDescription>Display detailed information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Descriptions title="User Information" bordered>
                      <Descriptions.Item label="Name">John Doe</Descriptions.Item>
                      <Descriptions.Item label="Email">john.doe@example.com</Descriptions.Item>
                      <Descriptions.Item label="Address">123 Main St, City</Descriptions.Item>
                      <Descriptions.Item label="Status">Active</Descriptions.Item>
                    </Descriptions>
                  </CardContent>
                </Card>
                
                {/* Modal Component */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Upper UI Modal</CardTitle>
                    <CardDescription>Dialog box for important content</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <Button key="submit" type="primary" onClick={() => setModalOpen(false)}>
                          OK
                        </Button>,
                      ]}
                    >
                      <p>This is a modal dialog with upper-ui styling. It has black borders, box shadows, and purple accents.</p>
                      <p>You can add any content here.</p>
                    </Modal>
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