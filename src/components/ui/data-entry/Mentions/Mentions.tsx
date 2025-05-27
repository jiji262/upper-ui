// src/components/ui/data-entry/Mentions/Mentions.tsx
import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import Textarea, { TextareaProps } from '../Textarea/Textarea'; // Corrected type name
import './Mentions.css';

export interface MentionOption {
  value: string; // Unique value for the mention
  label?: React.ReactNode; // Display label, defaults to value
  [key: string]: any; // Allow other properties
}

interface MentionsProps extends Omit<TextareaProps, 'onChange' | 'value'> {
  value?: string; // Controlled value of the textarea
  defaultValue?: string;
  onChange?: (text: string) => void; // Callback when text changes
  onSelect?: (option: MentionOption, prefix: string) => void;
  prefix?: string | string[]; // Default '@'
  split?: string; // Character to split options, default ' '
  notFoundContent?: React.ReactNode;
  options: MentionOption[];
  placement?: 'top' | 'bottom'; // Position of suggestions dropdown
  filterOption?: false | ((input: string, option: MentionOption) => boolean);
  validateSearch?: (text: string, props: MentionsProps) => boolean; // Customize search validation
  // status?: 'error' | 'warning'; // from TextAreaProps
  autoFocus?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number }; // from TextareaProps
  getPopupContainer?: () => HTMLElement; // Defaults to document.body
}

