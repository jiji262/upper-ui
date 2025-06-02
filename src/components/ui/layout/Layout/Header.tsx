// src/components/ui/layout/Layout/Header.tsx
import React from 'react';
import './Layout.css'; // Assuming common styles are in Layout.css

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header: React.FC<HeaderProps> = ({ className, children, ...rest }) => {
  const classes = ['ant-layout-header'];
  if (className) {
    classes.push(className);
  }

  return (
    <header className={classes.join(' ')} {...rest}>
      {children}
    </header>
  );
};

Header.displayName = "Header";

export default Header;
