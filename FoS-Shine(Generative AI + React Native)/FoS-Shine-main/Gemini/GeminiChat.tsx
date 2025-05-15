import React, { useRef, useEffect, useState, useContext } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Card, CardContent, Tooltip, InputAdornment, MenuItem, IconButton, ListItemAvatar, Avatar } from '@mui/material';
import getTheme from '../../theme/fos-theme';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { GlobalContext } from '../../context/GlobalProvider';
import { generateResponse } from '../../gemini/gemini.repository';
import SkinDataSkeleton from '../common/skeleton/SkinDataSkeleton';
import CachedIcon from '@mui/icons-material/Cached';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { comedySettingOptions } from '../common/constants/constants';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import GeminiSettings from './GeminiSettings';

// Utility function to parse and render text segments
const renderTextSegments = (text) => {
  // Split text into lines for further processing
  const lines = text.split('\n');
  const segments = lines.map((line, index) => {
    // Check for italic text
    if (line.startsWith('*') && line.endsWith('*')) {
      return <i key={index}>{line.slice(1, -1)}</i>;
    }
    // Check for preformatted text (simple check for this example)
    else if (line.startsWith('    ') || line.startsWith('\t')) {
      return <pre key={index}>{line.trim()}</pre>;
    }
    // Default to plain text
    return <span key={index}>{line}</span>;
  });

  // Combine segments, adding line breaks between lines
  return segments.reduce((acc, segment, index) => (
    [...acc, segment, <br key={`br-${index}`} />]
  ), []);
};

const GeminiResponse = ({ message, theme }) => {
  return (
    <ListItemText
    secondary={message.sender === 'user' ? 'You' : 'Chris'} 
    sx={{
      borderRadius: '10px',
      padding: '0 0.5rem 0.5rem 0.5rem',
      '& .MuiListItemText-primary': { color: theme.palette.primary.main },
      '& .MuiListItemText-secondary': { color: theme.palette.primary.disabledText },
    }}>
      {renderTextSegments(message.text)}
    </ListItemText>
  );
}

