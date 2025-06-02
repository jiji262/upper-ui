import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from '../../components/ui/data-display';
import { Button } from '../../components/ui/data-entry';
import {
  Progress, 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  Alert,
  Skeleton,
  DialogClose,
  Tooltip,
  TooltipProvider
} from '../../components/ui/feedback';

export const FeedbackComponents: React.FC = () => {
  const [progress, setProgress] = React.useState(13);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">Feedback Components</h3>
      <div className="space-y-8">
        {/* Progress */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Progress</CardTitle>
            <CardDescription>Show task or operation progress</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-2 text-gray-700">Basic Progress</h5>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-500 mt-2">Current progress: {progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tooltips */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Tooltips</CardTitle>
            <CardDescription>Display informative text when users hover over an element</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <TooltipProvider>
                <Tooltip content="I'm a tooltip!">
                  <Button variant="outline">Hover Me</Button>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Dialog</CardTitle>
            <CardDescription>Modal dialogs for important interactions</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Document</DialogTitle>
                    <DialogDescription>
                      Anyone with the link can view this document.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2 py-4">
                    <div className="grid flex-1 gap-2">
                      <p className="text-sm text-muted-foreground">
                        This is an example of a dialog component. You can use it for various interactions.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="button">Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Alert */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Alert</CardTitle>
            <CardDescription>Feedback messages for various states</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Alert variant="default">
                <h4 className="font-medium">Information</h4>
                <p>This is an informational message.</p>
              </Alert>
              <Alert variant="success">
                <h4 className="font-medium">Success</h4>
                <p>Operation completed successfully.</p>
              </Alert>
              <Alert variant="warning">
                <h4 className="font-medium">Warning</h4>
                <p>Proceed with caution.</p>
              </Alert>
              <Alert variant="destructive">
                <h4 className="font-medium">Error</h4>
                <p>An error has occurred.</p>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Skeleton</CardTitle>
            <CardDescription>Loading placeholders</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 