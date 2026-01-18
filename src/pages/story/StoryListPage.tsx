import StoryItemCard from "@/entities/story/ui/StoryItemCard";
import { storiesData } from "@/shared/mocks/story";

export default function StoryListPage() {
  return (
    <div className="flex items-center gap-4 py-4 overflow-x-auto scrollbar-hide ">
      {storiesData.map((story) => (
        <StoryItemCard key={story.id} story={story} />
      ))}
    </div>
  );
}
