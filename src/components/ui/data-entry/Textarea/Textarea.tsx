import React from 'react';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  showCount?: boolean;
  status?: 'error' | 'warning';
}

const Textarea: React.FC<TextareaProps> = ({
  autoSize,
  showCount,
  status,
  className,
  maxLength,
  value,
  onChange,
  ...rest
}) => {
  const [textValue, setTextValue] = React.useState<string>(value as string || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setTextValue(value as string);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
    onChange?.(e);
  };

  const classNames = [
    'upper-textarea',
    status ? `upper-textarea-${status}` : '',
    autoSize ? 'upper-textarea-autosize' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className="upper-textarea-wrapper">
      <textarea
        className={classNames}
        value={textValue}
        onChange={handleChange}
        maxLength={maxLength}
        {...rest}
      />
      {showCount && (
        <div className="upper-textarea-count">
          {textValue.length}{maxLength ? `/${maxLength}` : ''}
        </div>
      )}
    </div>
  );
};

export default Textarea; 