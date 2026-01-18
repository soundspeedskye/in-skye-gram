import { useState } from "react";
import { Search, Hash, MapPin, X } from "lucide-react";
import { Sheet, SheetContent } from "@/shared/ui/lib/sheet";
import { Button } from "@/shared/ui/lib/button";
import { Input } from "@/shared/ui/lib/input";
import { Avatar } from "@/shared/ui/lib/avatar";
import { cn } from "@/app/style/utils";
import { mockSearchResults } from "@/shared/mocks/search";

interface SearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isEmbedded?: boolean;
}

export default function SearchSheet({
  isOpen,
  onClose,
  isEmbedded = false,
}: SearchSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "accounts" | "hashtags" | "places"
  >("all");

  const filteredResults = mockSearchResults.filter((result) => {
    if (activeTab === "all") return true;
    if (activeTab === "accounts") return result.type === "user";
    if (activeTab === "hashtags") return result.type === "hashtag";
    if (activeTab === "places") return result.type === "location";
    return true;
  });

  const renderSearchResult = (result: any) => {
    switch (result.type) {
      case "user":
        return (
          <div
            key={result.id}
            className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
          >
            <Avatar className="mr-3 w-11 h-11">
              <img
                src={result.avatar}
                alt={result.username}
                className="object-cover w-full h-full rounded-full"
              />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-sm font-semibold">{result.username}</span>
                {result.verified && (
                  <div className="flex items-center justify-center w-3 h-3 ml-1 bg-blue-500 rounded-full">
                    <span className="text-xs text-white">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">{result.fullName}</p>
              <p className="text-xs text-gray-400">{result.followers}</p>
            </div>
          </div>
        );

      case "hashtag":
        return (
          <div
            key={result.id}
            className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center justify-center mr-3 bg-gray-100 rounded-full w-11 h-11">
              <Hash className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold">{result.name}</span>
              <p className="text-sm text-gray-500">{result.postCount}</p>
            </div>
          </div>
        );

      case "location":
        return (
          <div
            key={result.id}
            className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center justify-center mr-3 bg-gray-100 rounded-full w-11 h-11">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold">{result.name}</span>
              <p className="text-sm text-gray-500">{result.locationType}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-0 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Search</h1>
          {isEmbedded && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-6 pb-0">
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-100 border-none rounded-lg"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4">
        <div className="flex space-x-2">
          {[
            { key: "all", label: "All" },
            { key: "accounts", label: "Accounts" },
            { key: "hashtags", label: "Hashtags" },
            { key: "places", label: "Places" },
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

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery.length > 0 ? (
          <div className="pb-6">
            {filteredResults.length > 0 ? (
              filteredResults.map(renderSearchResult)
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No results found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="px-6">
            <h3 className="mb-3 text-base font-semibold">Recent</h3>
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">No recent searches.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[400px] p-0">
        {content}
      </SheetContent>
    </Sheet>
  );
}
