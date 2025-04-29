import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Components Showcase */}
        <section className="space-y-12">
          <h2 className="text-3xl font-bold text-foreground">Component Showcase</h2>
          
          {/* Buttons Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
              <Button size="sm">Small Button</Button>
              <Button size="lg">Large Button</Button>
              <Button disabled>Disabled Button</Button>
            </div>
          </div>

          {/* Cards Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Cards</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>Simple card with title and description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is the main content of the card. You can put anything here.</p>
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Card with form elements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Enter some text..." />
                  <div className="flex gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Submit</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Dialog Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Dialog</h3>
            <div className="flex flex-wrap gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Default Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Default Dialog</DialogTitle>
                    <DialogDescription>
                      This is a description of the dialog. You can put any content here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input placeholder="Enter some text..." />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Continue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Alert Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alert Dialog</DialogTitle>
                    <DialogDescription>
                      This is an alert dialog with a warning message.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-destructive">Are you sure you want to proceed?</p>
                  </div>
                  <DialogFooter>
                    <Button variant="destructive">Delete</Button>
                    <Button variant="outline">Cancel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Inputs Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Inputs</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Default input" />
              <Input placeholder="Disabled input" disabled />
              <Input placeholder="With default value" defaultValue="Default value" />
              <Input type="password" placeholder="Password input" />
              <Input type="email" placeholder="Email input" />
              <Input type="number" placeholder="Number input" />
              <Input type="search" placeholder="Search input" />
              <Input type="tel" placeholder="Phone number input" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
