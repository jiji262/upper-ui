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
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage,
  Button
} from '../../components/ui/data-entry';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/navigation/select";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Form schema
const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  bio: z.string().min(10).max(160).optional(),
  notifications: z.boolean().default(false),
  accountType: z.enum(["personal", "pro", "team"]),
});

type FormValues = z.infer<typeof formSchema>;

export const DataEntryComponents: React.FC = () => {
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [selectValue, setSelectValue] = useState<string>('');

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      notifications: false,
      accountType: "personal",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    // In a real app, you would submit the form data here
  }

  function handleReset() {
    form.reset();
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">Data Entry Components</h3>
      <div className="space-y-8">
        {/* Basic Inputs */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Basic Inputs</CardTitle>
            <CardDescription>Text fields, textareas, and more</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-2 text-gray-700">Text Input</h5>
                <Input placeholder="Enter your name" className="max-w-sm" />
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2 text-gray-700">Textarea</h5>
                <Textarea placeholder="Enter your message" className="max-w-sm" />
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2 text-gray-700">Select</h5>
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
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Toggles & Checkboxes</CardTitle>
            <CardDescription>Interactive controls for binary choices</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch id="airplane-mode" checked={switchValue} onCheckedChange={setSwitchValue} />
                <label htmlFor="airplane-mode" className="text-sm font-medium">
                  Airplane Mode: {switchValue ? 'On' : 'Off'}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="terms" checked={checkboxValue} onCheckedChange={setCheckboxValue} />
                <label htmlFor="terms" className="text-sm font-medium">
                  Accept terms and conditions
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Form Example</CardTitle>
            <CardDescription>Integrated form with validation</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your public display name.
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
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        We'll never share your email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description for your profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="pro">Professional</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of account you want to create.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Email Notifications</FormLabel>
                        <FormDescription>
                          Receive emails about account activity.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">Submit</Button>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 