import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, User, MoreVertical, Paperclip, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface Message {
  id: string;
  user: string;
  role: string;
  message: string;
  timestamp: string;
  avatar: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0db36b3b/chat`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.messages) {
           setMessages(data.messages);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentUser) return;

    setLoading(true);
    const newMessageContent = inputValue;
    setInputValue(''); // Optimistic clear

    try {
      const payload = {
        user: currentUser.user_metadata?.name || 'User',
        role: 'Agronomist', // Default role
        message: newMessageContent,
        avatar: (currentUser.user_metadata?.name || 'U').charAt(0).toUpperCase()
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0db36b3b/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchMessages(); // Refresh messages
      } else {
        toast.error('Failed to send message');
        setInputValue(newMessageContent); // Revert on failure
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setInputValue(newMessageContent);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Field 1 Suggestion Room</h2>
          <p className="text-xs text-slate-500">{messages.length} Messages • Online</p>
        </div>
        <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <MoreVertical className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 flex flex-col-reverse">
        {/* We use flex-col-reverse to keep scroll at bottom usually, but let's just use standard order with auto-scroll if needed. 
            Actually, let's reverse the array for display if we want newest at bottom, but standard chat is oldest at top.
            Let's keep standard order.
        */}
        <div className="flex flex-col space-y-6">
          {messages.map((msg) => {
            const isMe = currentUser && msg.user === (currentUser.user_metadata?.name || 'User');
            // Format timestamp nicely
            const timeString = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isMe ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {msg.avatar}
                </div>
                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{msg.user}</span>
                    <span className="text-xs text-slate-400">{timeString}</span>
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-green-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex gap-4 items-center">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your suggestion..." 
            className="flex-1 bg-slate-100 border-0 focus:ring-2 focus:ring-green-500 rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-400"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || loading}
            className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-600/20"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
