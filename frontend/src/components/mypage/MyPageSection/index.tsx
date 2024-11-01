import { BASE_URL } from '@utils/requestMethods'
import { useState } from 'react';
import * as m from '@components/mypage/MyPageSection/MyPageSection.styled'
import { useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import MyPageResume from '@components/mypage/MyPageResume'
import MyPageUser from '@components/mypage/MyPageUser'

const index = () => {
  const navigate = useNavigate()

  const [selectedMenu, setSelectedMenu] = useState('회원정보'); // 초기값을 '자기소개서'로 설정

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu); // 선택된 메뉴 업데이트
  };
  
  return (
    <m.Container>
      <m.WrapMenu>
        <m.Menu onClick={() => handleMenuClick('자기소개서')} selected={selectedMenu === '자기소개서'}>
          자기소개서
        </m.Menu>
        <m.Menu onClick={() => handleMenuClick('회원정보')} selected={selectedMenu === '회원정보'}>
          회원정보
        </m.Menu>
      </m.WrapMenu>
      {selectedMenu === '자기소개서' ? 
        <MyPageResume/>
      :
        <MyPageUser/>
      }
    </m.Container>
  )
}

export default index