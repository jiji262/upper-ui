import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../../components/ui/data-display';
import { 
  Input, 
  Textarea, 
  Switch, 
  Checkbox,
  Button
} from '../../components/ui/data-entry';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/navigation/select";

// 简化组件，移除复杂的表单，避免类型错误
export const DataEntryComponents: React.FC = () => {
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [selectValue, setSelectValue] = useState<string>('');
  
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8 dark:text-gray-200">Data Entry Components</h3>
      <div className="space-y-8">
        {/* Basic Inputs */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <CardTitle>Basic Inputs</CardTitle>
            <CardDescription className="dark:text-gray-300">Text fields, textareas, and more</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Text Input</h5>
                <Input placeholder="Enter your name" className="max-w-sm" />
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Textarea</h5>
                <Textarea placeholder="Enter your message" className="max-w-sm" />
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select</h5>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="grape">Grape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toggles */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <CardTitle>Toggles & Checkboxes</CardTitle>
            <CardDescription className="dark:text-gray-300">Interactive controls for binary choices</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch 
                  id="airplane-mode" 
                  checked={switchValue} 
                  onCheckedChange={setSwitchValue} 
                />
                <label htmlFor="airplane-mode" className="text-sm font-medium dark:text-gray-300">
                  Airplane Mode: {switchValue ? 'On' : 'Off'}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="terms" 
                  checked={checkboxValue} 
                  onCheckedChange={setCheckboxValue} 
                />
                <label htmlFor="terms" className="text-sm font-medium dark:text-gray-300">
                  Accept terms and conditions
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simple Form Example */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <CardTitle>Simple Form Example</CardTitle>
            <CardDescription className="dark:text-gray-300">Basic form elements without complex validation</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
                <Input id="name" placeholder="Enter your name" />
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Your full name</p>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                <Input id="email" type="email" placeholder="you@example.com" />
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">We'll never share your email</p>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1 dark:text-gray-300">Message</label>
                <Textarea id="message" placeholder="Your message here..." />
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox id="subscribe" />
                <label htmlFor="subscribe" className="text-sm dark:text-gray-300">Subscribe to newsletter</label>
              </div>
              
              <div className="pt-4">
                <Button type="submit">Submit</Button>
                <Button variant="outline" className="ml-2">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 