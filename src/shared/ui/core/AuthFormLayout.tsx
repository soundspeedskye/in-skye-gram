import type { ReactNode } from "react";
import { cn } from "@/app/style/utils";
import instagramTextLogo from "@/shared/assets/icons/instagram-text.svg";

interface AuthFormLayoutProps {
  children: ReactNode;
  compact?: boolean;
  navigationCard?: ReactNode;
}

const AuthFormLayout = ({
  children,
  compact = false,
  navigationCard,
}: AuthFormLayoutProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center",
        compact ? "justify-start" : "justify-center min-h-screen p-5",
        compact ? "p-0" : "bg-white",
        "font-sans"
      )}
    >
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
