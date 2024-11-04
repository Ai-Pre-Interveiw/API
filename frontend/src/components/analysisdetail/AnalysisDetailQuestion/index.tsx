import { BASE_URL } from '@utils/requestMethods'
import * as a from '@components/analysisdetail/AnalysisDetailSection/AnalysisDetailSection.styled'
import { useNavigate } from 'react-router-dom'
import { userState } from '@/stores/user'
import { useRecoilValue } from 'recoil'

// props 타입 정의
interface AnalysisDetailQuestionProps {
  selectedIndex: number | null; // 선택된 질문의 인덱스
}

const AnalysisDetailQuestion = ({ selectedIndex }: AnalysisDetailQuestionProps) => {
  return (
    <a.Container>
      {selectedIndex === -1 ? (
        <p>종합 분석</p>
      ) : selectedIndex !== null ? (
        <p>질문 {selectedIndex + 1} 분석</p>
      ) : (
        <p>선택된 질문이 없습니다</p>
      )}
    </a.Container>
  )
}

export default AnalysisDetailQuestion
