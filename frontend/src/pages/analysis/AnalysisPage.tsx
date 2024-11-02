import AnalysisFooter from '@/components/analysis/AnalysisFooter'
import AnalysisHeader from '@/components/analysis/AnalysisHeader'
import AnalysisSection from '@/components/analysis/AnalysisSection'
import * as a from '@pages/analysis/AnalysisPage.styled'

const AnalysisPage = () => {
  return (
    <a.Container>
      <AnalysisHeader />
      <AnalysisSection />
      <AnalysisFooter />
    </a.Container>
  )
}

export default AnalysisPage