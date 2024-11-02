import * as a from '@components/analysisdetail/AnalysisDetailHeader/AnalysisDetailHeader.styled'
import Navbar from '@common/Navbar/index'

const index = () => {
  return (
    <a.Container>
      <Navbar current="Analysis" />
    </a.Container>
  )
}

export default index