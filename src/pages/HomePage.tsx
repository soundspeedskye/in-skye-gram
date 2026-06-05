import SignInForm from "@/features/auth/sign-in/ui/SignInForm";
import instagramEntry from "@/shared/assets/icons/instagram-entry.png";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-12 p-5 bg-white md:flex-row md:gap-16">
      {/* 왼쪽 Instagram Entry 이미지 */}
      <div className="flex-none max-w-[454px] w-full">
        <img
          src={instagramEntry}
          alt="Instagram Entry"
          className="w-full h-auto max-w-[454px]"
        />
      </div>

      {/* 오른쪽 SignIn Form */}
      <div className="flex-none w-[350px]">
        <SignInForm onSubmit={() => {}} isLoading={false} apiError={null} />
      </div>
    </div>
  );
}
