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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">UI Components Showcase</h1>
          <p className="text-lg text-gray-600">A collection of beautiful and functional UI components</p>
        </div>

        {/* Data Entry Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Data Entry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button styles and states</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Input Fields</CardTitle>
                <CardDescription>Text input components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Enter your name" />
                <Textarea placeholder="Enter your message" />
                <div className="flex items-center space-x-2">
                  <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  <span className="text-sm">Toggle me</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Display Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Data Display</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Avatars & Badges</CardTitle>
                <CardDescription>User avatars and status indicators</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 items-center">
                <Avatar src="https://github.com/shadcn.png" alt="User" />
                <Avatar alt="User" />
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Progress indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-500 mt-2">Loading: {progress}%</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feedback Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tooltips</CardTitle>
                <CardDescription>Information on hover</CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="flex gap-4">
                    <Tooltip content="This is a tooltip">
                      <Button>Hover me</Button>
                    </Tooltip>
                    <Tooltip content="Another tooltip">
                      <Button variant="outline">Hover me too</Button>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dialog</CardTitle>
                <CardDescription>Modal dialogs</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>
                        This is a dialog component. You can put any content here.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>Dialog content goes here...</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Navigation Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Navigation</h2>
          <Card>
            <CardHeader>
              <CardTitle>Tabs</CardTitle>
              <CardDescription>Tabbed navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="account">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                      <CardDescription>
                        Make changes to your account here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Input placeholder="Name" />
                      <Input placeholder="Email" />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>
                        Change your password here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>
                        Manage your settings here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="notifications" 
                          checked={notificationsEnabled} 
                          onCheckedChange={setNotificationsEnabled}
                        />
                        <label htmlFor="notifications">Enable notifications</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="dark-mode" 
                          checked={darkModeEnabled} 
                          onCheckedChange={setDarkModeEnabled}
                        />
                        <label htmlFor="dark-mode">Dark mode</label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default App;
