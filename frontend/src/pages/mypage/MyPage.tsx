import MyPageFooter from '@/components/mypage/MyPageFooter'
import MyPageHeader from '@/components/mypage/MyPageHeader'
import MyPageSection from '@/components/mypage/MyPageSection'
import * as m from '@pages/mypage/MyPage.styled'

const MyPagePage = () => {
  return (
    <m.Container>
      <MyPageHeader />
      <MyPageSection />
      <MyPageFooter />
    </m.Container>
  )
}

export default MyPagePage