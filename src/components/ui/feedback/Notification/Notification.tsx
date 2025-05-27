// src/components/ui/feedback/Notification/Notification.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import './Notification.css';

type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'open'; // 'open' for generic
type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'; // Default 'topRight'

interface NotificationOptions {
  message: React.ReactNode; // Title of the notification
  description?: React.ReactNode;
  duration?: number | null; // seconds, null or 0 for permanent
  onClose?: () => void;
  icon?: React.ReactNode;
  key?: string | number;
  btn?: React.ReactNode; // Custom action button
  placement?: NotificationPlacement; // For this specific notification, overrides global
  
  onClick?: () => void; // When notification body is clicked
  className?: string;
  style?: React.CSSProperties;
  // closeIcon?: React.ReactNode; // Custom close icon
}

interface NotificationInstance extends NotificationOptions {
  id: string | number; // Unique internal ID
  type: NotificationType;
  placement: NotificationPlacement; // Resolved placement
}

// --- Notification Item Component ---
const NotificationItem: React.FC<NotificationInstance & { onInternalClose: (id: string | number, placement: NotificationPlacement) => void }> = ({
  id,
  message,
  description,
  type,
  icon,
  duration = 4.5, // Default duration 4.5 seconds
  onClose,
  onInternalClose,
  btn,
  placement, // Used for internal management, not directly for styling here
  onClick,
  className,
  style,
  // closeIcon = <Icon name="CloseOutlined" />, // Default close icon
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration !== null && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
        onInternalClose(id, placement);
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose, onInternalClose, placement]);

  const handleManualClose = () => {
    setIsVisible(false);
    onClose?.();
    onInternalClose(id, placement);
  };

  const typeToIcon: Record<NotificationType, React.ReactNode | undefined> = {
    success: <Icon name="CheckCircleFilled" />,
    error: <Icon name="CloseCircleFilled" />,
    info: <Icon name="InfoCircleFilled" />,
    warning: <Icon name="ExclamationCircleFilled" />,
    open: undefined, // No default icon for generic 'open'
  };

  const iconNode = icon !== undefined ? icon : typeToIcon[type];

  if (!isVisible) return null; // Basic fade-out would involve CSS transitions and state

  const noticeClasses = [
    'ant-notification-notice',
    className,
    type !== 'open' ? `ant-notification-notice-${type}` : '', // For specific type styling if needed
    btn ? 'ant-notification-notice-with-btn' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={noticeClasses} style={style} onClick={onClick}>
      <div className="ant-notification-notice-content">
        {iconNode && <div className={`ant-notification-notice-icon ant-notification-notice-icon-${type}`}>{iconNode}</div>}
        <div className={`ant-notification-notice-message ${!iconNode ? 'ant-notification-notice-message-with-only-description' : ''}`}>
          {message}
        </div>
        {description && <div className="ant-notification-notice-description">{description}</div>}
        {btn && <div className="ant-notification-notice-btn">{btn}</div>}
      </div>
      <button type="button" className="ant-notification-notice-close" onClick={handleManualClose} aria-label="Close">
        {/* {closeIcon} */} <Icon name="CloseOutlined" />
      </button>
    </div>
  );
};


// --- Notification Container Manager ---
// Store refs to container elements for each placement
const notificationContainers: Partial<Record<NotificationPlacement, HTMLDivElement>> = {};

// Store notification states for each placement
const notificationsState: Record<NotificationPlacement, {
  messages: NotificationInstance[];
  add: (msg: NotificationInstance) => void;
  remove: (id: string | number) => void;
  update: (id: string|number, newConfig: Partial<NotificationOptions>) => void;
  destroyPlacement: () => void;
}> = {} as any; // Initialized lazily

// Global config (simplified)
let globalConfig = {
  duration: 4.5,
  placement: 'topRight' as NotificationPlacement,
  // getContainer: () => document.body,
  // top: 24, // Default top/bottom margin
  // bottom: 24,
};

let notificationUniqueIdCounter = 0;

const getPlacementStyle = (placement: NotificationPlacement): React.CSSProperties => {
    const top = globalConfig.top || 24;
    const bottom = globalConfig.bottom || 24;
    const style: React.CSSProperties = {
        position: 'fixed',
        zIndex: 1010, // AntD default z-index for notification
        width: '384px', // AntD default width
        maxWidth: 'calc(100vw - 48px)',
    };
    if (placement.includes('top')) style.top = `${top}px`;
    if (placement.includes('bottom')) style.bottom = `${bottom}px`;
    if (placement.includes('Left')) style.left = '24px';
    if (placement.includes('Right')) style.right = '24px';
    return style;
}


