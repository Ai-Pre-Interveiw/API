import AnalysisDetailFooter from '@/components/analysisdetail/AnalysisDetailFooter'
import AnalysisDetailHeader from '@/components/analysisdetail/AnalysisDetailHeader'
import AnalysisDetailSection from '@/components/analysisdetail/AnalysisDetailSection'
import * as a from '@/pages/analysisdetail/AnalysisDetailPage.styled'
import { useParams } from 'react-router-dom';

const AnalysisDetailPage = () => {
  const { id } = useParams();
  return (
    <a.Container>
      <AnalysisDetailHeader />
      {id} 상세분석페이지
      <AnalysisDetailSection />
      <AnalysisDetailFooter />
    </a.Container>
  )
}

export default AnalysisDetailPage