const GeminiChat = () => {
  const global = useContext(GlobalContext);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const theme = getTheme();
  const [chatId, setChatId] = useState(global.geminiChatId);
  const [pastChats, setPastChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comedySetting, setComedySetting] = useState(comedySettingOptions[4]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const textFieldStyle = {
    '& .MuiFormLabel-root': { color: theme.palette.text.primary },
    '& .MuiInputLabel-root': { color: theme.palette.text.primary },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.text.primary, color: theme.palette.text.primary },
    '& label.Mui-focused': { color: theme.palette.primary.main },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: theme.palette.primary.main },
        '&:hover fieldset': { borderColor: theme.palette.primary.main },
        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
        '&.Mui-disabled fieldset': { borderColor: theme.palette.primary.disabledText, color: theme.palette.primary.disabledText },
    },
    '& .MuiInputBase-input ': { color: theme.palette.text.primary },
    '& .MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: theme.palette.primary.disabledText,
    },
    '& .MuiFormHelperText-root': { color: theme.palette.primary.disabledText },
    '& .MuiSvgIcon-root': { color: theme.palette.primary.main },
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getPreviousChats = async () => {
    try {
      const oldChats = await global.firebaseState.getPastChats(global.userCompany.id);
      if (oldChats && oldChats.length > 0) {
        setPastChats(oldChats);
        const currentChat = oldChats.find((chat) => chat.chatId === global.geminiChatId);
        if (currentChat && currentChat.chat && currentChat.chat.length > 0) {
          setMessages(currentChat.chat);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const saveChat = async () => {
    try {
      if (!messages || messages.length <= 1) {
        return;
      }

      await global.firebaseState.saveChat(chatId, messages, global.userCompany.id, global.userCompany.name);
    } catch (e) {
      console.error(e);
    }
  }

  const getProfilePic = async () => {
    try {
      const profilePic = await global.firebaseState.getProfileImageUrl();
      if (profilePic) {
        setProfilePic(profilePic);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  useEffect(() => {
    document.title = 'Chris the AI | FoS';
    const comedy = localStorage.getItem("comedySetting");
    if (comedy) {
      setComedySetting(comedy);
    }
    if (!pastChats || pastChats.length <= 0) {
      getPreviousChats();
    }

    if (messages.length <= 0 && !isLoading) {
      sendMessage('Hello');
    }

    if (!profilePic) {
      getProfilePic();
    }

    scrollToBottom();
    saveChat();
  }, [messages, isLoading]);

  const sendMessage = async (firstMessage) => {
    if (!currentMessage.trim()) {
      if (!firstMessage) {
        return;
      } else {
        const returnMessage = await generateResponse(global.gemini.key, firstMessage, global.authUser.multiFactor.user.displayName, [], comedySetting, global.authUser.uid);
        setMessages([{ text: returnMessage, sender: 'chris', firstModelMessage: true }]);
        return;
      }
    }
    if (messages && messages.length > 0) {
      setMessages([...messages, { text: currentMessage, sender: 'user' }]);
      setCurrentMessage('');
      const returnMessage = await generateResponse(global.gemini.key, currentMessage, global.authUser.multiFactor.user.displayName, messages, comedySetting, global.authUser.uid);
      setMessages(messages => [...messages, { text: returnMessage, sender: 'chris' }]);
    }
  };

  return (
    <Panel minSize={87}
      id='chris'
      order={2}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        maxWidth='xxl'
        sx={{
          margin: '0rem 1rem 0rem 1rem',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Card 
          variant="outlined" 
          sx={{ 
            borderColor: theme.palette.primary.main, 
            borderRadius: '15px',
            marginBottom: '1rem',
            marginTop: '1rem',
            backgroundColor: theme.palette.secondary.subsection,
            height: '100%',
          }}>
          <CardContent 
            sx={{  
              display: 'flex',
              flexDirection: 'column',
              height: isLoading ? '96%' : '100%',
              flexGrow: 1,
            }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '20%',
                }}
              >
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <AutoAwesomeIcon sx={{ color: theme.palette.primary.main, fontSize: '3rem' }} />
                  <Typography sx={{ color: theme.palette.primary.main, marginLeft: '5px', fontSize: '2rem' }}>
                    Chris the AI
                  </Typography>
                  <Typography sx={{ color: theme.palette.primary.disabledText, marginLeft: '5px', fontSize: '1rem' }}>
                    (Beta)
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center',
                }}>
                  <Tooltip title="Clear Chat" arrow>
                    <Button 
                      variant='text' 
                      sx={{ 
                        marginLeft: '5px', 
                        color: theme.palette.primary.main,
                        padding: '0px',
                      }}
                      onClick={() => setMessages([])}
                    >
                      <CachedIcon />
                    </Button>
                  </Tooltip>
                  <IconButton
                    onClick={() => {
                      setIsSettingsOpen(true);
                    }}
                    >
                    <SettingsSuggestIcon sx={{ color: theme.palette.primary.main, marginLeft: '5px' }} />
                  </IconButton>
                  <GeminiSettings theme={theme} isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} comedySetting={comedySetting} setComedySetting={setComedySetting} />
                </Box>
              </Box>
              {
                global.gemini && global.gemini.key ? 
                <Box sx={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  overflowY: 'auto',
                }}>
                  {
                    messages && messages.length > 0 && !isLoading ? 
                      <List 
                        sx={{ 
                          color: theme.palette.primary.main,
                          backgroundColor: theme.palette.secondary.subsection,
                        }}>
                        {messages.map((message, index) => (
                          <ListItem key={index} sx={{
                            alignItems: 'flex-start'
                          }}>
                            {
                              message.sender === 'user' && profilePic ?
                              <ListItemAvatar>
                                <Avatar alt="Profile Picture" src={profilePic} />
                              </ListItemAvatar>
                              : 
                              <Box>
                                {
                                  message.sender != 'user' ?
                                    <ListItemAvatar>
                                      <Avatar alt="C" src="/chrisai.png" />
                                    </ListItemAvatar>
                                  :                               
                                    <ListItemAvatar>
                                      <Avatar alt='Y' src="/default_pfp.png" />
                                    </ListItemAvatar>
                                  }
                              </Box>
                            }
                            <GeminiResponse message={message} theme={theme} />
                          </ListItem>
                        ))}
                        <div ref={messagesEndRef} />
                      </List>
                    : <SkinDataSkeleton rows={5} />
                  }
                </Box>
                : <Box>
                  { global.gemini && global.gemini.error ?
                    <Box>
                      <Typography variant='h6' sx={{ color: theme.palette.primary.main }}>
                        An error occured, try reloading the page
                      </Typography>
                      <Typography sx={{ color: theme.palette.primary.main, fontSize: '1rem' }}>
                        Contact chris@facultyofskin.com if the problem persists
                      </Typography>
                      <Typography sx={{ color: theme.palette.primary.main, fontSize: '1rem' }}>
                        {global.gemini.error}
                      </Typography>
                    </Box>
                    :
                    <SkinDataSkeleton rows={5} />
                  }
                  </Box>
              }
              <Box sx={{
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'flex-end',
                width: '100%',
                height: '20%',
                alignSelf: 'flex-end',
              }}>
                <TextField
                  variant="outlined"
                  placeholder="Don't be shy, ask Chris a question!"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  sx={textFieldStyle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  multiline
                  focused={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <ArrowCircleUpIcon
                          sx={{ 
                            color: theme.palette.primary.button, 
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: theme.palette.primary.formButtonHover,
                            },
                            padding: '5px',
                            borderRadius: '50%',
                            height: '30px',
                            width: '30px',
                          }}
                          onClick={() => {
                            sendMessage();
                          }}
                        />
                      </InputAdornment>
                    )
                  }} />
                <Typography sx={{ color: theme.palette.primary.disabledText, marginLeft: '5px', fontSize: '1rem', marginTop: '7px' }}>
                  Questions or concerns? Contact Chris Small at chris@facultyofskin.com
                </Typography>
              </Box>
          </CardContent>
        </Card>
      </Box>
    </Panel>
  );
}

export default GeminiChat;