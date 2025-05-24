import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// --- Title ---
const titleVariants = cva('font-bold tracking-tight', {
  variants: {
    level: {
      1: 'text-4xl font-extrabold lg:text-5xl',
      2: 'text-3xl font-semibold',
      3: 'text-2xl font-semibold',
      4: 'text-xl font-semibold',
      5: 'text-lg font-semibold',
    },
  },
  defaultVariants: {
    level: 1,
  },
});

interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  asChild?: boolean;
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, level, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : (('h' + (level || 1)) as keyof JSX.IntrinsicElements);
    return <Comp className={cn(titleVariants({ level }), className)} ref={ref} {...props} />;
  }
);
Title.displayName = 'Title';

// --- Text ---
const textVariants = cva('', {
  variants: {
    type: {
      secondary: 'text-muted-foreground',
      success: 'text-green-600 dark:text-green-500',
      warning: 'text-yellow-600 dark:text-yellow-500',
      danger: 'text-destructive',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    strong: {
      true: 'font-semibold',
    },
    italic: {
      true: 'italic',
    },
    underline: {
      true: 'underline',
    },
    code: {
      true: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    },
    mark: {
      true: 'bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 p-0.5 rounded',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, type, size, strong, italic, underline, code, mark, disabled, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span';
    return (
      <Comp
        className={cn(
          textVariants({ type, size, strong, italic, underline, code, mark, disabled }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

// --- Paragraph ---
const paragraphVariants = cva('leading-7 [&:not(:first-child)]:mt-6', {
  variants: {},
});

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {
  asChild?: boolean;
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p';
    return <Comp className={cn(paragraphVariants(), className)} ref={ref} {...props} />;
  }
);
Paragraph.displayName = 'Paragraph';

// --- Link ---
const linkVariants = cva('font-medium text-primary underline-offset-4 hover:underline', {
  variants: {},
});

interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return <Comp className={cn(linkVariants(), className)} ref={ref} {...props} />;
  }
);
Link.displayName = 'Link';

export { Title, Text, Paragraph, Link, titleVariants, textVariants, paragraphVariants, linkVariants };
