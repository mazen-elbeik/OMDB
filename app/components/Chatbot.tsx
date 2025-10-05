import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Drawer,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useAppSelector } from '../store/hooks';
import { sendMessageToChatbot } from '../services/chatbotApi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your movie assistant. I can help you find movies, answer questions, and give recommendations based on your favorites!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { favorites } = useAppSelector((state) => state.movies);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessageToChatbot(userMessage.text, favorites);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response || 'I received your message!',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
    //   setError('Failed to connect to chatbot. Make sure the server is running on localhost:4200');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Failed to connect to chatbot. Please contact Mazen Elbeik at 'mazenbeik0@gmail.com'.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #dc2626 30%, #f59e0b 90%)',
          boxShadow: '0 4px 20px 0 rgba(220, 38, 38, .4)',
          '&:hover': {
            background: 'linear-gradient(45deg, #b91c1c 30%, #d97706 90%)',
          },
          zIndex: 1000,
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chatbot Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100%',
          },
        }}
      >
        <Box className="flex flex-col h-full bg-gradient-to-b from-red-50 to-amber-50">
          {/* Header */}
          <Box className="flex items-center justify-between p-4 bg-gradient-to-r from-red-900 to-amber-900 text-white shadow-lg">
            <Box className="flex items-center gap-2">
              <SmartToyIcon />
              <Typography variant="h6" className="font-bold">
                Movie Assistant
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Info Banner */}
          {favorites.length > 0 && (
            <Box className="p-3 bg-amber-100 border-b border-amber-200">
              <Typography variant="caption" className="text-amber-900">
                💡 I have access to your {favorites.length} favorite{' '}
                {favorites.length === 1 ? 'movie' : 'movies'} to give personalized recommendations!
              </Typography>
            </Box>
          )}

          {/* Error Alert */}
          {error && (
            <Box className="p-3">
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Messages */}
          <Box className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <Box
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Box
                  className={`flex gap-2 max-w-[85%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <Box
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-red-600 to-red-700'
                        : 'bg-gradient-to-br from-amber-500 to-amber-600'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <PersonIcon sx={{ fontSize: 18, color: 'white' }} />
                    ) : (
                      <SmartToyIcon sx={{ fontSize: 18, color: 'white' }} />
                    )}
                  </Box>

                  {/* Message Bubble */}
                  <Paper
                    elevation={1}
                    className="p-3 rounded-2xl"
                    sx={{
                      borderTopRightRadius: message.sender === 'user' ? 4 : undefined,
                      borderTopLeftRadius: message.sender === 'bot' ? 4 : undefined,
                      background: message.sender === 'user' 
                        ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                        : 'white',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-word',
                        color: message.sender === 'user' ? 'white' : '#1f2937'
                      }}
                    >
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ 
                        display: 'block', 
                        mt: 0.5,
                        color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <Box className="flex justify-start">
                <Box className="flex gap-2">
                  <Box className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600">
                    <SmartToyIcon sx={{ fontSize: 18, color: 'white' }} />
                  </Box>
                  <Paper elevation={1} className="p-3 rounded-2xl bg-white">
                    <CircularProgress size={20} sx={{ color: '#f59e0b' }} />
                  </Paper>
                </Box>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box className="p-4 bg-white border-t border-gray-200 shadow-lg">
            <Box className="flex gap-2">
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about movies..."
                variant="outlined"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fef3c7',
                    '& fieldset': {
                      borderColor: '#f59e0b',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d97706',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#dc2626',
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!input.trim() || loading}
                sx={{
                  background: 'linear-gradient(45deg, #dc2626 30%, #f59e0b 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #b91c1c 30%, #d97706 90%)',
                  },
                  '&.Mui-disabled': {
                    background: '#e5e7eb',
                    color: '#9ca3af',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

