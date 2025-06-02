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
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../../components/ui/navigation';

export const NavigationComponents: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [selectValue, setSelectValue] = useState("");
  
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">导航组件</h3>
      <div className="space-y-8">
        {/* Tabs */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Tabs 标签页</CardTitle>
            <CardDescription>在不同视图之间切换的标签页组件</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">标签一</TabsTrigger>
                <TabsTrigger value="tab2">标签二</TabsTrigger>
                <TabsTrigger value="tab3">标签三</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="p-4 mt-4 border rounded-md">
                <h3 className="text-lg font-medium mb-2">标签一内容</h3>
                <p>这里是标签一的内容区域，可以放置任何元素。</p>
              </TabsContent>
              <TabsContent value="tab2" className="p-4 mt-4 border rounded-md">
                <h3 className="text-lg font-medium mb-2">标签二内容</h3>
                <p>这里是标签二的内容区域，内容可以完全不同。</p>
              </TabsContent>
              <TabsContent value="tab3" className="p-4 mt-4 border rounded-md">
                <h3 className="text-lg font-medium mb-2">标签三内容</h3>
                <p>这里是标签三的内容区域，每个标签页可以包含独立的UI元素。</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Dropdown Menu */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>DropdownMenu 下拉菜单</CardTitle>
            <CardDescription>显示一组相关操作或链接的悬浮菜单</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">打开菜单</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>个人资料</DropdownMenuItem>
                  <DropdownMenuItem>账户设置</DropdownMenuItem>
                  <DropdownMenuItem>通知设置</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>退出登录</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Select */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Select 选择器</CardTitle>
            <CardDescription>从一组选项中选择一个值的下拉选择器</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">基础选择器</h5>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="选择一个选项" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">选项一</SelectItem>
                    <SelectItem value="option2">选项二</SelectItem>
                    <SelectItem value="option3">选项三</SelectItem>
                    <SelectItem value="option4">选项四</SelectItem>
                    <SelectItem value="option5">选项五</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">禁用状态</h5>
                <Select disabled>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="禁用状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">选项一</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 