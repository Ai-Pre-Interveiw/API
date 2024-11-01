import * as l from '@components/login/LoginHeader/LoginHeader.styled'
import Navbar from '@common/Navbar/index'

const index = () => {
  return (
    <l.Container>
      <Navbar current="login" />
    </l.Container>
  )
}

export default index