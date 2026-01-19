import { createBrowserRouter } from "react-router-dom";
import FeedPage from "../../pages/MainFeedPage";
import SignInPage from "../../pages/auth/SignInPage";
import SignUpPage from "../../pages/auth/SignUpPage";
import ProfilePage from "../../pages/profile/ProfilePage";
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
    ],
  },
]);

export default router;
