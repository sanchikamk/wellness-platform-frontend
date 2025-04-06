// src/components/Toast.jsx
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

const Toast = ({
  message,
  type = 'success',
  onDismiss = () => {},
  autoDismiss = true,
  dismissTime = 4000,
}) => {
  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, dismissTime);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
      case 'info':
        return <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />;
      default:
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50 border-red-400 text-red-800 hover:text-red-700',
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-400 text-blue-800 hover:text-blue-700',
        };
      default:
        return {
          bg: 'bg-green-50 border-green-400 text-green-800 hover:text-green-700',
        };
    }
  };

  const { bg } = getColor();

  return (
    <div
      className={`w-full max-w-sm border-l-4 rounded-md shadow-sm px-4 py-2 flex items-center justify-between text-sm ${bg}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{getIcon()}</span>
        <div>
          {Array.isArray(message) ? (
            <ul className="list-disc pl-4 space-y-0.5">
              {message.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          ) : (
            <p>{message}</p>
          )}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="ml-4 text-base focus:outline-none opacity-80 hover:opacity-100 self-center"
        aria-label="Dismiss toast"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default Toast;
