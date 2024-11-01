import * as i from '@components/interview/InterviewHeader/InterviewHeader.styled'
import Navbar from '@common/Navbar/index'

const index = () => {
  return (
    <i.Container>
      <Navbar current="interview" />
    </i.Container>
  )
}

export default index