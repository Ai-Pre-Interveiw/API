import HomeFooter from '@/components/home/HomeFooter'
import HomeSection from '@/components/home/HomeSection'
import HomeHeader from '@/components/home/HomeHeader'
import * as h from '@pages/home/HomePage.styled'
import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/main')
  }, [])

  return (
    <h.Container>
      <HomeHeader />
      <HomeSection />
      <HomeFooter />
    </h.Container>
  )
}

export default HomePage