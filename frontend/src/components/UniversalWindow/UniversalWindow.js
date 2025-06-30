// components/UniversalWindow.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'; 

const UniversalWindow = ({
  buttonLabel = "Open Window",
  windowTitle = "New Window",
  width = 800,
  height = 600,
  children,
  buttonProps = {},
  onWindowOpen,
  onWindowClose,
  features = "resizable=yes,scrollbars=yes",
}) => {
  const [popupWindow, setPopupWindow] = useState(null);

  const openWindow = () => {
    // Calculate centered position
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const windowFeatures = `
      width=${width},
      height=${height},
      left=${left},
      top=${top},
      ${features}
    `;

    const newWindow = window.open('', windowTitle, windowFeatures);
    
    if (newWindow) {
      // Write basic HTML structure
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${windowTitle}</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
            <style>
              body { 
                font-family: 'Roboto', sans-serif; 
                margin: 0; 
                padding: 10px;
                
              }
            </style>
          </head>
          <body>
            <div id="popup-root"></div>
          </body>
        </html>
      `);
      
      // Render React content
      const root = newWindow.document.getElementById('popup-root');
      ReactDOM.render(children, root);
      
      setPopupWindow(newWindow);
      if (onWindowOpen) onWindowOpen(newWindow);
      
      // Handle window closing
      const timer = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(timer);
          setPopupWindow(null);
          if (onWindowClose) onWindowClose();
        }
      }, 500);
    } else {
      console.error('Popup was blocked. Please allow popups for this site.');
      // Fallback to modal or other approach
    }
  };

  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
      }
    };
  }, [popupWindow]);

  return (
    <button onClick={openWindow} {...buttonProps}>
      {buttonLabel}
    </button>
  );
};

UniversalWindow.propTypes = {
  buttonLabel: PropTypes.string,
  windowTitle: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.node.isRequired,
  buttonProps: PropTypes.object,
  onWindowOpen: PropTypes.func,
  onWindowClose: PropTypes.func,
  features: PropTypes.string,
};

export default UniversalWindow;