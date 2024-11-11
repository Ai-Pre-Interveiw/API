import AnalysisDetailFooter from '@/components/analysisdetail/AnalysisDetailFooter'
import AnalysisDetailHeader from '@/components/analysisdetail/AnalysisDetailHeader'
import AnalysisDetailSection from '@/components/analysisdetail/AnalysisDetailSection'
import * as a from '@/pages/analysisdetail/AnalysisDetailPage.styled'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '@stores/user'

const AnalysisDetailPage = () => {
  const user = useRecoilValue(userState)
  const { id } = useParams<{ id: string }>()  // URL에서 id를 가져옴

  return (
    <a.Container>
      <AnalysisDetailHeader />
      {id ? <AnalysisDetailSection id={id} /> : <div>잘못된 경로입니다.</div>}
      <AnalysisDetailFooter />
    </a.Container>
  )
}

export default AnalysisDetailPage
