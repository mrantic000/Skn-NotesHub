
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Book, Send, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/context/ProfileContext";
import ProfileModal from "@/components/ProfileModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  profile_id?: string;
  avatar_url?: string | null;
}

const Discussion = () => {
  const { profile, loading: profileLoading, ProfileAvatar } = useProfile();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch initial messages
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
          user: msg.username,
          message: msg.message,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          profile_id: msg.profile_id,
          avatar_url: msg.user_profiles?.avatar_url
        }));
        
        setMessages(formattedMessages);
      }
    };
    
    fetchMessages();
  }, []);
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!profile) return;
    
    const channel = supabase
      .channel('public:discussion_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'discussion_messages' 
      }, async payload => {
        const newMsg = payload.new as any;
        
        // Fetch profile info if available
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
          user: newMsg.username,
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
  }, [profile]);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!profile || !newMessage.trim()) return;

    try {
      const { error } = await supabase.from('discussion_messages').insert({
        username: profile.username,
        message: newMessage,
        profile_id: profile.id
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

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-4 md:px-8 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <Book size={28} />
            <h1 className="text-xl md:text-2xl font-bold">SKN NotesHub</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/cs" className="text-white hover:text-white/80">
              CS
            </Link>
            <Link to="/it" className="text-white hover:text-white/80">
              IT
            </Link>
            <Button 
              variant="ghost" 
              className="p-2" 
              onClick={() => setIsProfileModalOpen(true)}
            >
              <ProfileAvatar className="h-8 w-8" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="page-title">Discussion Group</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Connect with other students to discuss subjects, share resources, and solve doubts.
        </p>

        <Card className="p-0 overflow-hidden h-[70vh] flex flex-col">
          <div className="bg-muted p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Live Chat - SPPU StudyHub</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2" 
              onClick={() => setIsProfileModalOpen(true)}
            >
              <Settings size={16} className="mr-2" />
              Profile
            </Button>
          </div>

          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.profile_id === profile?.id
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  {msg.avatar_url ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={msg.avatar_url} 
                        alt={msg.user} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.profile_id === profile?.id ? "bg-primary" : "bg-accent"
                      } text-white`}
                    >
                      {msg.user.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.profile_id === profile?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">
                        {msg.profile_id === profile?.id ? "You" : msg.user}
                      </span>
                      <span className="text-xs opacity-70">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} className="px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <ProfileModal 
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-background py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SKN NotesHub - SPPU Resources Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default Discussion;
