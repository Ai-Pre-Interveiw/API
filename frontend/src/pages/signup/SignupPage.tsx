// import SignupNameSection from '@components/signup/SignupNameSection'
// import SingupNicknameSection from '@components/signup/SignupNicknameSection'
// import SignupHeader from '@components/signup/SignupHeader'
// import * as s from '@pages/signup/SignupPage.styled'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { joinUser } from '@apis/auth'
import { useSetRecoilState } from 'recoil'
import { userState } from '@stores/user'
// import { handleAllowNotification } from '@/services/notificationPermission'

const SignupPage = () => {
  const [stage, setStage] = useState(0)
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')

  const setUserState = useSetRecoilState(userState)

  const navigate = useNavigate()

  useEffect(() => {
    // stage가 -1 이하이면 로그인 페이지로 이동
    stage < 0 && navigate('/login', { replace: true })
  }, [stage])

  const singup = () => {
    joinUser({ name, nickname }).then(res => {
      setUserState(res.data.data)
    //   handleAllowNotification(res.data.data.memberNo)
      navigate('/')
    })
  }

  return (
    <p>회원가입</p>
    // <s.Container>
    //   <SignupHeader value={stage} setValue={setStage} />
    //   <s.Wrap>
    //     {stage === 0 && (
    //       <SignupNameSection
    //         value={name}
    //         setValue={setName}
    //         onClick={() => setStage(1)}
    //       />
    //     )}
    //     {stage === 1 && (
    //       <SingupNicknameSection
    //         value={nickname}
    //         setValue={setNickname}
    //         onClick={singup}
    //       />
    //     )}
    //   </s.Wrap>
    // </s.Container>
  )
}

export default SignupPage