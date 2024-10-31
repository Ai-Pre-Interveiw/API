import * as s from '@components/signup/SignupHeader/SignupHeader.styled'
import Navbar from '@common/Navbar/index'

const index = () => {
  return (
    <s.Container>
      <Navbar current="home" />
    </s.Container>
  )
}

export default index