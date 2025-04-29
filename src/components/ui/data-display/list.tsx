import React from 'react';

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
}

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
  bordered?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({ children, className = '', ...props }) => {
  const itemClasses = [
    'py-2 px-4',
    'hover:bg-gray-50',
    'transition-colors',
    className
  ].filter(Boolean).join(' ');

  return (
    <li className={itemClasses} {...props}>
      {children}
    </li>
  );
};

interface ListComponent extends React.FC<ListProps> {
  Item: typeof ListItem;
}

const ListBase: React.FC<ListProps> = ({ children, bordered = false, className = '', ...props }) => {
  const listClasses = [
    'divide-y divide-gray-200',
    bordered ? 'border border-gray-200 rounded-md' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <ul className={listClasses} {...props}>
      {children}
    </ul>
  );
};

export const List = Object.assign(ListBase, { Item: ListItem }) as ListComponent; 