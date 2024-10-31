import * as l from '@components/home/HomeHeader/HomeHeader.styled'
import Navbar from '@common/Navbar/index'

const index = () => {
  return (
    <l.Container>
      <Navbar current="home" />
    </l.Container>
  )
}

export default index