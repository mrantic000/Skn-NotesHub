import React, { useState, useEffect, useRef } from "react";
import { Send, Settings, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/context/ProfileContext";
import ProfileModal from "@/components/ProfileModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  profile_id?: string;
  avatar_url?: string | null;
}

const Discussion = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('discussion_messages')
        .select(`
          id, 
          message, 
          timestamp,
          username,
          profile_id,
          user_profiles:profile_id (
            avatar_url
          )
        `)
        .order('timestamp', { ascending: true });
        
      if (error) {
        console.error("Error fetching messages:", error);
        toast.error("Couldn't load messages");
        return;
      }
      
      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          user: msg.username || 'Anonymous',
          message: msg.message,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          profile_id: msg.profile_id,
          avatar_url: msg.user_profiles?.avatar_url
        }));
        
        setMessages(formattedMessages);
      }
    };
    
    fetchMessages();
    
    const channel = supabase
      .channel('public:discussion_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'discussion_messages' 
      }, async payload => {
        const newMsg = payload.new as any;
        
        let avatarUrl = null;
        if (newMsg.profile_id) {
          const { data } = await supabase
            .from('user_profiles')
            .select('avatar_url')
            .eq('id', newMsg.profile_id)
            .single();
          
          avatarUrl = data?.avatar_url;
        }
        
        const formattedMessage = {
          id: newMsg.id,
          user: newMsg.username || 'Anonymous',
          message: newMsg.message,
          timestamp: new Date(newMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          profile_id: newMsg.profile_id,
          avatar_url: avatarUrl
        };
        
        setMessages(prev => [...prev, formattedMessage]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const messageUser = profile?.username || username || 'Anonymous';
    
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from('discussion_messages').insert({
        username: messageUser,
        message: newMessage,
        profile_id: profile?.id || null
      });
      
      if (error) throw error;
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto py-4 sm:py-8 px-3 sm:px-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient-to-r from-indigo-700 to-purple-800 mb-1 sm:mb-2">Discussion Group</h1>
        <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-8">
          Connect with other students to discuss subjects, share resources, and solve doubts.
        </p>

        <Card className="p-0 overflow-hidden h-[75vh] sm:h-[70vh] flex flex-col shadow-lg border border-purple-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-3 sm:p-4 border-b flex justify-between items-center text-white">
            <h3 className="font-semibold text-sm sm:text-base">Live Chat - SPPU StudyHub</h3>
          </div>

          <ScrollArea className="flex-grow p-3 sm:p-4 bg-white">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-3 ${
                    msg.profile_id === profile?.id
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                    {msg.avatar_url ? (
                      <AvatarImage src={msg.avatar_url} alt={msg.user} />
                    ) : (
                      <AvatarFallback className={`${
                        msg.profile_id === profile?.id ? "bg-purple-600" : "bg-indigo-600"
                      } text-white`}>
                        {msg.user.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`max-w-[75%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                      msg.profile_id === profile?.id
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "bg-gradient-to-r from-slate-100 to-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-xs sm:text-sm">
                        {msg.profile_id === profile?.id ? "You" : msg.user}
                      </span>
                      <span className={`text-[10px] sm:text-xs ${msg.profile_id === profile?.id ? "text-white/70" : "text-gray-500"}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm break-words">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-3 sm:p-4 border-t bg-white">
            {!profile && (
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name (optional)"
                className="mb-2 border-purple-200 focus-visible:ring-purple-400 text-sm"
              />
            )}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="flex-grow border-purple-200 focus-visible:ring-purple-400 text-sm"
              />
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                className="px-3 sm:px-4 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <footer className="bg-gradient-to-r from-gray-100 to-slate-100 py-4 sm:py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} SKN NotesHub - SPPU Resources Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default Discussion;
