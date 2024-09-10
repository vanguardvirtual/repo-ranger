import { useState, useEffect, useRef } from 'preact/hooks';
import io, { Socket } from 'socket.io-client';
import { API_URL } from '@config/endpoints';
import useLoadMoreMessages from '@api/loadMoreMessages';
import useGetLatestMessages from '@api/getLatestMessages';
import { ChatMessage, ChatMessageLive } from '../../types';

const Chat = () => {
  const { mutate: loadMoreMessages, isLoading: isLoadingLoadMoreMessages } = useLoadMoreMessages();
  const { data: latestMessages, isSuccess: isLatestMessagesSuccess } = useGetLatestMessages();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleTimeString();
  };

  const handleSendMessage = (e: Event) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && socketRef.current) {
      socketRef.current.emit('chat message', { username, message: inputMessage });
      setInputMessage('');
    }
  };

  const handleSetUsername = (e: Event) => {
    e.preventDefault();
    if (username.trim() !== '' && socketRef.current) {
      setIsUsernameSet(true);
      socketRef.current.emit('set username', username);
      // Store username in localStorage
      localStorage.setItem('chatUsername', username);
    }
  };

  const handleLoadMoreMessages = async () => {
    if (messages.length > 0) {
      const oldestMessageId = messages[messages.length - 1].id;
      loadMoreMessages({ oldestMessageId });
    }
  };

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem('chatUsername');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsUsernameSet(true);
    }

    socketRef.current = io(API_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('chat message', (msg: ChatMessageLive) => {
      const newMsg: ChatMessage = { ...msg, created_at: msg.timestamp };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isLatestMessagesSuccess) {
      setMessages(latestMessages.messages);
    }
  }, [isLatestMessagesSuccess, latestMessages]);

  if (!isUsernameSet) {
    return (
      <div className="bg-gray-800 p-4 text-white">
        <form onSubmit={handleSetUsername} className="flex flex-col gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            placeholder="Enter your username"
            className="p-2 border text-black"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Set Username
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div ref={chatContainerRef} className="h-[500px] overflow-y-auto mb-4 bg-gray-700 p-2 rounded">
        <button onClick={handleLoadMoreMessages} className="w-full text-center text-blue-400 mb-2 hover:text-blue-300">
          {isLoadingLoadMoreMessages ? 'Loading...' : 'Load Older Messages'}
        </button>
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-bold">{msg.username}: </span>
            <span>{msg.message}</span>
            <span className="text-xs text-gray-400 ml-2">{formatTimestamp(msg.created_at)}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.currentTarget.value)}
          placeholder="Type your message"
          className="flex-grow p-2 border bg-gray-700 text-white"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
