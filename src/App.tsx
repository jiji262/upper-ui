import React from 'react';
import { Button } from './components/ui/data-entry/button';
import { Input } from './components/ui/data-entry/input';
import { Textarea } from './components/ui/data-entry/textarea';
import { Switch } from './components/ui/data-entry/switch';
import { Avatar } from './components/ui/data-display/avatar';
import { Badge } from './components/ui/data-display/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/data-display/card';
import { Progress } from './components/ui/feedback/progress';
import { Tooltip, TooltipProvider } from './components/ui/feedback/tooltip';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/feedback/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/navigation/tabs';
import { Alert } from './components/ui/feedback/alert';

function App() {
  const [progress, setProgress] = React.useState(13);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <div className="flex justify-center">
                        <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
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
                          <Tooltip content="This is a tooltip">
                            <Button>Hover me</Button>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip content="This is a longer tooltip message that spans multiple lines">
                            <Button>Long tooltip</Button>
                          </Tooltip>
                        </TooltipProvider>
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
    </div>
  );
}

export default App; 