import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../providers/AuthProvider";
// import PostDetailModal from "../pages/post/PostDetailModal"; // 모달 형태의 컴포넌트

export default function RootLayout() {
  const location = useLocation();

  // Link 컴포넌트에서 state={{ background: location }}을 보냈는지 확인
  const background = location.state && location.state.background;

  return (
    <AuthProvider>
      {/* background가 있으면(모달 띄운 상태면) 뒤에 깔릴 화면(Feed)을 렌더링 
         background가 없으면(새로고침 등) 현재 위치(Outlet)를 렌더링
      */}
      <Outlet context={{ background }} />

      {/* 모달 라우팅: 배경이 있을 때만 조건부 렌더링 */}
      {/* {background && (
        <Routes>
          <Route path="/p/:id" element={<PostDetailModal />} />
        </Routes>
      )} */}
    </AuthProvider>
  );
}
