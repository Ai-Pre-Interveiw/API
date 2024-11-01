import * as m from '@components/mypage/MyPageHeader/MyPageHeader.styled'
import Navbar from '@common/Navbar/index'

const index = () => {
  return (
    <m.Container>
      <Navbar current="mypage" />
    </m.Container>
  )
}

export default index