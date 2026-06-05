import { useAuthListener } from "@/shared/hooks/use-auth-listener";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  // const location = useLocation();

  useAuthListener();

  // 모달 라우팅을 위한 background 설정 (나중에 모달 구현 시 사용)
  // const background = location.state?.background;

  return (
    <>
      <Outlet />

      {/* {background && (
        <Routes>
          <Route path="/p/:id" element={<PostDetailModal />} />
        </Routes>
      )} */}
    </>
  );
}
