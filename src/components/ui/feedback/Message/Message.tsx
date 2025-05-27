// src/components/ui/feedback/Message/Message.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import './Message.css';

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface MessageOptions {
  content: React.ReactNode;
  duration?: number; // seconds, 0 for permanent
  onClose?: () => void;
  icon?: React.ReactNode;
  key?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

interface MessageInstance extends MessageOptions {
  id: string | number; // Unique internal ID for each message
  type: MessageType;
}

// --- Message Item Component ---
const MessageItem: React.FC<MessageInstance & { onInternalClose: (id: string | number) => void }> = ({
  id,
  content,
  type,
  icon,
  duration = 3, // Default duration 3 seconds
  onClose,
  onInternalClose,
  style,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
        onInternalClose(id);
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose, onInternalClose]);

  const handleManualClose = () => {
    setIsVisible(false);
    onClose?.();
    onInternalClose(id);
  };

  const typeToIcon: Record<MessageType, React.ReactNode> = {
    success: <Icon name="CheckCircleFilled" />,
    error: <Icon name="CloseCircleFilled" />,
    info: <Icon name="InfoCircleFilled" />,
    warning: <Icon name="ExclamationCircleFilled" />,
    loading: <Icon name="LoadingOutlined" spin />,
  };

  const iconNode = icon !== undefined ? icon : typeToIcon[type];

  // Basic fade-out, real AntD has more complex animations
  if (!isVisible) {
    // Could add a fade-out class before removing, but for simplicity, just null
    return null; 
  }

  const messageClasses = [
    'ant-message-notice',
    className,
    `ant-message-notice-${type}`, // For specific type styling if needed
  ].filter(Boolean).join(' ');

  return (
    <div className={messageClasses} style={style}>
      <div className="ant-message-notice-content">
        <span className={`ant-message-icon ant-message-icon-${type}`}>{iconNode}</span>
        <span className="ant-message-text">{content}</span>
        {/* AntD message doesn't have a close button by default per item, but can be added */}
        {/* <Icon name="CloseOutlined" className="ant-message-close-icon" onClick={handleManualClose} /> */}
      </div>
    </div>
  );
};


// --- Message Container and API ---
let messageContainerRef: HTMLDivElement | null = null;
const messagesState: {
  messages: MessageInstance[];
  add: (msg: MessageInstance) => void;
  remove: (id: string | number) => void;
  update: (id: string|number, newConfig: Partial<MessageOptions>) => void;
  destroy: (key?: string | number) => void; // Destroy by key or all
} = {
  messages: [],
  add: (msg) => {
    messagesState.messages = [...messagesState.messages, msg];
    renderMessages();
  },
  remove: (id) => {
    messagesState.messages = messagesState.messages.filter(m => m.id !== id);
    renderMessages();
  },
  update: (id, newConfig) => {
    messagesState.messages = messagesState.messages.map(m => 
        m.id === id ? { ...m, ...newConfig, duration: newConfig.duration !== undefined ? newConfig.duration : m.duration } : m
    );
    renderMessages();
  },
  destroy: (key) => {
    if (key !== undefined) {
        messagesState.messages = messagesState.messages.filter(m => m.key !== key);
    } else {
        messagesState.messages = [];
    }
    renderMessages();
  }
};

let messageUniqueIdCounter = 0;

// Function to render/update the message container
const renderMessages = () => {
  if (!messageContainerRef) {
    messageContainerRef = document.createElement('div');
    messageContainerRef.className = 'ant-message-container'; // For global positioning
    // Default top position, AntD allows configuring this
    messageContainerRef.style.top = '24px'; 
    document.body.appendChild(messageContainerRef);
  }

  const MessageContainer: React.FC = () => {
    const [currentMessages, setCurrentMessages] = useState<MessageInstance[]>(messagesState.messages);

    useEffect(() => {
      // This effect is to re-render when messagesState.messages changes from outside React's direct control
      const interval = setInterval(() => {
        // A bit hacky: force update if external state differs from React state
        // A better solution would use a proper external store or event emitter
        if (currentMessages.length !== messagesState.messages.length || 
            !currentMessages.every((cm, i) => cm.id === messagesState.messages[i]?.id && cm.content === messagesState.messages[i]?.content)) {
           setCurrentMessages([...messagesState.messages]);
        }
      }, 100); // Check periodically
      return () => clearInterval(interval);
    }, [currentMessages]);


    const handleInternalClose = useCallback((id: string | number) => {
      messagesState.remove(id); // This will trigger a re-render via the interval check
      // setCurrentMessages(prev => prev.filter(m => m.id !== id)); // More direct React way
    }, []);
    
    if (currentMessages.length === 0 && messageContainerRef?.parentNode) {
        // Optional: remove container if no messages (AntD might keep it)
        // For simplicity, we keep it.
    }

    return (
      <>
        {currentMessages.map(msg => (
          <MessageItem key={msg.id} {...msg} onInternalClose={handleInternalClose} />
        ))}
      </>
    );
  };
  ReactDOM.render(<MessageContainer />, messageContainerRef);
};


// --- Public API ---
const createMessageApi = (type: MessageType) => (
  options: React.ReactNode | MessageOptions
): Promise<void> => { // AntD message API returns a promise that resolves when message is closed
  const config: MessageOptions = typeof options === 'string' || React.isValidElement(options)
    ? { content: options }
    : options;

  const id = config.key !== undefined ? config.key : `ant-message-${messageUniqueIdCounter++}`;
  
  // If a message with the same key already exists, update it
  const existingMessageIndex = messagesState.messages.findIndex(m => m.key !== undefined && m.key === config.key);

  return new Promise((resolve) => {
    const originalOnClose = config.onClose;
    const messageConfigWithClose = {
        ...config,
        onClose: () => {
            originalOnClose?.();
            resolve();
        }
    };

    if (config.key && existingMessageIndex > -1) {
        // Update existing message
        const existingMsg = messagesState.messages[existingMessageIndex];
        messagesState.update(existingMsg.id, { ...messageConfigWithClose, type });
    } else {
        // Add new message
        messagesState.add({ ...messageConfigWithClose, id, type });
    }
  });
};

const messageApi = {
  success: createMessageApi('success'),
  error: createMessageApi('error'),
  info: createMessageApi('info'),
  warning: createMessageApi('warning'),
  loading: createMessageApi('loading'),
  open: (args: MessageOptions & { type: MessageType }) => { // Generic open method
    const {type, ...options} = args;
    return createMessageApi(type)(options);
  },
  destroy: (key?: string | number) => {
    messagesState.destroy(key);
  },
  // config: (options: {top?: number, duration?: number, maxCount?: number, getContainer?: () => HTMLElement}) => void; // Global config (not implemented)
};

// This component is mainly for the API, doesn't render anything itself directly.
// The MessageContainer is rendered into a portal.
const Message: React.FC = () => {
  useEffect(() => {
    // Ensure container is ready on initial load if any messages are queued early
    if (messagesState.messages.length > 0 && !messageContainerRef?.parentNode) {
      renderMessages();
    }
    // Cleanup container on unmount if this component instance was responsible (not typical for message)
    // return () => {
    //   if (messageContainerRef && messageContainerRef.parentNode && messagesState.messages.length === 0) {
    //     ReactDOM.unmountComponentAtNode(messageContainerRef);
    //     messageContainerRef.parentNode.removeChild(messageContainerRef);
    //     messageContainerRef = null;
    //   }
    // };
  }, []);
  return null; 
};

export default messageApi; // Export the API object
// Also export Message component if it's used for configuration context provider (like AntD)
// export { Message as MessageProvider }; // Example if we had a MessageProvider context
