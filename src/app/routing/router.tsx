import { createBrowserRouter } from "react-router-dom";
import FeedPage from "../../pages/MainFeedPage";
import PATHS from "./path";
import RootLayout from "../ui/RootLayout";
import { SignInPage } from "@/pages/auth/SignInPage";
import { SignUpPage } from "@/pages/auth/SignUpPage";
import ProfilePage from "@/pages/user-profile/ProfilePage";

const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <FeedPage />,
      },
      {
        path: PATHS.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: PATHS.SIGN_IN,
        element: <SignInPage />,
      },
      {
        path: PATHS.SIGN_UP,
        element: <SignUpPage />,
      },
    ],
  },
]);

export default router;
