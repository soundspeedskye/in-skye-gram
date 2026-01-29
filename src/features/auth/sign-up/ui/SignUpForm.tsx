import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/lib/button";
import { Input } from "@/shared/ui/lib/input";
import { Separator } from "@/shared/ui/lib/separator";
import AuthFormLayout from "@/shared/ui/core/AuthFormLayout";
import AuthNavigationCard from "@/widgets/auth/ui/AuthNavigationCard";
import { FaFacebook } from "react-icons/fa";
import { signUpSchema, type SignUpSchema } from "../model/sign-up.schema";
import { useForm } from "react-hook-form";

interface Props {
  onSubmit: (data: SignUpSchema) => void;
  isLoading: boolean;
  apiError: Error | null;
}

const SignUpForm = ({ onSubmit, isLoading, apiError }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const serverErrorMessage = apiError?.message;

  return (
    <AuthFormLayout navigationCard={<AuthNavigationCard type="signup" />}>
      <div className="mb-6 text-center">
        <p className="text-base font-semibold leading-5 text-gray-500">
          친구들의 사진과 동영상을 보려면 가입하세요.
        </p>
      </div>

      <Button className="w-full py-3 mb-4 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
        <FaFacebook />
        Facebook으로 로그인
      </Button>

      <div className="flex items-center my-4">
        <Separator className="flex-1 bg-gray-300" />
        <span className="mx-4 text-xs font-semibold text-gray-500 uppercase">
          또는
        </span>
        <Separator className="flex-1 bg-gray-300" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4" noValidate>
        <Input
          variant="sign"
          type="text"
          placeholder="휴대폰 번호 또는 이메일 주소"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
          required
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
        )}
        <Input
          variant="sign"
          type="password"
          placeholder="비밀번호"
          {...register("password")}
          className={errors.password ? "border-red-500" : ""}
          required
          minLength={6}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
        )}
        {/* <Input
          variant="sign"
          placeholder="성명"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={isLoading}
        />
        <Input
          variant="sign"
          placeholder="사용자 이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        /> */}

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
        {serverErrorMessage && (
          <div className="mb-4 text-sm font-medium text-center text-red-500">
            {serverErrorMessage}
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
