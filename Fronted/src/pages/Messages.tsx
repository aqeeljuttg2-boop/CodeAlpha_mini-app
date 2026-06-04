/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Send, MessageSquare, ShieldCheck, Phone, Video, Search, Info } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatContact {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

const DEFAULT_CONTACTS: ChatContact[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    username: 'sarah_j',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isVerified: true,
    isOnline: true,
    lastMessage: 'Got the checkout prototype completed! Let me know what you think.',
    time: '45m ago',
    unreadCount: 1,
  },
  {
    id: '2',
    name: 'Alex Rivera',
    username: 'alex_code',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isVerified: true,
    isOnline: true,
    lastMessage: 'Let me look at those TS type constraints soon.',
    time: '2h ago',
    unreadCount: 0,
  },
  {
    id: '4',
    name: 'Marcus Chen',
    username: 'marcus_ai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isVerified: true,
    isOnline: false,
    lastMessage: 'The latent space paper is accepted at NeurIPS!',
    time: '1d ago',
    unreadCount: 0,
  },
];

const MOCK_REPLIES: Record<string, string[]> = {
  '1': [
    "Hey! That's a great point. I'll make sure to apply those visual updates to the spacing rules.",
    "Do you want to hop on a standard Huddle review to align design assets?",
    "Thanks for the prompt check! Spacing on 120Hz panels is always highly tactile.",
  ],
  '2': [
    "Yes, TypeScript 5.8 narrowing is incredibly robust for layout parameters.",
    "I am currently reviewing this component node for extra type safety.",
    "Let me know if we need to optimize our API controllers or the local DB sync layers.",
  ],
  '4': [
    "Absolutely! Multi-agent coordination solves so many developer orchestration bottlenecks.",
    "Our research team is opening up the GitHub repository next week.",
    "I will send over the ArXiv PDF draft right away for your feedback!",
  ],
};

