import PATHS from "@/app/routing/path";
import { signIn } from "@/features/auth/sign-in/api/sign-in";
import type { SignInSchema } from "@/features/auth/sign-in/model/sign-in.schema";
import SignInForm from "@/features/auth/sign-in/ui/SignInForm";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const SignInPage = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      alert("로그인에 성공했습니다.");
      navigate(PATHS.HOME);
    },
    onError: (error) => {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const onSubmit = (data: SignInSchema) => {
    mutate(data);
  };

  return (
    <SignInForm onSubmit={onSubmit} isLoading={isPending} apiError={error} />
  );
};
