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

// 添加错误边界组件
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("组件渲染错误:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <h3 className="font-bold">渲染错误</h3>
          <p>{this.state.error?.message || '未知错误'}</p>
          <p>{this.state.error?.stack}</p>
          <button 
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md" 
            onClick={() => this.setState({ hasError: false, error: null })}>
            重试
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export const ComponentShowcase: React.FC = () => {
  // 初始化为明亮模式，不跟随系统
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('upper-ui-theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      
      // 默认明亮模式，不再检查系统偏好
      return false;
    }
    return false;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme());
  const [activeTab, setActiveTab] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // 添加调试日志
  useEffect(() => {
    console.log("ComponentShowcase 组件已加载");
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('upper-ui-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('upper-ui-theme', 'light');
    }
  }, [darkMode]);

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // 添加调试组件内容日志
  console.log('准备渲染组件:', { activeTab, darkMode });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 dark:bg-gray-950">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 bg-card text-card-foreground shadow-sm transition-colors duration-300 backdrop-blur-sm dark:bg-gray-900/90 dark:border-b dark:border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar src="https://i.pravatar.cc/150?img=1" size="lg" />
              <div>
                <h1 className="text-2xl font-bold">Upper UI</h1>
                <p className="text-sm text-muted-foreground">现代化组件库</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <input
                type="text"
                placeholder="搜索组件..."
                className="px-4 py-2 rounded-lg border bg-background border-input text-foreground focus:ring-1 focus:ring-ring focus:border-primary transition-colors duration-300 dark:bg-gray-800"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              
              <a href="https://github.com/your-repo/upper-ui" target="_blank" rel="noopener" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300">
                GitHub
              </a>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="dark-mode" 
                  checked={darkMode} 
                  onCheckedChange={toggleDarkMode}
                />
                <label htmlFor="dark-mode" className="text-sm text-muted-foreground cursor-pointer">
                  {darkMode ? '明亮模式' : '暗黑模式'}
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
            <aside className="md:w-64 flex-shrink-0 bg-card text-card-foreground rounded-xl shadow-sm p-6 mb-6 md:mb-0 md:sticky md:top-24 md:self-start overflow-auto max-h-[calc(100vh-7rem)] transition-colors duration-300 dark:bg-gray-900 dark:border dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4">组件分类</h3>
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
              
              <div className="mt-8 pt-6 border-t border-border dark:border-gray-800">
                <h4 className="text-md font-semibold mb-3">快速入门</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-muted text-muted-foreground rounded-md transition-colors duration-300 dark:bg-gray-800 dark:text-gray-300">
                    <h5 className="font-medium text-foreground dark:text-gray-200">安装</h5>
                    <p className="text-sm">npm install upper-ui</p>
                  </div>
                  <div className="p-3 bg-muted text-muted-foreground rounded-md transition-colors duration-300 dark:bg-gray-800 dark:text-gray-300">
                    <h5 className="font-medium text-foreground dark:text-gray-200">导入</h5>
                    <p className="text-sm">import {`{ Button }`} from 'upper-ui'</p>
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
            <section className="bg-card text-card-foreground rounded-xl shadow-sm p-8 mb-8 transition-colors duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border dark:border-gray-800">
              <div className="md:flex justify-between items-center">
                <div className="md:w-full mb-6 md:mb-0">
                  <h2 className="text-3xl font-bold mb-4 dark:text-violet-100">现代化UI组件库</h2>
                  <p className="text-lg text-muted-foreground mb-6 dark:text-gray-300">
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
            <section id="components" className="bg-card text-card-foreground rounded-xl shadow-sm p-8 transition-colors duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-8 text-center dark:text-violet-100">组件详情</h2>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 bg-muted/50 dark:bg-gray-800">
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="data-[state=active]:bg-background dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-100 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:data-[state=active]:shadow-none"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="dark:bg-transparent">
                  <TabsContent value="general">
                    <ErrorBoundary>
                      <GeneralComponents />
                    </ErrorBoundary>
                  </TabsContent>
                  <TabsContent value="data-entry">
                    <ErrorBoundary>
                      <DataEntryComponents />
                    </ErrorBoundary>
                  </TabsContent>
                  <TabsContent value="data-display">
                    <ErrorBoundary>
                      <DataDisplayComponents />
                    </ErrorBoundary>
                  </TabsContent>
                  <TabsContent value="feedback">
                    <ErrorBoundary>
                      <FeedbackComponents />
                    </ErrorBoundary>
                  </TabsContent>
                  <TabsContent value="navigation">
                    <ErrorBoundary>
                      <NavigationComponents />
                    </ErrorBoundary>
                  </TabsContent>
                  <TabsContent value="layout">
                    <ErrorBoundary>
                      <LayoutComponents />
                    </ErrorBoundary>
                  </TabsContent>
                </div>
              </Tabs>
            </section>
            
            {/* 特性说明 */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6 transition-colors duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border dark:border-gray-800">
                <h3 className="text-xl font-bold mb-3 dark:text-violet-100">高度可定制</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  基于 Tailwind CSS 构建，可轻松定制主题和样式，适应各种设计需求。
                </p>
              </div>
              <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6 transition-colors duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border dark:border-gray-800">
                <h3 className="text-xl font-bold mb-3 dark:text-violet-100">类型安全</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  完全使用 TypeScript 开发，提供完整类型定义，确保开发过程类型安全。
                </p>
              </div>
              <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6 transition-colors duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border dark:border-gray-800">
                <h3 className="text-xl font-bold mb-3 dark:text-violet-100">无障碍设计</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  遵循 WAI-ARIA 规范，确保所有组件对所有用户都可访问。
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
      
      {/* 页脚 */}
      <footer className="bg-card text-muted-foreground mt-16 py-12 border-t border-border transition-colors duration-300 dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground dark:text-violet-200">Upper UI</h4>
              <p className="text-sm dark:text-gray-400">优雅、高效的React组件库</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground dark:text-violet-200">资源</h4>
              <ul className="space-y-2 text-sm dark:text-gray-400">
                <li>文档指南</li>
                <li>组件 API</li>
                <li>示例与模板</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground dark:text-violet-200">社区</h4>
              <ul className="space-y-2 text-sm dark:text-gray-400">
                <li>GitHub</li>
                <li>Discord</li>
                <li>Twitter</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border dark:border-gray-800 text-center text-sm dark:text-gray-500">
            <p>&copy; 2023 Upper UI. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 