import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/shared/ui/lib/button";
import { Input } from "@/shared/ui/lib/input";
import { Separator } from "@/shared/ui/lib/separator";
import AuthFormLayout from "@/shared/ui/core/AuthFormLayout";
import AuthNavigationCard from "@/widgets/auth/ui/AuthNavigationCard";

// Props에서 불필요한 onSubmit은 제거하거나, 가입 성공 후 콜백으로 변경
interface Props {
  compact?: boolean;
}

const SignUpForm = ({ compact = false }: Props) => {
  const { signup } = useAuth();

  // 입력 상태 관리
  const [id, setId] = useState(""); // email -> id로 변경
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  // UI 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // 이전 에러 초기화
    setIsLoading(true);

    try {
      await signup(id, password, username, fullName); // email -> id로 변경
      console.log("Signup successful");
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
    } catch (err: any) {
      console.error("Sign up failed:", err);
      // 사용자에게 보여줄 에러 메시지 가공
      if (err.message.includes("already registered")) {
        setError("이미 가입된 이메일입니다.");
      } else {
        setError(err.message || "회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout
      compact={compact}
      navigationCard={<AuthNavigationCard type="signup" />}
    >
      <div className="mb-6 text-center">
        <p className="text-base font-semibold leading-5 text-gray-500">
          친구들의 사진과 동영상을 보려면 가입하세요.
        </p>
      </div>

      <Button className="w-full py-3 mb-4 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
        <svg
          className="w-4 h-4 mr-2 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook으로 로그인
      </Button>

      <div className="flex items-center my-4">
        <Separator className="flex-1 bg-gray-300" />
        <span className="mx-4 text-xs font-semibold text-gray-500 uppercase">
          또는
        </span>
        <Separator className="flex-1 bg-gray-300" />
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <Input
          type="text"
          placeholder="휴대폰 번호 또는 이메일 주소"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          disabled={isLoading}
          className="mb-3 h-[46px] bg-gray-50 border-gray-300 text-sm px-3 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 disabled:opacity-50"
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
          className="mb-3 h-[46px] bg-gray-50 border-gray-300 text-sm px-3 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 disabled:opacity-50"
        />
        <Input
          placeholder="성명"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={isLoading}
          className="mb-3 h-[46px] bg-gray-50 border-gray-300 text-sm px-3 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 disabled:opacity-50"
        />
        <Input
          placeholder="사용자 이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
          className="mb-4 h-[46px] bg-gray-50 border-gray-300 text-sm px-3 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 disabled:opacity-50"
        />

        <div className="mb-4 text-xs leading-4 text-center text-gray-500">
          <p>
            저희 서비스를 이용하는 사람이 회원님의 연락처 정보를 Instagram에
            업로드했을 수도 있습니다. 더{" "}
            <a href="#" className="text-blue-900 hover:underline">
              알아보기
            </a>
          </p>
        </div>

        {/* 에러 메시지 표시 영역 */}
        {error && (
          <div className="mb-4 text-sm font-medium text-center text-red-500">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 text-sm font-semibold leading-6 text-white bg-blue-500 rounded-lg shadow-none hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "가입 중..." : "가입"}
        </Button>
      </form>
    </AuthFormLayout>
  );
};

export default SignUpForm;
