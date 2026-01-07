import React, { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../services/api';
import { getOfflineResponse } from '../utils/offlineChatbot';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Namaste! Welcome to Madhya Pradesh Heritage Portal. Toggle between Online (AI) and Offline (Local Data) modes.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to format message text with markdown-like rendering
  const formatMessage = (text) => {
    // Split by lines
    const lines = text.split('\n');
    const elements = [];
    
    lines.forEach((line, index) => {
      // Bold text (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      let lastIndex = 0;
      const parts = [];
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`bold-${index}-${match.index}`}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      
      // Check for special formatting
      if (line.trim().startsWith('•') || line.trim().startsWith('─')) {
        elements.push(<div key={index} style={{ margin: '2px 0' }}>{parts.length > 0 ? parts : line}</div>);
      } else if (line.trim() === '') {
        elements.push(<br key={index} />);
      } else {
        elements.push(<div key={index} style={{ margin: '4px 0' }}>{parts.length > 0 ? parts : line}</div>);
      }
    });
    
    return elements;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleMode = () => {
    const newMode = !isOfflineMode;
    setIsOfflineMode(newMode);
    setMessages(prev => [...prev, {
      type: 'system',
      text: `Switched to ${newMode ? 'Offline' : 'Online'} Mode ${newMode ? '📚' : '🤖'}`
    }]);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = input;
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      if (isOfflineMode) {
        // Use offline chatbot logic
        const response = getOfflineResponse(userMessage);
        setTimeout(() => {
          setMessages(prev => [...prev, { type: 'bot', text: response }]);
          setLoading(false);
        }, 300);
      } else {
        // Use online API
        const response = await chatbotAPI.chat({ message: userMessage });
        setMessages(prev => [...prev, { type: 'bot', text: response.data.reply }]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: error.response?.data?.message || 'Sorry, I encountered an error. Try switching to Offline Mode for instant responses!'
      }]);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          🙏 Namaste! How may I help you?
        </button>
      )}

      {/* Chatbot Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '380px',
            height: '550px',
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>🙏 Monastery Guide</h3>
              <p style={{ margin: '5px 0 0', fontSize: '12px', opacity: 0.9 }}>
                {isOfflineMode ? '📚 Offline Mode' : '🤖 Online Mode'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Mode Toggle */}
              <button
                onClick={toggleMode}
                style={{
                  background: isOfflineMode ? '#28a745' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                title={isOfflineMode ? 'Switch to Online Mode' : 'Switch to Offline Mode'}
              >
                {isOfflineMode ? '📚' : '🤖'}
              </button>
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              background: '#f8f9fa',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : message.type === 'system' ? 'center' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: message.type === 'system' ? '90%' : '75%',
                    padding: '12px 16px',
                    borderRadius: message.type === 'user' ? '18px 18px 0 18px' : message.type === 'system' ? '15px' : '18px 18px 18px 0',
                    background: message.type === 'user'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : message.type === 'system'
                        ? '#ffc107'
                        : 'white',
                    color: message.type === 'user' ? 'white' : message.type === 'system' ? '#000' : '#333',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    fontSize: message.type === 'system' ? '12px' : '14px',
                    fontStyle: message.type === 'system' ? 'italic' : 'normal',
                    lineHeight: '1.6',
                    wordWrap: 'break-word',
                    fontFamily: message.type === 'bot' ? 'system-ui, -apple-system, sans-serif' : 'inherit'
                  }}
                >
                  {message.type === 'bot' ? formatMessage(message.text) : message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '18px 18px 18px 0',
                    background: 'white',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    fontSize: '14px'
                  }}
                >
                  <span style={{ opacity: 0.6 }}>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '15px',
              background: 'white',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: '10px'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 15px',
                border: '1px solid #e0e0e0',
                borderRadius: '25px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
            <button
              onClick={sendMessage}
              disabled={loading || input.trim() === ''}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '25px',
                cursor: loading || input.trim() === '' ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                opacity: loading || input.trim() === '' ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 480px) {
          .floating-chatbot-container {
            width: calc(100vw - 40px) !important;
            height: calc(100vh - 40px) !important;
            bottom: 10px !important;
            right: 10px !important;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingChatbot;
