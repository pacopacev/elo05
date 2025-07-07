// components/UniversalWindow.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
  
const UniversalWindow = ({
  isOpen = false,
  setIsOpen = () => {},
  isMinimized = false,
  setIsMinimized = () => {},
  windowTitle = "New Window",
  width = 800,
  height = 800,
  children,
}) => {
  const [windowState, setWindowState] = useState({
    x: window.innerWidth / 2 - width / 2,
    y: window.innerHeight / 2 - height / 2,
    width,
    height,
  });

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {isOpen && !isMinimized && (
        <Rnd
          size={{ width: windowState.width, height: windowState.height }}
          position={{ x: windowState.x, y: windowState.y }}
          minWidth={200}
          minHeight={100}
          bounds="window"
          onDragStop={(e, d) => setWindowState(ws => ({ ...ws, x: d.x, y: d.y }))}
          onResizeStop={(e, direction, ref, delta, position) => {
            setWindowState({
              width: parseInt(ref.style.width, 10),
              height: parseInt(ref.style.height, 10),
              ...position,
            });
          }}
          style={{ zIndex: 3000 }}
        >
          <div style={{
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
            border: '1px solid #eee',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
          }}>
            <div style={{
              height: 40,
              background: '#f3f4f6',
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontWeight: 500,
              userSelect: 'none',
              cursor: 'move',
            }}>
              <span>{windowTitle}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleMinimize} style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer' }} title="Minimize">–</button>
                <button onClick={handleClose} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer' }} title="Close">×</button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {children}
            </div>
          </div>
        </Rnd>
      )}
      {isMinimized && (
        <div style={{
          position: 'fixed',
          left: 16,
          bottom: 16,
          zIndex: 3000,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
          minWidth: 120,
          minHeight: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          cursor: 'pointer',
          border: '1px solid #eee',
        }} onClick={handleRestore} title="Restore window">
          <span style={{ flex: 1 }}>{windowTitle}</span>
          <span style={{ fontSize: 18, marginLeft: 8 }}>▢</span>
        </div>
      )}
    </>
  );
};

UniversalWindow.propTypes = {
  windowTitle: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default UniversalWindow;