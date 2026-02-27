'use client';

import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video, User, CheckCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const CONTACTS = [
  { id: 1, name: 'Ama Serwaa', lastMessage: 'Is the tilapia available?', time: '10:30 AM', unread: 2, online: true, avatar: 'https://picsum.photos/seed/ama/100' },
  { id: 2, name: 'Kwame Boateng', lastMessage: 'Thanks for the delivery!', time: 'Yesterday', unread: 0, online: false, avatar: 'https://picsum.photos/seed/kwame/100' },
  { id: 3, name: 'Fresh Fish Co.', lastMessage: 'We need 100kg of catfish.', time: 'Monday', unread: 0, online: true, avatar: 'https://picsum.photos/seed/fresh/100' },
  { id: 4, name: 'Mama G Kitchen', lastMessage: 'Can I pay via MoMo?', time: 'Monday', unread: 0, online: false, avatar: 'https://picsum.photos/seed/mama/100' },
];

const INITIAL_MESSAGES = [
  { id: 1, senderId: 1, text: 'Hello! I saw your listing for fresh Tilapia.', time: '10:25 AM', status: 'read' },
  { id: 2, senderId: 0, text: 'Hi Ama! Yes, we just harvested them this morning.', time: '10:26 AM', status: 'read' },
  { id: 3, senderId: 1, text: 'Great! Is the 50kg still available?', time: '10:28 AM', status: 'read' },
  { id: 4, senderId: 1, text: 'I would like to pick it up this afternoon.', time: '10:30 AM', status: 'sent' },
];

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      senderId: 0, // 0 is the current user
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-180px)] flex bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm">
      {/* Sidebar */}
      <div className="w-80 border-r border-zinc-100 flex flex-col">
        <div className="p-6 border-bottom border-zinc-100">
          <h1 className="text-xl font-bold text-zinc-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a907a]/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {CONTACTS.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={cn(
                "p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-zinc-50",
                selectedContact.id === contact.id ? "bg-[#4a907a]/5 border-r-4 border-[#4a907a]" : ""
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-100">
                  <Image src={contact.avatar} alt={contact.name} width={48} height={48} className="object-cover" />
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-zinc-900 truncate">{contact.name}</h3>
                  <span className="text-[10px] text-zinc-400">{contact.time}</span>
                </div>
                <p className="text-xs text-zinc-500 truncate">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-[#4a907a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-zinc-50/30">
        {/* Header */}
        <div className="p-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-100">
              <Image src={selectedContact.avatar} alt={selectedContact.name} width={40} height={40} className="object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">{selectedContact.name}</h3>
              <p className="text-[10px] text-emerald-500 font-medium">
                {selectedContact.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[70%]",
                msg.senderId === 0 ? "ml-auto items-end" : "items-start"
              )}
            >
              <div className={cn(
                "p-4 rounded-2xl text-sm",
                msg.senderId === 0 
                  ? "bg-[#4a907a] text-white rounded-tr-none shadow-sm" 
                  : "bg-white text-zinc-700 border border-zinc-100 rounded-tl-none shadow-sm"
              )}>
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-zinc-400">{msg.time}</span>
                {msg.senderId === 0 && (
                  msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <CheckCheck className="w-3 h-3 text-zinc-300" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-zinc-100">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a907a]/20 transition-all"
            />
            <button 
              type="submit"
              className="w-12 h-12 bg-[#4a907a] text-white rounded-2xl flex items-center justify-center hover:bg-[#3d7a66] transition-all shadow-lg shadow-[#4a907a]/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
