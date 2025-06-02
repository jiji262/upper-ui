import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../../components/ui/data-display';
import { Footer } from '../../components/ui/layout';

export const LayoutComponents: React.FC = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">布局组件</h3>
      <div className="space-y-8">
        {/* Flex Layout */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Flex 弹性布局</CardTitle>
            <CardDescription>基于 CSS Flexbox 的灵活布局组件</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">基础布局 - 水平排列</h5>
                <div className="flex gap-4">
                  <div className="bg-purple-100 border border-purple-300 rounded p-4 w-1/4">Item 1</div>
                  <div className="bg-purple-100 border border-purple-300 rounded p-4 w-1/4">Item 2</div>
                  <div className="bg-purple-100 border border-purple-300 rounded p-4 w-1/2">Item 3</div>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">基础布局 - 垂直排列</h5>
                <div className="flex flex-col gap-4">
                  <div className="bg-purple-100 border border-purple-300 rounded p-4">Item 1</div>
                  <div className="bg-purple-100 border border-purple-300 rounded p-4">Item 2</div>
                  <div className="bg-purple-100 border border-purple-300 rounded p-4">Item 3</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid Layout */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Grid 网格布局</CardTitle>
            <CardDescription>基于 CSS Grid 的二维网格布局组件</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">基础网格布局</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item 1</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item 2</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item 3</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item 4</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item 5</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item 6</div>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">复杂网格布局</h5>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-100 border border-blue-300 rounded p-4 col-span-2">Span 2</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4 col-span-2 row-span-2">Span 2x2</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4">Item</div>
                  <div className="bg-blue-100 border border-blue-300 rounded p-4 col-span-4">Full Width</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Footer 页脚</CardTitle>
            <CardDescription>适用于网页底部的页脚布局组件</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border rounded-md overflow-hidden">
              <Footer className="bg-gray-100 py-6 border-t px-4" />
            </div>
          </CardContent>
        </Card>

        {/* Divider */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>Divider 分割线</CardTitle>
            <CardDescription>用于分隔内容的水平或垂直线</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">水平分割线</h5>
                <div className="space-y-4">
                  <p>上方内容</p>
                  <div className="h-px bg-gray-200 w-full"></div>
                  <p>下方内容</p>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-gray-700">带文字的分割线</h5>
                <div className="flex items-center">
                  <div className="h-px bg-gray-200 flex-grow"></div>
                  <span className="px-4 text-gray-500 text-sm">文字内容</span>
                  <div className="h-px bg-gray-200 flex-grow"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 