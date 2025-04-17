
import React, { useState, useEffect, useRef } from "react";
import { Send, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/context/ProfileContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  profile_id?: string;
  avatar_url?: string | null;
}

const Discussion = () => {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<number>(1); // Default to 1 (self)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Track the message loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      
      try {
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
          throw error;
        }
        
        if (data) {
          const formattedMessages = data.map(msg => ({
            id: msg.id,
            user: msg.username || 'Anonymous',
            message: msg.message,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            profile_id: msg.profile_id,
            avatar_url: msg.user_profiles?.avatar_url
          }));
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Couldn't load messages. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription for new messages
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
          timestamp: new Date(newMsg.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          profile_id: newMsg.profile_id,
          avatar_url: avatarUrl
        };
        
        setMessages(prev => [...prev, formattedMessage]);
      })
      .subscribe();
      
    // Set up presence channel to track active users
    const presenceChannel = supabase.channel('room:discussion')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const count = Object.keys(state).length;
        setOnlineUsers(count > 0 ? count : 1); // Always at least 1
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user_id: profile?.id || uuidv4() });
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(presenceChannel);
    };
  }, [profile?.id]);
  
  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

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

  // Generate randomized colors for avatars based on username
  const getUserColor = (username: string): string => {
    const colors = [
      'bg-purple-600', 'bg-indigo-600', 'bg-blue-600', 
      'bg-teal-600', 'bg-green-600', 'bg-pink-600'
    ];
    
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto py-4 sm:py-8 px-3 sm:px-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient-to-r from-indigo-700 to-purple-800 mb-1 sm:mb-2">Discussion Group</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Connect with other students to discuss subjects and solve doubts.
            </p>
          </div>
          <Badge className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
            <span>{onlineUsers} online</span>
          </Badge>
        </div>

        <Card className="p-0 overflow-hidden h-[75vh] sm:h-[70vh] flex flex-col shadow-lg border border-purple-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-3 sm:p-4 border-b flex justify-between items-center text-white">
            <h3 className="font-semibold text-sm sm:text-base">Live Chat - SPPU StudyHub</h3>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <Clock size={14} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <ScrollArea className="flex-grow p-3 sm:p-4 bg-white">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="h-8 w-8 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-muted-foreground text-sm">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <User className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
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
                    <Avatar className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
                      {msg.avatar_url ? (
                        <AvatarImage src={msg.avatar_url} alt={msg.user} />
                      ) : (
                        <AvatarFallback className={`${
                          getUserColor(msg.user)
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
                        <span className={`font-medium text-xs sm:text-sm ${
                          msg.profile_id === profile?.id ? "" : "text-indigo-700"
                        }`}>
                          {msg.profile_id === profile?.id ? "You" : msg.user}
                        </span>
                        <span className={`text-[10px] sm:text-xs ${
                          msg.profile_id === profile?.id ? "text-white/70" : "text-gray-500"
                        }`}>
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className="p-3 sm:p-4 border-t bg-white">
            {!profile && (
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name (optional)"
                className="mb-3 border-purple-200 focus-visible:ring-purple-400 text-sm"
              />
            )}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="flex-grow border-purple-200 focus-visible:ring-purple-400 text-sm"
                maxLength={500}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-right">
              Press Enter to send
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
