import { useState } from "react";
import { Edit, Search, X } from "lucide-react";
import { Sheet, SheetContent } from "@/shared/ui/lib/sheet";
import { Button } from "@/shared/ui/lib/button";
import { Input } from "@/shared/ui/lib/input";
import { Avatar } from "@/shared/ui/lib/avatar";
import MessagePage from "@/pages/message/MessagePage";
import { mockChats } from "@/shared/mocks/message";

interface MessageSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isEmbedded?: boolean;
  selectedChatId?: string | null;
  onChatSelect?: (chatId: string) => void;
}

export default function MessageSheet({
  isOpen,
  onClose,
  isEmbedded = false,
  selectedChatId,
  onChatSelect,
}: MessageSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(
    selectedChatId || null
  );

  const filteredChats = mockChats.filter(
    (chat) =>
      chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatSelect = (chatId: string) => {
    if (onChatSelect) {
      onChatSelect(chatId);
    } else {
      setSelectedChat(chatId);
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const chatListContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Edit className="w-5 h-5" />
            </Button>
            {isEmbedded && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-100 border-none rounded-lg"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <div className="pb-4">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="relative mr-3">
                  <Avatar className="w-14 h-14">
                    <img
                      src={chat.avatar}
                      alt={chat.username}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </Avatar>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm truncate">
                      {chat.username}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {chat.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm truncate mr-2">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );

  // embedded 모드일 때는 항상 채팅 리스트만 표시
  if (isEmbedded) {
    return chatListContent;
  }

  // 일반 Sheet 모드에서는 기존 로직 유지
  if (selectedChat) {
    const selectedChatData = mockChats.find((chat) => chat.id === selectedChat);

    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[800px] p-0">
          <MessagePage
            selectedChat={selectedChatData}
            onBack={handleBackToList}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[400px] p-0">
        {chatListContent}
      </SheetContent>
    </Sheet>
  );
}
