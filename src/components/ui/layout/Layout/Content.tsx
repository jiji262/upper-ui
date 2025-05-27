// src/components/ui/layout/Layout/Content.tsx
import React from 'react';
import './Layout.css'; // Assuming common styles are in Layout.css

interface ContentProps extends React.HTMLAttributes<HTMLElement> {}

const Content: React.FC<ContentProps> = ({ className, children, ...rest }) => {
  const classes = ['ant-layout-content'];
  if (className) {
    classes.push(className);
  }

  return (
    <main className={classes.join(' ')} {...rest}>
      {children}
    </main>
  );
};

Content.displayName = "Content";

export default Content;
