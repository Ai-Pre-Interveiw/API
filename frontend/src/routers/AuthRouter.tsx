// import SearchPage from '@pages/search/SearchPage'
import { Route, Routes } from 'react-router-dom'
// import AlarmPage from '@pages/alarm/AlarmPage'
// import FundingPage from '@pages/funding/FundingPage'
import HomePage from '@pages/home/HomePage'
import LoginPage from '@pages/login/LoginPage'
import SignupPage from '@/pages/signup/SignupPage'
import MyPage from '@pages/mypage/MyPage'
import AnalysisPage from '@/pages/analysis/AnalysisPage'
import AnalysisDetailPage from '@/pages/analysisdetail/AnalysisDetailPage'
import InterviewPage from '@/pages/interview/InterviewPage'
import InterviewingPage from '@/pages/interview/InterviewingPage'
// import FundingDetailPage from '@/pages/funding/FundingDetailPage'
// import DetailMainPage from '@/pages/funding/DetailMainPage'
// import DonorListPage from '@/pages/funding/DonorListPage'
// import MedicalExpensePage from '@/pages/funding/MedicalExpensePage'
// import SettingPage from '@pages/mypage/setting/SettingPage'
// import LoginRedirectHandler from '@/pages/redirect/LoginRedirectHandler'
// import PointsPage from '@/pages/mypage/points/PointsPage'
// import DonatePage from '@/pages/mypage/donate/DonatePage'
// import RechargePage from '@pages/mypage/recharge/RechargePage'
// import RechargeDonePage from '@pages/mypage/recharge/RechargeDonePage'
// import PaymentRedirectHandler from '@/pages/redirect/PaymentRedirectHandler'
// import DonateDonePage from '@/pages/funding/DonateDonePage'
// import SecondRegPage from '@/pages/secondReg/SecondRegPage'
// import RegOkPage from '@/pages/secondReg/RegOkPage'

const AuthRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/interviewing" element={<InterviewingPage />} />
      {/* <Route path="/search" element={<SearchPage />} /> */}
      {/* <Route path="/funding" element={<FundingPage />} /> */}
      {/* <Route path="/alarm" element={<AlarmPage />} /> */}
      {/* <Route path="/login/oauth2" element={<LoginRedirectHandler />} /> */}
      {/* <Route path="/mypage/setting" element={<SettingPage />} /> */}
      {/* <Route path="/mypage/points" element={<PointsPage />} /> */}
      {/* <Route path="/mypage/recharge" element={<RechargePage />} /> */}
      {/* <Route path="/mypage/recharge/done" element={<RechargeDonePage />} /> */}
      {/* <Route path="/mypage/donate" element={<DonatePage />} /> */}
      {/* <Route path="/funding/donate/done" element={<DonateDonePage />} /> */}
      {/* <Route path="/funding/:id" element={<FundingDetailPage />}> */}
        {/* <Route path="detail-main" element={<DetailMainPage />} /> */}
        {/* <Route path="donor-list" element={<DonorListPage />} /> */}
        {/* <Route path="medical-expense" element={<MedicalExpensePage />} /> */}
      {/* </Route> */}
      {/* <Route path="/payment/:payment/donate/success" element={<PaymentRedirectHandler />} /> */}
      {/* <Route path="/payment/:payment/recharge/success" element={<PaymentRedirectHandler />} /> */}
      {/* <Route path="/giveus/:id" element={<SecondRegPage />} /> */}
      {/* <Route path="/giveus/ok" element={<RegOkPage />} /> */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default AuthRouter