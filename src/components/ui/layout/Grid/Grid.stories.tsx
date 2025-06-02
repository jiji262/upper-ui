// src/components/ui/layout/Grid/Grid.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Row from './Row';
import Col from './Col';
import './Grid.css'; // Ensure styles are loaded for stories

export default {
  title: 'Layout/Grid',
  component: Row, // Primary component for story
  subcomponents: { Col },
  argTypes: {
    align: {
      control: { type: 'select', options: ['top', 'middle', 'bottom', 'stretch'] },
    },
    justify: {
      control: { type: 'select', options: ['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly'] },
    },
    gutter: {
      control: 'object', // Allows array or number input e.g. [16,16] or 16
    },
    wrap: {
      control: 'boolean',
    },
  },
} as Meta<typeof Row>;

const colStyle: React.CSSProperties = {
  background: '#0092ff', // antd blue for cols
  color: 'white',
  padding: '8px 0',
  textAlign: 'center',
  borderRadius: '4px',
  minHeight: '30px',
  lineHeight: '30px',
};

const oddColStyle: React.CSSProperties = {
    ...colStyle,
    background: '#00a0e9', // a lighter blue for alternating
};


export const BasicGrid: StoryFn<typeof Row> = (args) => (
  <Row {...args}>
    <Col span={12} style={colStyle}>col-12</Col>
    <Col span={12} style={oddColStyle}>col-12</Col>
  </Row>
);
BasicGrid.args = {};

export const GutterGrid: StoryFn<typeof Row> = (args) => (
  <Row {...args}>
    <Col span={6} style={colStyle}>col-6</Col>
    <Col span={6} style={oddColStyle}>col-6</Col>
    <Col span={6} style={colStyle}>col-6</Col>
    <Col span={6} style={oddColStyle}>col-6</Col>
  </Row>
);
GutterGrid.args = {
  gutter: 16,
};

export const ResponsiveGrid: StoryFn<typeof Row> = (args) => (
  <Row {...args}>
    <Col xs={24} sm={12} md={8} lg={6} xl={4} style={colStyle}>Col</Col>
    <Col xs={24} sm={12} md={8} lg={6} xl={4} style={oddColStyle}>Col</Col>
    <Col xs={24} sm={12} md={8} lg={6} xl={4} style={colStyle}>Col</Col>
    <Col xs={24} sm={12} md={8} lg={6} xl={4} style={oddColStyle}>Col</Col>
  </Row>
);
ResponsiveGrid.args = {
  gutter: [16, 16], // Horizontal and vertical gutter
};

export const FlexLayout: StoryFn<typeof Row> = (args) => (
  <>
    <p>Justify Center, Align Middle</p>
    <Row {...args} justify="center" align="middle" style={{ backgroundColor: 'rgba(128,128,128,0.1)', minHeight: '100px' }}>
      <Col span={4} style={colStyle}>col-4</Col>
      <Col span={4} style={oddColStyle}>col-4</Col>
      <Col span={4} style={colStyle}>col-4</Col>
      <Col span={4} style={oddColStyle}>col-4</Col>
    </Row>
    <p>Justify Space Around</p>
    <Row {...args} justify="space-around" style={{ backgroundColor: 'rgba(128,128,128,0.1)', minHeight: '100px', marginTop: '16px' }}>
      <Col span={4} style={colStyle}>col-4</Col>
      <Col span={4} style={oddColStyle}>col-4</Col>
      <Col span={4} style={colStyle}>col-4</Col>
    </Row>
  </>
);
FlexLayout.args = {
  gutter: 8,
};

export const ColumnOffset: StoryFn<typeof Row> = (args) => (
    <Row {...args}>
      <Col span={8} style={colStyle}>col-8</Col>
      <Col span={8} offset={8} style={oddColStyle}>col-8 col-offset-8</Col>
    </Row>
  );
ColumnOffset.args = {
    gutter: 16
};

export const PushPull: StoryFn<typeof Row> = (args) => (
    <Row {...args}>
      <Col span={18} push={6} style={colStyle}>col-18 push-6</Col>
      <Col span={6} pull={18} style={oddColStyle}>col-6 pull-18</Col>
    </Row>
);
PushPull.args = {
    gutter: 16
};

export const FlexProperty: StoryFn<typeof Row> = (args) => (
    <Row {...args}>
      <Col flex={2} style={colStyle}>col flex-2</Col>
      <Col flex={3} style={oddColStyle}>col flex-3</Col>
    </Row>
  );
FlexProperty.args = {
    gutter: 16,
};

export const FlexGrowAuto: StoryFn<typeof Row> = (args) => (
    <Row {...args}>
      <Col flex="1 1 200px" style={colStyle}>col flex="1 1 200px"</Col>
      <Col flex="0 1 300px" style={oddColStyle}>col flex="0 1 300px"</Col>
    </Row>
  );
FlexGrowAuto.args = {
    gutter: 16,
    justify: "start" // To see effect of flex items
};
