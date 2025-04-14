
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Book, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Mock chat data
const initialMessages = [
  {
    id: 1,
    user: "Raj",
    message: "Hey everyone! Anyone has the question papers for last year's DBMS exam?",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    user: "Priya",
    message: "I've uploaded them to the DBMS section under Imp Questions tag!",
    timestamp: "10:35 AM",
  },
  {
    id: 3,
    user: "Arjun",
    message: "Thanks Priya! Could someone share M3 notes as well?",
    timestamp: "10:40 AM",
  },
  {
    id: 4,
    user: "Meera",
    message: "I'll upload my M3 notes by evening. They cover all the important topics.",
    timestamp: "10:45 AM",
  },
];

const Discussion = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    setIsJoined(true);
    toast.success(`Welcome to the discussion, ${username}!`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const message = {
      id: messages.length + 1,
      user: username,
      message: newMessage,
      timestamp: timeString,
    };

    setMessages([...messages, message]);
    setNewMessage("");
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