export const Messages: React.FC = () => {
  const { user: authUser } = useAuth();
  
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<ChatContact>(DEFAULT_CONTACTS[0]);
  
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    '1': [
      { id: 'm1', senderId: '1', text: "Hey! Just pushed the latest CSS adjustments.", timestamp: '10:14 AM' },
      { id: 'm2', senderId: 'me', text: "Saw the commit! Spacing forms and paddings look extremely sleek.", timestamp: '10:17 AM' },
      { id: 'm3', senderId: '1', text: "Got the checkout prototype completed! Let me know what you think.", timestamp: '10:20 AM' },
    ],
    '2': [
      { id: 'm4', senderId: '2', text: "Are you free to audit the bundle size on compiler outputs?", timestamp: 'Yesterday' },
      { id: 'm5', senderId: 'me', text: "Sure! Let's schedule something right after lunch.", timestamp: 'Yesterday' },
      { id: 'm6', senderId: '2', text: "Let me look at those TS type constraints soon.", timestamp: 'Yesterday' },
    ],
    '4': [
      { id: 'm7', senderId: '4', text: "Great news regarding our latent space models paper!", timestamp: '2 days ago' },
      { id: 'm8', senderId: 'me', text: "No way! Did it get approved?", timestamp: '2 days ago' },
      { id: 'm9', senderId: '4', text: "The latent space paper is accepted at NeurIPS!", timestamp: '2 days ago' },
    ],
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
    
    // Clear unread multiplier when selecting contact
    if (selectedContact.unreadCount > 0) {
      setContacts((prev) =>
        prev.map((c) => (c.id === selectedContact.id ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [selectedContact, chatHistories]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !authUser) return;

    const userText = inputVal.trim();
    const currentMsgId = `me_${Date.now()}`;
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: currentMsgId,
      senderId: 'me',
      text: userText,
      timestamp: formattedTime,
    };

    // Append user message
    setChatHistories((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg],
    }));

    // Update contacts last message
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id ? { ...c, lastMessage: userText, time: 'Just now' } : c
      )
    );

    setInputVal('');
    setIsTyping(true);

    // Simulate smart bot typing delay
    setTimeout(() => {
      setIsTyping(false);
      const possibleReplies = MOCK_REPLIES[selectedContact.id] || [
        "That sounds amazing! Let's connect soon.",
      ];
      // Pick random response
      const randomReply = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const responseMsg: ChatMessage = {
        id: `reply_${Date.now()}`,
        senderId: selectedContact.id,
        text: randomReply,
        timestamp: responseTime,
      };

      setChatHistories((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), responseMsg],
      }));

      // Update contact pane with incoming response
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id ? { ...c, lastMessage: randomReply, time: 'Just now' } : c
        )
      );
    }, 1200);
  };

  const currentChatsHistory = chatHistories[selectedContact.id] || [];

  return (
    <div className="w-full flex shrink-0 h-[calc(100vh-100px)] bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-2xl overflow-hidden font-sans shadow-md">
      
      {/* LEFT CHATS SELECT LIST COLUMN (Responsive width collapsible) */}
      <div className="w-full sm:w-[280px] md:w-[320px] shrink-0 border-r border-zinc-150 dark:border-zinc-850 flex flex-col bg-zinc-50/50 dark:bg-zinc-950 h-full">
        <div className="p-4 border-b border-zinc-150 dark:border-zinc-850 flex flex-col gap-3 select-none">
          <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-650" />
            <span>Conversations</span>
          </h3>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search chat histories..."
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none"
              disabled
            />
          </div>
        </div>

        {/* Contacts array */}
        <div className="grow overflow-y-auto flex flex-col p-2 gap-1.5 scrollbar-none select-none">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`
                w-full p-3 flex gap-3 items-center rounded-xl text-left cursor-pointer transition-all duration-200
                ${selectedContact.id === contact.id
                  ? 'bg-blue-50 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/5'
                  : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 text-zinc-600'
                }
              `}
            >
              <div className="relative shrink-0">
                <Avatar src={contact.avatar} name={contact.name} size="sm" isVerified={contact.isVerified} />
                {contact.isOnline && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                )}
              </div>
              <div className="flex flex-col min-w-0 grow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {contact.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 shrink-0 select-none">
                    {contact.time}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-450 dark:text-zinc-400 truncate mt-0.5 leading-tight">
                  {contact.lastMessage}
                </p>
              </div>
              {contact.unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT MESSAGE PORT THREAD (Dynamic messaging screen) */}
      <div className="hidden sm:flex flex-col grow h-full bg-white dark:bg-zinc-900/20">
        
        {/* Contact head dashboard */}
        <div className="px-5 py-4 border-b border-zinc-150 dark:border-zinc-850 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3">
            <Avatar src={selectedContact.avatar} name={selectedContact.name} isVerified={selectedContact.isVerified} size="sm" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedContact.name}
                </span>
                {selectedContact.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                )}
              </div>
              <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase tracking-wider leading-none">
                {selectedContact.isOnline ? 'Active Online' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 hover:bg-zinc-105 rounded-xl cursor-default" title="Voice call">
              <Phone className="w-4.5 h-4.5" />
            </button>
            <button className="p-2 text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 hover:bg-zinc-105 rounded-xl cursor-default" title="Video call">
              <Video className="w-4.5 h-4.5" />
            </button>
            <button className="p-2 text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 hover:bg-zinc-105 rounded-xl cursor-default" title="Channel specifications">
              <Info className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Messaging History Streams */}
        <div className="grow overflow-y-auto px-5 py-4 flex flex-col gap-4 bg-zinc-50/[0.15] dark:bg-zinc-950/[0.05] scrollbar-thin">
          {currentChatsHistory.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div
                  className={`
                    px-4 py-2.5 rounded-2xl text-xs font-sans leading-relaxed shadow-xs
                    ${isMe
                      ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-tr-none'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-100 dark:border-zinc-850'
                    }
                  `}
                >
                  {msg.text}
                </div>
                <span className="text-[9.5px] font-bold text-zinc-400 mt-1 uppercase select-none tracking-wider">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="self-start flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-850 px-4 py-2.5 rounded-2xl rounded-tl-none select-none">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {selectedContact.name} is typing
              </span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200" />
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Entry field tool */}
        <form onSubmit={handleSend} className="p-4 border-t border-zinc-150 dark:border-zinc-850 select-none flex gap-3 shrink-0">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Message @${selectedContact.username}...`}
            className="
              grow rounded-xl border border-zinc-200 dark:border-zinc-800 px-4.5 py-2.5 text-xs
              bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all
            "
          />
          <Button type="submit" variant="primary" disabled={!inputVal.trim() || isTyping} className="px-5 font-bold shrink-0 rounded-xl">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Messages;
