// import { Avatar, AvatarFallback, AvatarImage } from "../lib/avatar";
// import { Button } from "../lib/button";
//
// interface SuggestedUser {
//   id: string;
//   username: string;
//   avatar: string;
//   followedBy: string;
//   isFollowing: boolean;
// }
//
// interface InstagramRightSidebarProps {
//   currentUser: {
//     username: string;
//     avatar: string;
//     fullName: string;
//   };
//   suggestedUsers: SuggestedUser[];
// }
//
// const mockSuggestedUsers: SuggestedUser[] = [
//   {
//     id: "1",
//     username: "travel_blogger",
//     avatar:
//       "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
//     followedBy: "photographer and 5 others",
//     isFollowing: false,
//   },
//   {
//     id: "2",
//     username: "foodie_adventures",
//     avatar:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//     followedBy: "friend1 and 12 others",
//     isFollowing: false,
//   },
//   {
//     id: "3",
//     username: "music_lover",
//     avatar:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
//     followedBy: "artist and 8 others",
//     isFollowing: false,
//   },
//   {
//     id: "4",
//     username: "fitness_motivation",
//     avatar:
//       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
//     followedBy: "friend2 and 23 others",
//     isFollowing: false,
//   },
//   {
//     id: "5",
//     username: "tech_geek",
//     avatar:
//       "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150&h=150&fit=crop&crop=face",
//     followedBy: "photographer and 15 others",
//     isFollowing: false,
//   },
// ];
//
// export default function InstagramRightSidebar({
//   currentUser = {
//     username: "your_username",
//     avatar:
//       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
//     fullName: "Your Name",
//   },
//   suggestedUsers = mockSuggestedUsers,
// }: Partial<InstagramRightSidebarProps> = {}) {
//   const footerLinks = [
//     "About",
//     "Help",
//     "Press",
//     "API",
//     "Jobs",
//     "Privacy",
//     "Terms",
//     "Locations",
//     "Language",
//     "Meta Verified",
//   ];
//
//   return (
//     <div className="fixed top-0 right-0 h-screen px-6 pt-8 overflow-y-auto w-80 bg-gray-50">
//       {/* Current User Profile */}
//       <div className="flex items-center mb-6">
//         <Avatar className="mr-3 w-14 h-14">
//           <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
//           <AvatarFallback>
//             {currentUser.username.charAt(0).toUpperCase()}
//           </AvatarFallback>
//         </Avatar>
//         <div className="flex-1">
//           <p className="text-sm font-semibold text-gray-800">
//             {currentUser.username}
//           </p>
//           <p className="text-sm text-gray-500">{currentUser.fullName}</p>
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-auto p-0 text-xs font-semibold text-blue-500 hover:text-blue-900 hover:bg-transparent"
//         >
//           Switch
//         </Button>
//       </div>
//
//       {/* Suggestions Header */}
//       <div className="flex items-center justify-between mb-4">
//         <p className="text-sm font-semibold text-gray-500">Suggested for you</p>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-auto p-0 text-xs font-semibold text-gray-800 hover:text-gray-500 hover:bg-transparent"
//         >
//           See All
//         </Button>
//       </div>
//
//       {/* Suggested Users */}
//       <div className="mb-8">
//         {suggestedUsers.slice(0, 5).map((user) => (
//           <div key={user.id} className="flex items-start py-2">
//             <Avatar className="w-8 h-8 mr-3">
//               <AvatarImage src={user.avatar} alt={user.username} />
//               <AvatarFallback>
//                 {user.username.charAt(0).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex-1 mr-3">
//               <p className="text-sm font-semibold text-gray-800">
//                 {user.username}
//               </p>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 Followed by {user.followedBy}
//               </p>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-auto p-0 text-xs font-semibold text-blue-500 hover:text-blue-900 hover:bg-transparent"
//             >
//               Follow
//             </Button>
//           </div>
//         ))}
//       </div>
//
//       {/* Footer Links */}
//       <div>
//         <div className="flex flex-wrap gap-1 mb-4">
//           {footerLinks.map((link, index) => (
//             <span
//               key={link}
//               className="text-[11px] text-gray-400 cursor-pointer hover:underline"
//             >
//               {link}
//               {index < footerLinks.length - 1 && " ·"}
//             </span>
//           ))}
//         </div>
//         <p className="text-[11px] text-gray-400">© 2024 Instagram from Meta</p>
//       </div>
//     </div>
//   );
// }
