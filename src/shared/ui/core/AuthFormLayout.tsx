import type { ReactNode } from "react";
import { cn } from "@/app/style/utils";
import instagramTextLogo from "@/shared/assets/icons/instagram-text.svg";

interface AuthFormLayoutProps {
  children: ReactNode;
  navigationCard?: ReactNode;
}

const AuthFormLayout = ({ children, navigationCard }: AuthFormLayoutProps) => {
  return (
    <div className={cn("flex flex-col items-center", "font-sans")}>
      <div className="bg-white border border-gray-300 rounded-sm p-10 w-[350px] mb-3">
        {/* Instagram 로고 */}
        <div className="flex justify-center mb-6">
          <img
            src={instagramTextLogo}
            alt="Instagram"
            className="h-[51px] w-auto"
          />
        </div>

        {children}
      </div>

      {/* Navigation Card */}
      {navigationCard}
    </div>
  );
};

export default AuthFormLayout;
