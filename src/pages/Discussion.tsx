
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Book, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

const Discussion = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('discussion_messages')
        .select('*')
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
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        setMessages(formattedMessages);
      }
    };
    
    fetchMessages();
  }, []);
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!isJoined) return;
    
    const channel = supabase
      .channel('public:discussion_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'discussion_messages' 
      }, payload => {
        const newMsg = payload.new as any;
        const formattedMessage = {
          id: newMsg.id,
          user: newMsg.username,
          message: newMsg.message,
          timestamp: new Date(newMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, formattedMessage]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isJoined]);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    setIsJoined(true);
    toast.success(`Welcome to the discussion, ${username}!`);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from('discussion_messages').insert({
        username: username,
        message: newMessage
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
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="page-title">Discussion Group</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Connect with other students to discuss subjects, share resources, and solve doubts.
        </p>

        {!isJoined ? (
          <Card className="p-6 max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center">Join the Discussion</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                  Choose a Username
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                />
              </div>
              <Button onClick={handleJoin} className="w-full">
                Join Chat
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden h-[70vh] flex flex-col">
            <div className="bg-muted p-4 border-b">
              <h3 className="font-semibold">Live Chat - SPPU StudyHub</h3>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.user === username
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.user === username ? "bg-primary" : "bg-accent"
                    } text-white`}
                  >
                    {msg.user.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.user === username
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">
                        {msg.user === username ? "You" : msg.user}
                      </span>
                      <span className="text-xs opacity-70">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

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
        )}
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
