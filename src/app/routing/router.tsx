import { createBrowserRouter } from "react-router-dom";
import FeedPage from "../../pages/MainFeedPage";
import HomePage from "../../pages/HomePage";
import SignInPage from "../../pages/auth/SignInPage";
import SignUpPage from "../../pages/auth/SignUpPage";
import CreatePostPage from "../../pages/post/PostListPage";
import ProfilePage from "../../pages/profile/ProfilePage";
// import MessagePage from "../../pages/message/MessagePage";
// import SearchPage from "../../pages/search/SearchPage";
// import NotificationsPage from "../../pages/notifications/NotificationsPage";
import PATHS from "./path";
import RootLayout from "../ui/RootLayout";
import ProtectedRoute from "../providers/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.PROFILE,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.SIGN_IN,
        element: <SignInPage />,
      },
      {
        path: PATHS.SIGN_UP,
        element: <SignUpPage />,
      },
      // {
      //   path: PATHS.POST,
      //   element: <CreatePostPage />,
      // },
    ],
  },

  // {
  //   path: PATHS.MESSAGE,
  //   element: <MessagePage />,
  // },
  // {
  //   path: PATHS.SEARCH,
  //   element: <SearchPage />,
  // },
  // {
  //   path: PATHS.NOTIFICATIONS,
  //   element: <NotificationsPage />,
  // },
]);

export default router;
