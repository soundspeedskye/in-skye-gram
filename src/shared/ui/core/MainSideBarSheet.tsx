import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, Search, MessageCircle, Heart, Plus } from "lucide-react";
import { cn } from "@/app/style/utils";
import { Button } from "@/shared/ui/lib/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/lib/avatar";
import InstagramTextLogo from "@/shared/assets/icons/instagram-text.svg";
import InstagramIcon from "@/shared/assets/icons/instagram.svg";
import SearchSheet from "@/widgets/search/ui/SearchSheet";
import MessageSheet from "@/widgets/message/ui/MessageSheet";
import MessagePage from "@/pages/message/MessagePage";
import NotificationSheet from "@/widgets/notification/ui/NotificationSheet";
import CreatePostForm from "@/features/feed/feed-list/create-feed-list/ui/CreatePostForm";
import { mockProfile } from "@/shared/mocks/profile";

export default function MainSideBarSheet() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchSheetOpen, setSearchSheetOpen] = useState(false);
  const [messageSheetOpen, setMessageSheetOpen] = useState(false);
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);
  const [createPostSheetOpen, setCreatePostSheetOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Search", icon: Search, path: "/search", hasSheet: true },
    {
      name: "Messages",
      icon: MessageCircle,
      path: "/messages",
      hasSheet: true,
    },
    {
      name: "Notifications",
      icon: Heart,
      path: "/notifications",
      hasSheet: true,
    },
    {
      name: "Create",
      icon: Plus,
      path: "/create",
      hasSheet: true,
    },
  ];

  const handleNavigation = (
    path: string,
    hasSheet?: boolean,
    name?: string,
  ) => {
    if (hasSheet) {
      if (name === "Search") {
        setSearchSheetOpen(true);
      } else if (name === "Messages") {
        setMessageSheetOpen(true);
      } else if (name === "Notifications") {
        setNotificationSheetOpen(true);
      } else if (name === "Create") {
        setCreatePostSheetOpen(true);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* Main Sidebar */}
      <div className="w-[72px] md:w-[240px] h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
        {/* 로고 영역 */}
        <div className="flex justify-center px-3 py-10 md:pl-6 md:justify-start">
          {/* 1. 좁을 때 (72px) 보여줄 아이콘 */}
          <img
            src={InstagramIcon}
            alt="Instagram Icon"
            className="block w-10 h-10 md:hidden"
          />

          {/* 2. 넓을 때 (280px) 보여줄 텍스트 로고 */}
          <img
            src={InstagramTextLogo}
            alt="Instagram"
            className="hidden w-auto h-10 md:block"
          />
        </div>

        {/* 메뉴 리스트 */}
        <nav className="px-3 lg:px-1.5 flex-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.name === "Search" && searchSheetOpen) ||
              (item.name === "Messages" && messageSheetOpen) ||
              (item.name === "Notifications" && notificationSheetOpen) ||
              (item.name === "Create" && createPostSheetOpen);

            return (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-center md:justify-start px-3 py-4 md:py-3 mb-1 bg-transparent hover:bg-transparent",
                  isActive ? "font-semibold" : "",
                )}
                onClick={() =>
                  handleNavigation(item.path, item.hasSheet, item.name)
                }
              >
                <IconComponent
                  className={cn(
                    "w-11 h-11 shrink-0 transition-all",
                    "md:mr-4",
                    isActive &&
                      (item.name === "Notifications" || item.name === "Create"
                        ? "fill-current"
                        : ""),
                  )}
                />
                {/* 텍스트: md 이상에서만 표시 */}
                <span className="hidden overflow-hidden text-base md:block whitespace-nowrap">
                  {item.name}
                </span>
              </Button>
            );
          })}
        </nav>

        {/* 프로필 영역 */}
        <div className="px-3 lg:px-1.5 pb-6">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-center md:justify-start px-3 py-4 md:py-3 bg-transparent hover:bg-transparent",
              location.pathname === "/profile" ? "font-semibold" : "",
            )}
            onClick={() => navigate("/profile")}
          >
            <Avatar className="w-11 h-11 shrink-0 md:mr-4">
              <AvatarImage
                src={mockProfile.avatar}
                alt={mockProfile.username}
              />
              <AvatarFallback>
                {mockProfile.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* 텍스트: md 이상에서만 표시 */}
            <span className="hidden overflow-hidden text-base md:block whitespace-nowrap">
              Profile
            </span>
          </Button>
        </div>
      </div>
      {/* Backdrop - Sheet가 열렸을 때 배경 dim 처리 */}
      {(searchSheetOpen ||
        messageSheetOpen ||
        notificationSheetOpen ||
        createPostSheetOpen) && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => {
            setSearchSheetOpen(false);
            setMessageSheetOpen(false);
            setNotificationSheetOpen(false);
            setCreatePostSheetOpen(false);
          }}
        />
      )}{" "}
      {/* Search Sheet - overlay로 표시 */}
      {searchSheetOpen && (
        <div className="fixed top-0 left-[72px] md:left-[240px] z-40 h-full w-[400px] bg-white border-r border-gray-200 shadow-xl animate-in slide-in-from-left duration-300">
          <div className="h-full overflow-hidden">
            <SearchSheet
              isOpen={searchSheetOpen}
              onClose={() => setSearchSheetOpen(false)}
              isEmbedded={true}
            />
          </div>
        </div>
      )}
      {/* Message Sheet - overlay로 표시 */}
      {messageSheetOpen && (
        <div className="fixed top-0 left-[72px] md:left-[240px] z-40 h-full flex bg-white border-r border-gray-200 shadow-xl animate-in slide-in-from-left duration-300">
          {/* MessageSheet 항상 표시 */}
          <div className="w-[400px] border-r border-gray-200">
            <div className="h-full overflow-hidden">
              <MessageSheet
                isOpen={messageSheetOpen}
                onClose={() => {
                  setMessageSheetOpen(false);
                  setSelectedChatId(null);
                }}
                isEmbedded={true}
                selectedChatId={selectedChatId}
                onChatSelect={setSelectedChatId}
              />
            </div>
          </div>

          {/* MessagePage - chat 선택 시에만 표시 */}
          {selectedChatId && (
            <div className="w-[600px] animate-in slide-in-from-right duration-300">
              <div className="h-full overflow-hidden">
                <MessagePage
                  selectedChatId={selectedChatId}
                  onBack={() => setSelectedChatId(null)}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Notification Sheet - overlay로 표시 */}
      {notificationSheetOpen && (
        <div className="fixed top-0 left-[72px] md:left-[280px] z-40 h-full w-[400px] bg-white border-r border-gray-200 shadow-xl animate-in slide-in-from-left duration-300">
          <div className="h-full overflow-hidden">
            <NotificationSheet
              isOpen={notificationSheetOpen}
              onClose={() => setNotificationSheetOpen(false)}
              isEmbedded={true}
            />
          </div>
        </div>
      )}
      {/* Create Post Sheet - overlay로 표시 */}
      {createPostSheetOpen && (
        <div className="fixed top-0 left-[72px] md:left-[280px] z-40 h-full w-[500px] bg-white border-r border-gray-200 shadow-xl animate-in slide-in-from-left duration-300">
          <div className="h-full overflow-hidden">
            <CreatePostForm
              onClose={() => setCreatePostSheetOpen(false)}
              isEmbedded={true}
              onSubmit={(data) => {
                console.log("Created post:", data);
                setCreatePostSheetOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
