import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [
      react(),
      // 仅在生产环境分析打包
      isProd && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html'
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@features': path.resolve(__dirname, './src/features'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    build: {
      // 代码分割策略
      rollupOptions: {
        output: {
          manualChunks: {
            // 将React相关库打包在一起
            'vendor-react': ['react', 'react-dom', 'react-hook-form'],
            // UI库和组件
            'vendor-ui': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-progress',
              '@radix-ui/react-select',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tooltip',
              'class-variance-authority',
              'clsx',
              'tailwind-merge',
              'lucide-react',
              'react-icons',
            ],
            // 表单和数据验证
            'vendor-form': ['@hookform/resolvers', 'zod'],
            // 复杂图表库
            'vendor-diagrams': ['mermaid', 'svg-pan-zoom'],
          },
          // 使用hash，更好地缓存控制
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      // 启用源码映射，方便调试
      sourcemap: !isProd,
      // 启用代码压缩
      minify: isProd ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd
        }
      },
      // 分割CSS
      cssCodeSplit: true
    },
    // 开发服务器配置
    server: {
      port: 3000,
      open: true,
      cors: true
    }
  }
})
