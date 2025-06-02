// src/components/ui/navigation/Anchor/AnchorLink.tsx
import React, { useContext } from 'react';
import { AnchorContext } from './Anchor'; // Assuming Anchor.tsx provides this context

export interface AnchorLinkProps {
  href: string;
  title: React.ReactNode;
  children?: React.ReactNode; // For nested links
  className?: string;
  target?: string;
}

const AnchorLink: React.FC<AnchorLinkProps> = ({
  href,
  title,
  children,
  className,
  target,
}) => {
  const context = useContext(AnchorContext);

  if (!context) {
    // This might happen if AnchorLink is used outside an Anchor.
    // Or, provide a default behavior or error.
    return (
      <a href={href} className={className} target={target}>
        {title}
        {children && <div className="ant-anchor-link-children">{children}</div>}
      </a>
    );
  }

  const { registerLink, unregisterLink, activeLink, handleClick } = context;
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (href) {
      registerLink(href, linkRef);
    }
    return () => {
      if (href) {
        unregisterLink(href);
      }
    };
  }, [href, registerLink, unregisterLink, linkRef]);

  const isActive = activeLink === href;
  const linkClasses = [
    'ant-anchor-link',
    isActive ? 'ant-anchor-link-active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default browser scroll
    handleClick(e, href);
  };

  return (
    <div className={`ant-anchor-link-item ${isActive ? 'ant-anchor-link-item-active' : ''}`}>
      <a
        ref={linkRef}
        href={href}
        title={typeof title === 'string' ? title : undefined}
        className={linkClasses}
        onClick={handleLinkClick}
        target={target}
      >
        {title}
      </a>
      {children && <div className="ant-anchor-link-children">{children}</div>}
    </div>
  );
};

export default AnchorLink;
