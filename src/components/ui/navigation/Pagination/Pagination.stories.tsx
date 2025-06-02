// src/components/ui/navigation/Pagination/Pagination.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Pagination from './Pagination';
import Icon from '../../general/Icon'; // Assuming Icon component is available

// Mock Select component for story purposes if not available or to simplify
const MockSelect: React.FC<any> = ({ value, onChange, options, disabled, className }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={className}
    style={{ marginLeft: '8px', marginRight: '8px', padding: '5px' }}
  >
    {options.map((opt: {value: string, label: string}) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// Replace actual Select import in Pagination.tsx with this mock for stories,
// or ensure a simple Select is available that matches the expected props.
// For this story, we assume Pagination.tsx might internally use a Select-like component.
// If Pagination directly imports a specific Select, that needs to be handled.
// The Pagination.tsx provided seems to expect a Select from '../../data-entry/Select'.
// We'll assume it's okay to use a mock here for storybook running independently.

export default {
  title: 'Navigation/Pagination',
  component: Pagination,
  argTypes: {
    total: { control: 'number', defaultValue: 500 },
    current: { control: 'number' }, // Controlled by story state
    pageSize: { control: 'number' }, // Controlled by story state
    showSizeChanger: { control: 'boolean', defaultValue: true },
    showQuickJumper: { control: 'boolean', defaultValue: true },
    simple: { control: 'boolean', defaultValue: false },
    disabled: { control: 'boolean', defaultValue: false },
    // itemRender, showTotal are complex, shown in specific stories
  },
  // If Pagination component itself imports Select, and that Select is not available during storybook build,
  // it might fail. This story assumes either Select is globally available/mocked, or Pagination handles its absence.
  // For now, we'll pass the MockSelect to Pagination if it accepts a SelectComponent prop,
  // or rely on module mocking if Pagination imports Select directly.
  // The provided Pagination.tsx imports Select directly, so for this story to work without error,
  // we would typically use webpack aliases or jest mocks to replace the actual Select import.
  // Let's assume for now the environment handles this or we modify Pagination to accept a Select prop.
} as Meta<typeof Pagination>;

const Template: StoryFn<typeof Pagination> = (args) => {
  const [current, setCurrent] = useState(args.current || args.defaultCurrent || 1);
  const [pageSize, setPageSize] = useState(args.pageSize || args.defaultPageSize || 10);

  const handleChange = (page: number, ps: number) => {
    setCurrent(page);
    setPageSize(ps);
    args.onChange?.(page, ps); // Call action from Storybook
  };
  
  const handleShowSizeChange = (cur: number, ps: number) => {
    setCurrent(cur); // current might change if total items is not enough for new page size
    setPageSize(ps);
    args.onShowSizeChange?.(cur, ps);
  }

  // To make the mock Select work, if Pagination doesn't accept a `SelectComponent` prop,
  // this story won't directly replace the Select used inside Pagination.tsx.
  // However, the controls in Storybook will still function for props like `showSizeChanger`.

  return (
    <Pagination
      {...args}
      current={current}
      pageSize={pageSize}
      onChange={handleChange}
      onShowSizeChange={handleShowSizeChange}
      // If Pagination could take a Select component as a prop:
      // SelectComponent={MockSelect} 
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  total: 100,
};

export const MorePages = Template.bind({});
MorePages.args = {
  total: 500, // More pages to show ellipsis
  defaultCurrent: 1,
};

export const ShowTotal: StoryFn<typeof Pagination> = (args) => (
  <Pagination
    {...args}
    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
  />
);
ShowTotal.args = {
  total: 85,
  showSizeChanger: true,
};

export const SimpleMode = Template.bind({});
SimpleMode.args = {
  total: 100,
  simple: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  total: 100,
  disabled: true,
  showSizeChanger: true,
  showQuickJumper: true,
};

export const CustomItemRender: StoryFn<typeof Pagination> = (args) => (
  <Pagination
    {...args}
    itemRender={(page, type, originalElement) => {
      if (type === 'prev') {
        return <button type="button">Previous</button>;
      }
      if (type === 'next') {
        return <button type="button">Next</button>;
      }
      if (type === 'jump-prev' || type === 'jump-next') {
        return <Icon name="EllipsisOutlined" />;
      }
      return originalElement;
    }}
  />
);
CustomItemRender.args = {
  total: 100,
};

export const WithCustomPageSizeOptions = Template.bind({});
WithCustomPageSizeOptions.args = {
    total: 200,
    showSizeChanger: true,
    pageSizeOptions: ['5', '15', '30', '60'],
    defaultPageSize: 5,
};

export const Controlled: StoryFn<typeof Pagination> = (args) => {
    const [currentPage, setCurrentPage] = useState(3);
    const [currentPageSize, setCurrentPageSize] = useState(20);
  
    const handlePaginationChange = (page: number, pageSize?: number) => {
      setCurrentPage(page);
      if (pageSize) setCurrentPageSize(pageSize);
      console.log('Controlled Change:', page, pageSize || currentPageSize);
    };
  
    return (
      <div>
        <p>Current: {currentPage}, PageSize: {currentPageSize}</p>
        <Pagination
          {...args}
          current={currentPage}
          pageSize={currentPageSize}
          onChange={handlePaginationChange}
          onShowSizeChange={(current, size) => {
            setCurrentPage(current);
            setCurrentPageSize(size);
            console.log('Controlled ShowSizeChange:', current, size);
          }}
        />
      </div>
    );
};
Controlled.args = {
    total: 500,
    showSizeChanger: true,
    showQuickJumper: true,
};
