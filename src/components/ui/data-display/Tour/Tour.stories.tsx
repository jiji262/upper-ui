// src/components/ui/data-display/Tour/Tour.stories.tsx
import React, { useState, useRef } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Tour, { TourStep } from './Tour';
import Button from '../../general/Button/Button'; // Assuming Button is available

export default {
  title: 'Data Display/Tour',
  component: Tour,
  argTypes: {
    // `steps`, `open`, `current` are controlled in stories
    onClose: { action: 'closed' },
    onFinish: { action: 'finished' },
    onChange: { action: 'changed' },
  },
  parameters: {
    layout: 'fullscreen', // Tour often interacts with full page elements
  },
} as Meta<typeof Tour>;

const Template: StoryFn<typeof Tour> = (args) => {
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);

  const tourSteps: TourStep[] = [
    {
      target: () => ref1.current,
      title: 'Upload Files',
      description: 'Put your files here to upload them.',
      placement: 'bottom',
    },
    {
      target: () => ref2.current,
      title: 'Save Your Work',
      description: 'Remember to save your progress frequently!',
      placement: 'right',
    },
    {
      target: () => ref3.current,
      title: 'Find More Info Here',
      description: 'This panel contains additional details and options.',
      placement: 'left',
    },
    {
        // No target, will be centered
        title: 'Tour Completed!',
        description: 'You have successfully viewed all the steps.',
    }
  ];

  const [openTour, setOpenTour] = useState(args.open !== undefined ? args.open : true);
  const [currentStep, setCurrentStep] = useState(args.current || 0);

  const handleCloseTour = () => {
    setOpenTour(false);
    args.onClose?.();
  };
  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
    args.onChange?.(step);
  };
   const handleFinishTour = () => {
    setOpenTour(false); // Also close on finish
    args.onFinish?.();
  };


  return (
    <div style={{ padding: '20px', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Button ref={ref1} type="primary">Upload</Button>
        <input ref={ref2} type="text" placeholder="Some input field" style={{padding: '5px'}} />
        <Button onClick={() => {setOpenTour(true); setCurrentStep(0);}}>Start Tour</Button>
      </div>
      <div 
        ref={ref3} 
        style={{ 
            width: '200px', 
            padding: '20px', 
            border: '1px solid #ccc', 
            marginTop: '50px', 
            textAlign: 'center',
            background: '#f9f9f9'
        }}
      >
        Information Panel
      </div>

      <Tour
        {...args}
        steps={tourSteps}
        open={args.open !== undefined ? args.open : openTour}
        current={args.current !== undefined ? args.current : currentStep}
        onClose={handleCloseTour}
        onChange={handleChangeStep}
        onFinish={handleFinishTour}
      />
    </div>
  );
};

export const BasicTour = Template.bind({});
BasicTour.args = {
    open: true, // Start open for this story by default
};

export const ControlledTour: StoryFn<typeof Tour> = (args) => {
    const refA = useRef(null);
    const refB = useRef(null);
    const [tourOpen, setTourOpen] = useState(false);
    const [current, setCurrent] = useState(0);

    const steps: TourStep[] = [
        { target: () => refA.current, title: "Step A", description: "This is button A." },
        { target: () => refB.current, title: "Step B", description: "This is paragraph B." }
    ];

    return (
        <div style={{padding: '30px'}}>
            <Button ref={refA} onClick={() => {setTourOpen(true); setCurrent(0);}} style={{marginRight: 10}}>
                Start Tour (Button A)
            </Button>
            <p ref={refB} style={{marginTop: 20, border: '1px solid #eee', padding: 10}}>
                Some paragraph text (Paragraph B).
            </p>
            <Tour
                {...args}
                steps={steps}
                open={tourOpen}
                current={current}
                onClose={() => setTourOpen(false)}
                onChange={setCurrent}
                onFinish={() => {setTourOpen(false); alert("Tour Finished!");}}
            />
        </div>
    )
}
ControlledTour.args = {
    // open and current are controlled by component state
};

// Note:
// - The target highlighting in the simplified Tour.tsx is very basic (a class `ant-tour-target-highlight` is added).
//   A real AntD tour uses more sophisticated methods (SVG overlay, mask) for highlighting.
// - Popover positioning is also very basic and may not handle all edge cases or placements perfectly.
// - Props like `cover`, `nextButtonProps`, `prevButtonProps`, `arrow`, `mask` (object), `type` for popover styling
//   are not implemented in this simplified version.
// - `getPopupContainer` is not demonstrated but could be used for portal destination.
// - The storybook `layout: 'fullscreen'` is helpful as tours often interact with the whole page.
