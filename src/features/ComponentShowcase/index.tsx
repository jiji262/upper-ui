import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/data-entry';
import { Avatar, Badge } from '../../components/ui/data-display';
import { Switch } from '../../components/ui/data-entry';
import { GeneralComponents } from './GeneralComponents';
import { DataEntryComponents } from './DataEntryComponents';
import { FeedbackComponents } from './FeedbackComponents';
import { DataDisplayComponents } from './DataDisplayComponents';
import { NavigationComponents } from './NavigationComponents';
import { LayoutComponents } from './LayoutComponents';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/navigation';

export const ComponentShowcase: React.FC = () => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // 响应式布局
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 组件分类
  const categories = [
    { id: "general", name: "通用", count: 8 },
    { id: "data-entry", name: "数据录入", count: 12 },
    { id: "data-display", name: "数据展示", count: 9 },
    { id: "feedback", name: "反馈", count: 7 },
    { id: "navigation", name: "导航", count: 5 },
    { id: "layout", name: "布局", count: 6 }
  ];

  return (
    <div className={`min-h-screen ${darkModeEnabled ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* 顶部导航栏 */}
      <header className={`sticky top-0 z-10 ${darkModeEnabled ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar src="https://i.pravatar.cc/150?img=1" size="lg" />
              <div>
                <h1 className={`text-2xl font-bold ${darkModeEnabled ? 'text-white' : 'text-gray-900'}`}>Upper UI</h1>
                <p className={`text-sm ${darkModeEnabled ? 'text-gray-300' : 'text-gray-500'}`}>现代化组件库</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <input
                type="text"
                placeholder="搜索组件..."
                className={`px-4 py-2 rounded-lg border ${darkModeEnabled ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              
              <a href="https://github.com/your-repo/upper-ui" target="_blank" rel="noopener" className={`text-sm font-medium ${darkModeEnabled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                GitHub
              </a>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="dark-mode" 
                  checked={darkModeEnabled} 
                  onCheckedChange={setDarkModeEnabled}
                />
                <label htmlFor="dark-mode" className={`text-sm ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  {darkModeEnabled ? '明亮模式' : '暗黑模式'}
                </label>
              </div>
            </div>
            
            <Button variant="ghost" className="md:hidden" onClick={() => setShowSidebar(!showSidebar)}>
              {showSidebar ? '关闭菜单' : '打开菜单'}
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 侧边栏 */}
          {showSidebar && (
            <aside className={`md:w-64 flex-shrink-0 ${darkModeEnabled ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6 md:mb-0 md:sticky md:top-24 md:self-start overflow-auto max-h-[calc(100vh-7rem)]`}>
              <h3 className={`text-xl font-bold ${darkModeEnabled ? 'text-white' : 'text-gray-900'} mb-4`}>组件分类</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <Button 
                      variant={activeTab === category.id ? "default" : "ghost"}
                      onClick={() => setActiveTab(category.id)}
                      className="w-full justify-between"
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </Button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t">
                <h4 className={`text-md font-semibold ${darkModeEnabled ? 'text-white' : 'text-gray-900'} mb-3`}>快速入门</h4>
                <div className="space-y-3">
                  <div className={`p-3 ${darkModeEnabled ? 'bg-gray-700' : 'bg-gray-50'} rounded-md`}>
                    <h5 className={`font-medium ${darkModeEnabled ? 'text-white' : 'text-gray-900'}`}>安装</h5>
                    <p className={`text-sm ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>npm install upper-ui</p>
                  </div>
                  <div className={`p-3 ${darkModeEnabled ? 'bg-gray-700' : 'bg-gray-50'} rounded-md`}>
                    <h5 className={`font-medium ${darkModeEnabled ? 'text-white' : 'text-gray-900'}`}>导入</h5>
                    <p className={`text-sm ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>import {`{ Button }`} from 'upper-ui'</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">查看文档</Button>
                </div>
              </div>
            </aside>
          )}

          {/* 主内容 */}
          <main className="flex-1">
            {/* 欢迎区 */}
            <section className={`${darkModeEnabled ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-8 mb-8`}>
              <div className="md:flex justify-between items-center">
                <div className="md:w-full mb-6 md:mb-0">
                  <h2 className={`text-3xl font-bold ${darkModeEnabled ? 'text-white' : 'text-gray-900'} mb-4`}>现代化UI组件库</h2>
                  <p className={`text-lg ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                    Upper UI 提供精心设计的组件，帮助开发者快速构建美观、高效的用户界面。我们的组件库包含通用组件、数据输入组件、数据展示组件、反馈组件、导航组件和布局组件六大类，覆盖了Web应用开发的各种场景需求。
                  </p>
                  <div className="flex space-x-4">
                    <Button size="lg">快速开始</Button>
                    <Button variant="outline" size="lg">查看示例</Button>
                  </div>
                </div>
              </div>
            </section>

            {/* 组件展示 */}
            <section id="components" className={`${darkModeEnabled ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-8`}>
              <h2 className={`text-2xl font-bold ${darkModeEnabled ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>组件详情</h2>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
                  {categories.map(category => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="general">
                  <GeneralComponents />
                </TabsContent>
                <TabsContent value="data-entry">
                  <DataEntryComponents />
                </TabsContent>
                <TabsContent value="data-display">
                  <DataDisplayComponents />
                </TabsContent>
                <TabsContent value="feedback">
                  <FeedbackComponents />
                </TabsContent>
                <TabsContent value="navigation">
                  <NavigationComponents />
                </TabsContent>
                <TabsContent value="layout">
                  <LayoutComponents />
                </TabsContent>
              </Tabs>
            </section>
            
            {/* 特性说明 */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className={`${darkModeEnabled ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
                <h3 className={`text-xl font-bold ${darkModeEnabled ? 'text-white' : 'text-gray-900'} mb-3`}>高度可定制</h3>
                <p className={`text-sm ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  基于 Tailwind CSS 构建，可轻松定制主题和样式，适应各种设计需求。
                </p>
              </div>
              <div className={`${darkModeEnabled ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
                <h3 className={`text-xl font-bold ${darkModeEnabled ? 'text-white' : 'text-gray-900'} mb-3`}>类型安全</h3>
                <p className={`text-sm ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  完全使用 TypeScript 开发，提供完整类型定义，确保开发过程类型安全。
                </p>
              </div>
              <div className={`${darkModeEnabled ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
                <h3 className={`text-xl font-bold ${darkModeEnabled ? 'text-white' : 'text-gray-900'} mb-3`}>无障碍设计</h3>
                <p className={`text-sm ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  遵循 WAI-ARIA 规范，确保所有组件对所有用户都可访问。
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
      
      {/* 页脚 */}
      <footer className={`${darkModeEnabled ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} mt-16 py-12 border-t ${darkModeEnabled ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Upper UI</h4>
              <p className="text-sm">优雅、高效的React组件库</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">资源</h4>
              <ul className="space-y-2 text-sm">
                <li>文档指南</li>
                <li>组件 API</li>
                <li>示例与模板</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">社区</h4>
              <ul className="space-y-2 text-sm">
                <li>GitHub</li>
                <li>Discord</li>
                <li>Twitter</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm">
            <p>&copy; 2023 Upper UI. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 