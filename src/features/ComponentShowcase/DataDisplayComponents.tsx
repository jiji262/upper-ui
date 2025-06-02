import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Avatar,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../../components/ui/data-display';

export const DataDisplayComponents: React.FC = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">数据展示组件</h3>
      <div className="space-y-8">
        {/* Avatar */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Avatar 头像</CardTitle>
            <CardDescription>展示用户或事物头像的组件</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">基础头像</h5>
                <div className="flex flex-wrap gap-4 items-center">
                  <Avatar src="https://i.pravatar.cc/150?img=1" size="sm" />
                  <Avatar src="https://i.pravatar.cc/150?img=2" />
                  <Avatar src="https://i.pravatar.cc/150?img=3" size="lg" />
                  <Avatar src="https://i.pravatar.cc/150?img=4" className="h-16 w-16" />
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">带徽标的头像</h5>
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="relative">
                    <Avatar src="https://i.pravatar.cc/150?img=5" />
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                  </div>
                  <div className="relative">
                    <Avatar src="https://i.pravatar.cc/150?img=6" />
                    <Badge className="absolute -top-2 -right-2">3</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Badge 徽标</CardTitle>
            <CardDescription>在元素旁边显示数字或状态的小标签</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">基础徽标</h5>
                <div className="flex flex-wrap gap-4">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">带数字的徽标</h5>
                <div className="flex flex-wrap gap-4">
                  <Badge>1</Badge>
                  <Badge>25</Badge>
                  <Badge>99+</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Table 表格</CardTitle>
            <CardDescription>用于展示结构化数据的表格组件</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">张三</TableCell>
                  <TableCell>zhang.san@example.com</TableCell>
                  <TableCell>管理员</TableCell>
                  <TableCell className="text-right">编辑</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">李四</TableCell>
                  <TableCell>li.si@example.com</TableCell>
                  <TableCell>编辑者</TableCell>
                  <TableCell className="text-right">编辑</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">王五</TableCell>
                  <TableCell>wang.wu@example.com</TableCell>
                  <TableCell>访客</TableCell>
                  <TableCell className="text-right">编辑</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Card 卡片</CardTitle>
            <CardDescription>一个用于展示内容的容器组件</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>卡片标题</CardTitle>
                  <CardDescription>卡片的简短描述</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>卡片内容区域，可以放置各种元素</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle>带背景的卡片</CardTitle>
                  <CardDescription>卡片标题区域带背景</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <p>卡片内容区域，可以放置各种元素</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 