const renderNotificationsForPlacement = (placement: NotificationPlacement) => {
  if (!notificationContainers[placement]) {
    const container = document.createElement('div');
    container.className = `ant-notification-container ant-notification-container-${placement}`;
    Object.assign(container.style, getPlacementStyle(placement));
    // const targetContainer = globalConfig.getContainer();
    // targetContainer.appendChild(container);
    document.body.appendChild(container); // Simplified: always append to body
    notificationContainers[placement] = container;
  }
  
  const containerRef = notificationContainers[placement]!;

  const NotificationPlacementContainer: React.FC = () => {
    const [currentMessages, setCurrentMessages] = useState<NotificationInstance[]>(notificationsState[placement]?.messages || []);

    useEffect(() => {
      const interval = setInterval(() => { // Hacky update, see Message.tsx for similar note
        if (notificationsState[placement]) { // Ensure state for placement is initialized
            const externalMessages = notificationsState[placement].messages;
            if (currentMessages.length !== externalMessages.length || 
                !currentMessages.every((cm, i) => cm.id === externalMessages[i]?.id && cm.message === externalMessages[i]?.message)) {
               setCurrentMessages([...externalMessages]);
            }
        }
      }, 100);
      return () => clearInterval(interval);
    }, [currentMessages]);


    const handleInternalClose = useCallback((id: string | number, msgPlacement: NotificationPlacement) => {
      if (notificationsState[msgPlacement]) {
          notificationsState[msgPlacement].remove(id);
      }
    }, []);
    
    if (currentMessages.length === 0 && containerRef.children.length === 0 && containerRef.parentNode) {
        // Optional: remove container if no messages (AntD might keep it)
        // For simplicity, keep it.
    }

    return (
      <>
        {currentMessages.map(msg => (
          <NotificationItem key={msg.id} {...msg} onInternalClose={handleInternalClose} />
        ))}
      </>
    );
  };
  ReactDOM.render(<NotificationPlacementContainer />, containerRef);
};


const ensurePlacementState = (placement: NotificationPlacement) => {
    if (!notificationsState[placement]) {
        notificationsState[placement] = {
            messages: [],
            add: (msg) => {
                notificationsState[placement].messages = [...notificationsState[placement].messages, msg];
                renderNotificationsForPlacement(placement);
            },
            remove: (id) => {
                notificationsState[placement].messages = notificationsState[placement].messages.filter(m => m.id !== id);
                renderNotificationsForPlacement(placement);
            },
            update: (id, newConfig) => {
                 notificationsState[placement].messages = notificationsState[placement].messages.map(m => 
                    m.id === id ? { ...m, ...newConfig, duration: newConfig.duration !== undefined ? newConfig.duration : m.duration } : m
                );
                renderNotificationsForPlacement(placement);
            },
            destroyPlacement: () => {
                notificationsState[placement].messages = [];
                if (notificationContainers[placement]) {
                    ReactDOM.unmountComponentAtNode(notificationContainers[placement]!);
                    notificationContainers[placement]!.parentNode?.removeChild(notificationContainers[placement]!);
                    delete notificationContainers[placement];
                }
            }
        };
    }
};


// --- Public API ---
const createNotificationApi = (type: NotificationType) => (
  options: Omit<NotificationOptions, 'type' | 'placement'> & { placement?: NotificationPlacement }
): void => { // AntD notification API typically doesn't return a promise like message
  const { placement: localPlacement, ...restOptions } = options;
  const finalPlacement = localPlacement || globalConfig.placement;
  const finalDuration = options.duration !== undefined ? options.duration : globalConfig.duration;

  ensurePlacementState(finalPlacement);

  const id = options.key !== undefined ? options.key : `ant-notification-${notificationUniqueIdCounter++}`;
  
  const existingMessageIndex = notificationsState[finalPlacement].messages.findIndex(m => m.key !== undefined && m.key === options.key);

  const notificationConfig: NotificationInstance = {
    ...restOptions,
    id,
    type,
    placement: finalPlacement,
    duration: finalDuration,
  };

  if (options.key && existingMessageIndex > -1) {
    notificationsState[finalPlacement].update(id, notificationConfig);
  } else {
    notificationsState[finalPlacement].add(notificationConfig);
  }
};

const notificationApi = {
  open: createNotificationApi('open'), // Generic, often needs icon specified
  success: createNotificationApi('success'),
  error: createNotificationApi('error'),
  info: createNotificationApi('info'),
  warning: createNotificationApi('warning'),
  // No 'loading' type typically for notification, but can be done with 'open' and custom icon/duration.
  
  destroy: (key?: string | number) => { // Destroy specific or all notifications
    Object.values(notificationsState).forEach(placementState => {
        if (key !== undefined) {
            const msgToRemove = placementState.messages.find(m => m.key === key);
            if (msgToRemove) placementState.remove(msgToRemove.id);
        } else {
            placementState.destroyPlacement(); // Clears all for this placement
        }
    });
    if (key === undefined) { // If destroying all, clear all placement states
        Object.keys(notificationsState).forEach(p => delete notificationsState[p as NotificationPlacement]);
    }
  },
  config: (options: Partial<typeof globalConfig>) => {
    globalConfig = { ...globalConfig, ...options };
    // If placement changes globally, might need to re-render/move existing containers
    // For simplicity, this is not handled here. Assume config is set before first use.
  },
};

// This component is mainly for the API, doesn't render anything itself directly.
const Notification: React.FC = () => {
  useEffect(() => {
    // Initial setup if any global config needs to be applied to containers
    // This component instance itself doesn't do much in AntD's API-driven approach.
    // It could be a Provider for context-based configuration if designed that way.
  }, []);
  return null;
};

export default notificationApi; // Export the API object
// export { Notification as NotificationProvider }; // If using a Provider model
