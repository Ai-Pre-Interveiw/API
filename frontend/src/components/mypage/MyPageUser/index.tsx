import { BASE_URL } from '@utils/requestMethods'
import { useState } from 'react';
import * as m from '@components/mypage/MyPageUser/MyPageUser.styled'
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { userState } from '@stores/user';
import { useNavigate } from 'react-router-dom'
import { colors } from '@/styles/theme'

const index = () => {
  const user = useRecoilValue(userState);
  const resetAdminState = useResetRecoilState(userState)
  const navigate = useNavigate()

  const onClick = () => {
    resetAdminState()
    alert('로그아웃 되었습니다.')
    navigate('/')
  }

  return (
    <m.Container>
      <m.Image>
        <img src={user.imageUrl} alt="..." style={{ width: 'auto', height: '15vh' }}/>
      </m.Image>
      <m.Nickname>
        닉네임 : {user.nickname}
      </m.Nickname>
      <m.Email>
        이메일 : {user.email}
      </m.Email>
      <div>
        <m.Button onClick={onClick}>
        로그아웃
        </m.Button>
      </div>
    </m.Container>
  )
}

export default index