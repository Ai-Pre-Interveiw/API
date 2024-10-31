import { BASE_URL } from '@utils/requestMethods'
import * as s from '@components/signup/SignupSection/SignupSection.styled'
import { useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import AuthBackground from '@common/AuthBackground/index'

const index = () => {
  const navigate = useNavigate()

  const goBack =() => {
    navigate('/')
  }
  
  return (
    <s.Container>
      <s.image>
        <s.SmallImageUpLeft/>
        <s.SmallImageUpRight/>
      </s.image>
      <AuthBackground
        title='회원가입'
        text1='뒤로가기'
        text2='회원가입'
        onClick1={goBack}
        onClick2={() => {}}
        inputs={[
          { inputTitle: 'email', inputText: '아이디를 입력해주세요. (email 형식)', isEssentail: false },
          { inputTitle: 'password1', inputText: '비밀번호를 입력해주세요. (8자이상 15자 미만)', isEssentail: false },
          { inputTitle: 'password2', inputText: '비밀번호를 한번 더 입력해주세요.', isEssentail: false },
          { inputTitle: 'nickname', inputText: '닉네임을 입력해주세요. (6자 이내)', isEssentail: false },
        ]}
        >
      </AuthBackground>
    </s.Container>
  )
}

export default index