// src/components/ui/layout/Layout/Footer.tsx
import React from 'react';
import './Layout.css'; // Assuming common styles are in Layout.css

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer: React.FC<FooterProps> = ({ className, children, ...rest }) => {
  const classes = ['ant-layout-footer'];
  if (className) {
    classes.push(className);
  }

  return (
    <footer className={classes.join(' ')} {...rest}>
      {children}
    </footer>
  );
};

Footer.displayName = "Footer";

export default Footer;
