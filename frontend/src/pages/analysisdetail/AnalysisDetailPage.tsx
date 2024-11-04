import AnalysisDetailFooter from '@/components/analysisdetail/AnalysisDetailFooter'
import AnalysisDetailHeader from '@/components/analysisdetail/AnalysisDetailHeader'
import AnalysisDetailSection from '@/components/analysisdetail/AnalysisDetailSection'
import * as a from '@/pages/analysisdetail/AnalysisDetailPage.styled'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '@stores/user'

const AnalysisDetailPage = () => {
  const { id } = useParams()
  const user = useRecoilValue(userState)

  // id에 해당하는 result 찾기
  const analysisData = user.result.find((result, index) => index.toString() === id)
  console.log(analysisData)

  return (
    <a.Container>
      <AnalysisDetailHeader />
      {analysisData ? (
        <AnalysisDetailSection data={analysisData} /> // 배열 형태로 data 전달
      ) : (
        <p>분석 데이터를 찾을 수 없습니다.</p>
      )}
      <AnalysisDetailFooter />
    </a.Container>
  )
}

export default AnalysisDetailPage