const Mentions: React.FC<MentionsProps> = ({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSelect,
  prefix = '@',
  split = ' ',
  notFoundContent = 'Not Found',
  options = [],
  placement = 'bottom',
  filterOption = (input, option) => option.value.toLowerCase().includes(input.toLowerCase()),
  validateSearch = (text) => text.length > 0, // Default: search if text is not empty
  // status, // Pass to Textarea
  autoFocus,
  autoSize,
  getPopupContainer,
  className,
  style,
  ...restTextAreaProps
}) => {
  const [text, setText] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionOption[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [currentPrefix, setCurrentPrefix] = useState<string | null>(null);
  const [mentionQuery, setMentionQuery] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const lastCursorPosRef = useRef<number>(0);

  const prefixes = Array.isArray(prefix) ? prefix : [prefix];

  useEffect(() => {
    if (controlledValue !== undefined) {
      setText(controlledValue);
    }
  }, [controlledValue]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (controlledValue === undefined) {
      setText(newText);
    }
    onChange?.(newText);
    lastCursorPosRef.current = e.target.selectionStart;
    checkForMention(newText, e.target.selectionStart);
  };

  const checkForMention = (currentText: string, cursorPos: number) => {
    let activeMentionPrefix: string | null = null;
    let query = '';
    let queryStartPos = -1;

    for (const p of prefixes) {
      const lastPrefixIndex = currentText.lastIndexOf(p, cursorPos - 1);
      if (lastPrefixIndex !== -1) {
        // Check if there's a space or start of text before the prefix, unless prefix is start of text.
        const charBeforePrefix = lastPrefixIndex > 0 ? currentText[lastPrefixIndex - 1] : ' ';
        if (charBeforePrefix.match(/\s|^/)) {
            const potentialQuery = currentText.substring(lastPrefixIndex + p.length, cursorPos);
            // Ensure no prefix characters within the potential query itself
            if (!prefixes.some(pr => potentialQuery.includes(pr))) {
                 // Check if this is the most recent, valid prefix found
                if (lastPrefixIndex > queryStartPos) {
                    queryStartPos = lastPrefixIndex;
                    activeMentionPrefix = p;
                    query = potentialQuery;
                }
            }
        }
      }
    }
    
    if (activeMentionPrefix && validateSearch(query, {} as MentionsProps /* pass props */)) {
      setCurrentPrefix(activeMentionPrefix);
      setMentionQuery(query);
      const filtered = filterOption === false 
        ? options 
        : options.filter(opt => filterOption(query, opt));
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
      setCurrentPrefix(null);
      setSuggestions([]);
    }
  };

  const selectMention = (option: MentionOption) => {
    if (!currentPrefix || lastCursorPosRef.current === null) return;

    const currentText = text;
    const cursorPos = lastCursorPosRef.current;
    
    // Find start of the mention query based on currentPrefix and mentionQuery length
    const queryStartIndex = currentText.lastIndexOf(currentPrefix + mentionQuery, cursorPos);


    if (queryStartIndex !== -1) {
        const textBefore = currentText.substring(0, queryStartIndex);
        const textAfter = currentText.substring(cursorPos);
        const mentionValueWithPrefix = currentPrefix + option.value + split; // Add split character
        
        const newText = textBefore + mentionValueWithPrefix + textAfter;

        if (controlledValue === undefined) {
            setText(newText);
        }
        onChange?.(newText);
        onSelect?.(option, currentPrefix);
        
        // Set cursor position after the inserted mention + split char
        const newCursorPos = queryStartIndex + mentionValueWithPrefix.length;
        setTimeout(() => { // Delay to allow textarea to update
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
            textareaRef.current?.focus();
        }, 0);
    }

    setShowSuggestions(false);
    setCurrentPrefix(null);
    setSuggestions([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectMention(suggestions[activeSuggestionIndex]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
    restTextAreaProps.onKeyDown?.(e);
  };
  
  // Update last cursor position on click or keyup (for non-text-changing keys)
  const handleCursorActivity = () => {
    if (textareaRef.current) {
        lastCursorPosRef.current = textareaRef.current.selectionStart;
        // Re-check for mention if cursor moves into a potential mention area without text change
        // checkForMention(text, textareaRef.current.selectionStart);
    }
  };

  useEffect(() => {
    // Scroll suggestions list if active item is out of view
    if (showSuggestions && suggestionsRef.current && suggestionsRef.current.children[activeSuggestionIndex]) {
      const activeItem = suggestionsRef.current.children[activeSuggestionIndex] as HTMLLIElement;
      activeItem.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }
  }, [activeSuggestionIndex, showSuggestions]);
  
  // Click outside suggestions to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textareaRef.current && !textareaRef.current.contains(event.target as Node) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);


  const containerCls = ['upper-mentions', className].filter(Boolean).join(' ');
  const popupCls = ['upper-mentions-dropdown', `upper-mentions-dropdown-placement-${placement}`].filter(Boolean).join(' ');
  
  // Calculate popup position (very simplified)
  // A proper solution would use a library like Popper.js or calculate based on caret position
  const popupStyle: React.CSSProperties = {};
  if (textareaRef.current && showSuggestions) {
      // This is a placeholder. Real caret position calculation is complex.
      // For now, position below the textarea.
      const taRect = textareaRef.current.getBoundingClientRect();
      const container = getPopupContainer ? getPopupContainer() : document.body;
      const containerRect = container.getBoundingClientRect();

      if (placement === 'top') {
          popupStyle.bottom = container.scrollHeight - (taRect.top - containerRect.top);
      } else { // bottom
          popupStyle.top = (taRect.bottom - containerRect.top);
      }
      popupStyle.left = (taRect.left - containerRect.left);
      popupStyle.minWidth = taRect.width;
  }


  return (
    <div className={containerCls} style={style}>
      <Textarea
        {...restTextAreaProps}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onClick={handleCursorActivity}
        onKeyUp={handleCursorActivity} // For arrow keys, etc.
        autoFocus={autoFocus}
        autoSize={autoSize}
        // status={status} // Pass status to Textarea if it supports it
      />
      {showSuggestions && (
        <div className={popupCls} style={popupStyle}>
          <ul ref={suggestionsRef} className="upper-mentions-dropdown-menu">
            {suggestions.length > 0 ? (
              suggestions.map((opt, index) => (
                <li
                  key={opt.value}
                  className={`upper-mentions-dropdown-menu-item ${index === activeSuggestionIndex ? 'upper-mentions-dropdown-menu-item-active' : ''}`}
                  onClick={() => selectMention(opt)}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                >
                  {opt.label || opt.value}
                </li>
              ))
            ) : (
              <li className="upper-mentions-dropdown-menu-item upper-mentions-dropdown-menu-item-disabled">
                {notFoundContent}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Mentions;
