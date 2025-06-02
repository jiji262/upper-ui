import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../../components/ui/data-display';
import { Button } from '../../components/ui/data-entry';
import { Title, Text } from '../../components/ui/general';
import Icon from '../../components/ui/general/Icon/Icon';

export const GeneralComponents: React.FC = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">General Components</h3>
      <div className="space-y-8">
        {/* Buttons */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button styles and variants</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">Button Variants</h5>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">Default</Button>
                  <Button>Primary</Button>
                  <Button variant="outline" className="border-dashed">Dashed</Button>
                  <Button variant="ghost">Text</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">Button Sizes</h5>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">Button States</h5>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button loading>Loading</Button>
                  <Button variant="destructive">Danger</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Icons */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Icons</CardTitle>
            <CardDescription>Visual symbols and glyphs</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <h5 className="text-sm font-medium mb-3 text-gray-700">Icon Examples</h5>
              <div className="flex flex-wrap gap-5">
                <div className="flex flex-col items-center">
                  <Icon name="UploadOutlined" className="text-2xl" />
                  <span className="text-xs mt-1">User</span>
                </div>
                <div className="flex flex-col items-center">
                  <Icon name="LeftOutlined" className="text-2xl" />
                  <span className="text-xs mt-1">Settings</span>
                </div>
                <div className="flex flex-col items-center">
                  <Icon name="RightOutlined" className="text-2xl" />
                  <span className="text-xs mt-1">Calendar</span>
                </div>
                <div className="flex flex-col items-center">
                  <Icon name="UploadOutlined" className="text-2xl" />
                  <span className="text-xs mt-1">Bell</span>
                </div>
                <div className="flex flex-col items-center">
                  <Icon name="LeftOutlined" className="text-2xl" />
                  <span className="text-xs mt-1">Mail</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Typography</CardTitle>
            <CardDescription>Text styles and formats</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Title level={1}>Heading 1</Title>
              <Title level={2}>Heading 2</Title>
              <Title level={3}>Heading 3</Title>
              <Title level={4}>Heading 4</Title>
              <Title level={5}>Heading 5</Title>
              <Text>Default paragraph text</Text>
              <Text type="secondary">Secondary text</Text>
              <Text strong>Strong text</Text>
              <Text underline>Underlined text</Text>
              <Text>Deleted text</Text>
              <Text>Marked text</Text>
              <Text>Code text</Text>
              <Text>Keyboard text</Text>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 