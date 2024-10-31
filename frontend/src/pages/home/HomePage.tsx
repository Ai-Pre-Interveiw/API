import HomeFooter from '@/components/home/HomeFooter'
import HomeSection from '@/components/home/HomeSection'
import HomeHeader from '@/components/home/HomeHeader'
import { colors } from '@/styles/theme'
import * as h from '@pages/home/HomePage.styled'
import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { userState } from '@/stores/user'

const HomePage = () => {
  const navigate = useNavigate()
  const resetAdminState = useResetRecoilState(userState)

  useEffect(() => {
    navigate('/main')
  }, [])

  const onClick = () => {
    resetAdminState()
    alert('로그아웃 되었습니다.')
    navigate('/')
  }

  return (
    <h.Container>
      <HomeHeader />
      <HomeSection />
      <HomeFooter />
      <button
        style={{
          backgroundColor: colors.purple,
          color: 'white',
          width: '100px', // 버튼 너비 설정
          height: '30px', // 버튼 높이 설정
          zIndex: 100, // z-index 설정
          position: 'fixed', // 고정 위치
          bottom: '20px', // 아래에서 20px 위치에 고정
          right: '20px', // 오른쪽에서 20px 위치에 고정
        }}
        onClick={onClick}
      >
      누르면 로그아웃
      </button>
    </h.Container>
  )
}

export default HomePage