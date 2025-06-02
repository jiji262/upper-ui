// src/components/ui/navigation/Breadcrumb/Breadcrumb.tsx
import React from 'react';
import BreadcrumbItem, { BreadcrumbItemProps } from './BreadcrumbItem';
import './Breadcrumb.css';

export interface Route {
  path: string;
  breadcrumbName: string;
  children?: Array<Omit<Route, 'children'>>; // Simplified, AntD might have more complex routing structure
  href?: string; // Allow overriding path with a direct href
}

interface BreadcrumbProps {
  separator?: React.ReactNode;
  params?: Record<string, string>; // For dynamic routes, e.g., /users/:id
  routes?: Route[];
  itemRender?: (
    route: Route,
    params: Record<string, string>,
    routes: Route[],
    paths: string[]
  ) => React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Default itemRender function
const defaultItemRender = (
  route: Route,
  _params: Record<string, string>,
  routes: Route[],
  paths: string[]
): React.ReactNode => {
  const isLast = routes.indexOf(route) === routes.length - 1;
  const hasPath = route.path || route.href; // Check if there's a path or href

  // Replace params in path
  let path = route.path || '';
  // This is a very basic param replacement, a more robust solution might be needed
  // For example, if params are like { id: '123' } and path is '/user/:id' -> '/user/123'
  // This simplified version doesn't handle complex param matching or generation of `paths` array well.
  // For storybook purposes, we'll keep it simple.

  const href = route.href || path; // Use route.href if provided, otherwise use the path

  return isLast || !hasPath ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <a href={href || '#' + paths.join('/')}>{route.breadcrumbName}</a>
  );
};


const Breadcrumb: React.FC<BreadcrumbProps> = ({
  separator = '/',
  params = {},
  routes,
  itemRender = defaultItemRender,
  children,
  className,
  style,
}) => {
  let crumbs;

  if (routes && routes.length > 0) {
    // Generate breadcrumbs from routes prop
    // This simplified version doesn't fully construct the `paths` array as AntD does for nested routes.
    // It assumes `paths` might be just the current route's path for simplicity here.
    crumbs = routes.map((route, index) => {
      const path = route.path || ''; // Simplified path for itemRender
      const isLast = index === routes.length - 1;
      const renderedItem = itemRender(route, params, routes, [path]);
      
      return (
        <BreadcrumbItem key={route.path || index} separator={separator} isLast={isLast}>
          {renderedItem}
        </BreadcrumbItem>
      );
    });
  } else {
    // Generate breadcrumbs from children
    crumbs = React.Children.map(children, (element, index) => {
      if (!React.isValidElement(element)) {
        return null;
      }
      // Check if the element is a BreadcrumbItem
      // Note: Direct type comparison (element.type === BreadcrumbItem) might not work with HOCs or other wrappers.
      // AntD uses a displayName or similar check.
      const isBreadcrumbItem = (element.type as React.ComponentType)?.displayName === 'BreadcrumbItem';

      if (!isBreadcrumbItem) {
        console.warn("Breadcrumb children should be Breadcrumb.Item components.");
        // Optionally wrap non-BreadcrumbItem children, or filter them out
        // For now, we'll try to render them, but they won't get separator/isLast logic automatically
        // return element; 
      }

      return React.cloneElement(element as React.ReactElement<BreadcrumbItemProps>, {
        separator,
        isLast: index === React.Children.count(children) - 1,
        key: index, // Add key for list rendering
      });
    });
  }

  const breadcrumbClasses = ['ant-breadcrumb', className].filter(Boolean).join(' ');

  return (
    <nav aria-label="breadcrumb" className={breadcrumbClasses} style={style}>
      <ol>{crumbs}</ol>
    </nav>
  );
};

// Assign BreadcrumbItem as a static property for Breadcrumb.Item usage
(Breadcrumb as any).Item = BreadcrumbItem;

export default Breadcrumb;
