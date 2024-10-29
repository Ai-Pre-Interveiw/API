// import Navbar from '@common/Navbar'
// import MypageInfoSection from '@components/mypage/MypageInfoSection'
// import { useRecoilValue } from 'recoil'
// import { userState } from '@stores/user'
// import MypageHeader from '@components/mypage/MypageHeader'
// import MypagePoint from '@components/mypage/MypagePoint'
// import MypageActivity from '@components/mypage/MypageActivity'
// import MypageSetting from '@components/mypage/MypageSetting'
// import * as m from '@pages/mypage/MyPage.styled'
// import Seo from '@/common/Seo'

const MyPage = () => {
//   const userInfo = useRecoilValue(userState)

  return (
    <>
    <p>마이페이지</p>
      {/* <Seo
        title="GIVEUS"
        description="여러분의 따뜻한 기부를 기다립니다"
      />
      <m.Container>
        <MypageHeader />
        <m.Wrap>
          <MypageInfoSection />
          {userInfo.memberNo !== -1 && <MypagePoint />}
          <MypageActivity />
          <MypageSetting />
        </m.Wrap>
      </m.Container>
      <Navbar current="mypage" /> */}
    </>
  )
}

export default MyPage