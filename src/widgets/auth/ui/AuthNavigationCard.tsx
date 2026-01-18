import { useNavigate } from "react-router-dom";
import PATHS from "@/app/routing/path";

interface AuthNavigationCardProps {
  type: "signin" | "signup";
}

const AuthNavigationCard = ({ type }: AuthNavigationCardProps) => {
  const navigate = useNavigate();

  const isSignIn = type === "signin";

  return (
    <div className="bg-white border border-gray-300 rounded-sm text-gray-800 text-sm text-center py-6 px-6 w-[350px]">
      <span className="text-sm">
        {isSignIn ? "계정이 없으신가요? " : "계정이 있으신가요? "}
      </span>
      <button
        onClick={() => navigate(isSignIn ? PATHS.SIGN_UP : PATHS.SIGN_IN)}
        className="text-sm font-semibold text-blue-500 hover:underline bg-transparent border-none cursor-pointer"
      >
        {isSignIn ? "가입하기" : "로그인"}
      </button>
    </div>
  );
};

export default AuthNavigationCard;
