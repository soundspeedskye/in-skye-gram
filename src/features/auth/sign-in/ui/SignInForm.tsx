import { useState } from "react";
import { Button } from "@/shared/ui/lib/button";
import { Input } from "@/shared/ui/lib/input";
import { Separator } from "@/shared/ui/lib/separator";
import AuthFormLayout from "@/shared/ui/core/AuthFormLayout";
import AuthNavigationCard from "@/widgets/auth/ui/AuthNavigationCard";
import { signInSchema, type SignInSchema } from "../model/sign-in.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  onSubmit: (data: SignInSchema) => void;
  isLoading: boolean;
  apiError: Error | null;
}
const SignInForm = ({ onSubmit, isLoading, apiError }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const serverErrorMessage = apiError?.message;

  return (
    <AuthFormLayout navigationCard={<AuthNavigationCard type="signin" />}>
      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8" noValidate>
        <Input
          variant="sign"
          type="text"
          placeholder="이메일 주소 또는 휴대폰 번호"
          {...register("email")}
          required
          disabled={isLoading}
          className="mb-3 h-[46px] bg-gray-50 border-gray-300 text-sm px-3 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 disabled:opacity-50"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
        <Input
          variant="sign"
          type="password"
          placeholder="비밀번호"
          {...register("password")}
          required
          disabled={isLoading}
          className="mb-2 h-[46px] bg-gray-50 border-gray-300 text-sm px-3 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 disabled:opacity-50"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}

        {/* 에러 메시지 표시 */}
        {serverErrorMessage && (
          <div className="mb-4 text-sm font-medium text-center text-red-500">
            {serverErrorMessage}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 mt-2 text-sm font-semibold leading-6 text-white bg-blue-500 rounded-lg shadow-none hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      {/* 구분선 */}
      <div className="flex items-center my-4">
        <Separator className="flex-1 bg-gray-300" />
        <span className="mx-4 text-xs font-semibold text-gray-500 uppercase">
          또는
        </span>
        <Separator className="flex-1 bg-gray-300" />
      </div>

      {/* Facebook 로그인 */}
      <Button
        variant="ghost"
        className="w-full py-2 mb-4 text-sm font-semibold text-blue-800 hover:bg-transparent hover:opacity-70"
      >
        <svg
          className="w-4 h-4 mr-2 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook으로 로그인
      </Button>

      {/* 비밀번호 찾기 */}
      <div className="text-center">
        <a href="#" className="text-xs text-blue-900 hover:underline">
          비밀번호를 잊으셨나요?
        </a>
      </div>
    </AuthFormLayout>
  );
};

export default SignInForm;
