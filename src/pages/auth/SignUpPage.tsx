import PATHS from "@/app/routing/path";
import { signUp } from "@/features/auth/sign-up/api/sign-up";
import type { SignUpSchema } from "@/features/auth/sign-up/model/sign-up.schema";
import SignUpForm from "@/features/auth/sign-up/ui/SignUpForm";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export const SignUpPage = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate(PATHS.SIGN_IN);
    },
    onError: (error) => {
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const onSubmit = (data: SignUpSchema) => {
    mutate(data);
  };

  return (
    <SignUpForm onSubmit={onSubmit} isLoading={isPending} apiError={error} />
  );
};
