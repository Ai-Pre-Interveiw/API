import * as a from '@components/analysis/AnalysisHeader/AnalysisHeader.styled'
import Navbar from '@common/Navbar/index'

const index = () => {
  return (
    <a.Container>
      <Navbar current="Analysis" />
    </a.Container>
  )
}

export default index