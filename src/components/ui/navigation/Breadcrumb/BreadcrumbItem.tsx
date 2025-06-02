// src/components/ui/navigation/Breadcrumb/BreadcrumbItem.tsx
import React from 'react';

export interface BreadcrumbItemProps {
  href?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
  className?: string;
  children?: React.ReactNode;
  // Internal prop, not for public use
  isLast?: boolean;
  separator?: React.ReactNode;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  href,
  target,
  onClick,
  className,
  children,
  isLast,
  separator, // This prop is passed down from Breadcrumb
}) => {
  const linkProps = {
    href,
    target,
    onClick,
    className: 'ant-breadcrumb-link',
  };

  let itemContent: React.ReactNode;
  if (href) {
    itemContent = <a {...linkProps}>{children}</a>;
  } else {
    itemContent = <span {...linkProps} onClick={onClick} role="link" tabIndex={0}>{children}</span>;
  }

  const itemClasses = ['ant-breadcrumb-item', className].filter(Boolean).join(' ');

  if (isLast) {
    return <span className={itemClasses}>{itemContent}</span>;
  }

  return (
    <span className={itemClasses}>
      {itemContent}
      {separator && <span className="ant-breadcrumb-separator">{separator}</span>}
    </span>
  );
};

BreadcrumbItem.displayName = 'BreadcrumbItem'; // For type checking in Breadcrumb

export default BreadcrumbItem;
