import SignupPage from '@/pages/signup/SignupPage'
// import FundingPage from '@pages/funding/FundingPage'
import LoginPage from '@pages/login/LoginPage'
import { Route, Routes } from 'react-router-dom'
// import LoginRedirectHandler from '@/pages/redirect/LoginRedirectHandler'
// import SecondRegPage from '@/pages/secondReg/SecondRegPage'
// import SearchPage from '@pages/search/SearchPage'
import HomePage from '@pages/home/HomePage'
// import RegOkPage from '@/pages/secondReg/RegOkPage'
import MyPage from '@pages/mypage/MyPage'
// import SettingPage from '@pages/mypage/setting/SettingPage'
import PrivateRoute from '@routers/PrivateRoute'

const HomeRouter = (props: { user: boolean }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/login/oauth2" element={<LoginRedirectHandler />} /> */}
      <Route path="/signup" element={<SignupPage />} />
      {/* <Route path="/funding" element={<FundingPage />} /> */}
      {/* <Route path="/search" element={<SearchPage />} /> */}
      <Route path="/mypage" element={<MyPage />} />
      {/* <Route path="/mypage/setting" element={<SettingPage />} /> */}
      {/* <Route path="/giveus/:id" element={<SecondRegPage />} /> */}
      {/* <Route path="/giveus/ok" element={<RegOkPage />} /> */}
      <Route
        path="*"
        element={
          <PrivateRoute authenticated={props.user} Component={<LoginPage />} />
        }
      />
    </Routes>
  )
}

export default HomeRouter