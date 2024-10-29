import { BASE_URL } from '@utils/requestMethods'
import * as l from '@components/login/LoginSection/LoginSection.styled'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '@/stores/user'
import FullButton from '@common/Fullbutton/index'
import AuthBackground from '@common/AuthBackground/index'

const index = () => {
  const navigate = useNavigate()
  const setUserState = useSetRecoilState(userState)

  const onClick = () => {
    // const LOCAL_URL = 'http://localhost:8086'
    // const kakaoURL = `${BASE_URL}/admin/oauth2/authorization/kakao`
    // window.location.href = kakaoURL
    const newUser = {
      memberNo: 1,
      email: 'example@example.com',
      name: '홍길동',
      nickname: '길동이',
      createdAt: new Date().toISOString(),
      imageUrl: '/img/new_profile.png',
      provider: 'kakao',
      snsKey: '12345',
    };
    setUserState(newUser)
    navigate('/')
  }

  const goSignup =() => {
    navigate('/')
  }
  
  return (
    <l.Container>
      <img src="src/assets/images/login.png" alt="" style={{ width: '40vh', height: 'auto' }}/>
      <AuthBackground
        text1='회원가입'
        text2='로그인'
        onClick1={goSignup}
        onClick2={onClick}>
      </AuthBackground>
    </l.Container>
  )
}

export default index