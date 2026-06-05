import { useState } from "react";
import { ArrowLeft, Phone, Video, Info, Send, Smile } from "lucide-react";
import { Button } from "@/shared/ui/lib/button";
import { Input } from "@/shared/ui/lib/input";
import { Avatar } from "@/shared/ui/lib/avatar";
import { mockMessages, mockChats } from "@/shared/mocks/message";

interface MessagePageProps {
  selectedChat?: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    isOnline: boolean;
  };
  selectedChatId?: string;
  onBack: () => void;
}

export default function MessagePage({
  selectedChat,
  selectedChatId,
  onBack,
}: MessagePageProps) {
  const [message, setMessage] = useState("");

  // selectedChatId가 있으면 mockChats에서 해당 chat을 찾아서 사용
  const chatData = selectedChatId
    ? mockChats.find((chat) => chat.id === selectedChatId)
    : selectedChat;

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would normally send the message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chatData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="relative mr-3">
            <Avatar className="w-10 h-10">
              <img
                src={chatData.avatar}
                alt={chatData.username}
                className="object-cover w-full h-full rounded-full"
              />
            </Avatar>
            {chatData.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold">{chatData.username}</h3>
            <p className="text-sm text-gray-500">
              {chatData.isOnline ? "Active now" : "Last seen recently"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.isOwn
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-900 rounded-bl-sm"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.isOwn ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Input
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10 border-gray-300 rounded-full"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute transform -translate-y-1/2 right-1 top-1/2"
            >
              <Smile className="w-5 h-5 text-gray-400" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            variant={message.trim() ? "default" : "ghost"}
            size="icon"
            className="rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
