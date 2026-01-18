import { RouterProvider } from "react-router-dom";
import router from "../routing/router";

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
