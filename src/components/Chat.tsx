import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "Virgil";
}

interface NDTFile {
  id: string;
  filename: string;
  file_path: string;
  processed: boolean;
  created_at: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<NDTFile[]>([]);

  useEffect(() => {
    fetchFiles();
    subscribeToFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('ndt_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFiles(data);
      if (data.length > 0 && messages.length === 0) {
        setMessages([
          {
            id: Date.now(),
            text: `I see you have ${data.length} file(s) uploaded. Using this data, how can I help you?`,
            sender: "Virgil"
          }
        ]);
      }
    }
  };

  const subscribeToFiles = () => {
    const subscription = supabase
      .channel('ndt_files_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'ndt_files' 
        }, 
        payload => {
          setFiles(current => [payload.new as NDTFile, ...current]);
          setMessages(current => [
            ...current,
            {
              id: Date.now(),
              text: `New file "${(payload.new as NDTFile).filename}" has been uploaded. Would you like me to analyze it?`,
              sender: "Virgil"
            }
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      // Show loading state
      const loadingMessage: Message = {
        id: Date.now() + 1,
        text: "Analyzing your request...",
        sender: "Virgil",
      };
      setMessages(prev => [...prev, loadingMessage]);

      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          files: files,
        }),
      });

      const data = await response.json();

      // Replace loading message with actual response
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== loadingMessage.id),
        {
          id: Date.now() + 2,
          text: data.response,
          sender: "Virgil",
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== loadingMessage.id),
        {
          id: Date.now() + 2,
          text: "I apologize, but I encountered an error processing your request.",
          sender: "Virgil",
        },
      ]);
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Virgil</h2>
        <p className="text-sm text-muted-foreground">
          {files.length} file(s) available for analysis
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask..."
            className="min-h-[60px]"
          />
          <Button type="submit" className="bg-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};
