// import { navbarList } from '@assets/data/navbarList'
import FullBotton from '@common/Fullbutton/index'
import * as n from '@common/Navbar/Navbar.styled'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const Index = (props: { current: string }) => {
  const { current } = props
  const navigate = useNavigate()

  const onClick = () => {
    alert('로그인 후 이용해주세요.')
  }

  const goHome = () => {
    navigate('/')
  }

  return (
    <n.Container>
      <n.Wrap>
        <n.image onClick={goHome}>
          <img src="src/assets/images/api_logo_web.png" alt="..." style={{ width: '13vh', height: 'auto' }} />
        </n.image>
        <n.ButtonWrap>
          <FullBotton text='모의 면접' onClick={onClick} disabled/>
          <FullBotton text='분석 결과' onClick={onClick} disabled/>
        </n.ButtonWrap>
      </n.Wrap>
    </n.Container>
  )
}

export default Index