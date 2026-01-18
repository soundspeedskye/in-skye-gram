import { useState } from "react";
import { X, Heart, MessageCircle, UserPlus, Camera } from "lucide-react";
import { Button } from "@/shared/ui/lib/button";
import { Avatar } from "@/shared/ui/lib/avatar";
import { cn } from "@/app/style/utils";
import { mockNotifications } from "@/shared/mocks/notification";

interface NotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isEmbedded?: boolean;
}

export default function NotificationSheet({
  isOpen,
  onClose,
  isEmbedded = false,
}: NotificationSheetProps) {
  const [activeTab, setActiveTab] = useState<"all" | "following">("all");

  const filteredNotifications = mockNotifications.filter(
    (notification: any) => {
      if (activeTab === "all") return true;
      if (activeTab === "following") return notification.isFollowing;
      return true;
    }
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-6 h-6 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle className="w-6 h-6 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-6 h-6 text-green-500" />;
      case "mention":
        return <Camera className="w-6 h-6 text-purple-500" />;
      default:
        return <Heart className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-0 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {isEmbedded && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4 border-b">
        <div className="flex space-x-2">
          {[
            { key: "all", label: "All" },
            { key: "following", label: "Following" },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "text-sm font-medium",
                activeTab === tab.key
                  ? "bg-black text-white hover:bg-black/90"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div className="pb-4">
            {filteredNotifications.map((notification: any) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                  !notification.isRead && "bg-blue-50"
                )}
              >
                <div className="relative mr-3">
                  <Avatar className="w-11 h-11">
                    <img
                      src={notification.userAvatar}
                      alt={notification.username}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold">
                      {notification.username}
                    </span>
                    {notification.isVerified && (
                      <div className="flex items-center justify-center w-3 h-3 bg-blue-500 rounded-full">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="flex text-sm text-gray-600 truncate flex-start">
                    {notification.message}
                  </p>
                  <p className="flex mt-1 text-xs text-gray-400 flex-start">
                    {getTimeAgo(notification.timestamp)}
                  </p>
                </div>

                {notification.postImage && (
                  <div className="flex-shrink-0 overflow-hidden bg-gray-100 rounded w-11 h-11">
                    <img
                      src={notification.postImage}
                      alt="Post"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                {notification.type === "follow" && (
                  <Button
                    variant={notification.isFollowing ? "outline" : "default"}
                    size="sm"
                    className="px-3 py-1 text-xs"
                  >
                    {notification.isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="mb-2 text-lg font-medium text-gray-500">
              No notifications yet
            </p>
            <p className="text-sm text-gray-400">
              When someone likes or comments on your posts, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  // 일반 Sheet 모드 (현재는 사용하지 않지만 확장성을 위해 유지)
  return content;
}
