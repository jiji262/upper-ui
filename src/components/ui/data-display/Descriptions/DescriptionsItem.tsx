// src/components/ui/data-display/Descriptions/DescriptionsItem.tsx
import React from 'react';

export interface DescriptionsItemProps {
  label?: React.ReactNode;
  children: React.ReactNode;
  span?: number; // Number of columns this item should span
  className?: string; // Class for the item <td> or <th> pair
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

// This component is mostly a data carrier.
// The actual rendering logic is handled by the Descriptions component.
const DescriptionsItem: React.FC<DescriptionsItemProps> = ({ children }) => {
  // This component doesn't render anything itself.
  // It's used by Descriptions to collect props.
  return <>{children}</>;
};

DescriptionsItem.displayName = 'DescriptionsItem';
export default DescriptionsItem;
