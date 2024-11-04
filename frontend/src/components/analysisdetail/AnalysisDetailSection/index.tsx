import { BASE_URL } from '@utils/requestMethods'
import { useState } from 'react'
import * as a from '@components/analysisdetail/AnalysisDetailSection/AnalysisDetailSection.styled'
import AnalysisDetailQuestion from '@components/analysisdetail/AnalysisDetailQuestion'
import { useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import { useRecoilValue } from 'recoil'
import { userState } from '@/stores/user'

const AnalysisDetailSection = ({ data }: { data: { filePath: string; uploadTime: string }[] }) => {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1) // 기본값을 -1로 설정하여 종합분석 선택

  const handleItemClick = (index: number) => {
    setSelectedIndex(index) // 선택된 항목의 인덱스를 업데이트
  }

  return (
    <a.Container>
      <a.Title>분석 결과</a.Title>
      <a.SecondTitle>{user.nickname} 님의</a.SecondTitle>
      <a.ThirdTitle>{data[0].uploadTime} 진행한 모의면접 분석결과 입니다.</a.ThirdTitle>
      
      <a.AllWrap>
        <a.MenuWrap>
          {/* 종합분석 메뉴를 추가 */}
          <a.MenuItem 
            onClick={() => handleItemClick(-1)} 
            isSelected={selectedIndex === -1} // 선택 여부에 따라 스타일링
          >
            <p>종합분석</p>
          </a.MenuItem>

          {/* data 배열을 순회하여 메뉴 표시 */}
          {data.map((item, index) => (
            <a.MenuItem 
              key={index} 
              onClick={() => handleItemClick(index)}
              isSelected={selectedIndex === index} // 선택 여부에 따라 스타일링
            >
              <p>질문 {index + 1}</p>
            </a.MenuItem>
          ))}
        </a.MenuWrap>
        
        {/* 기본적으로 종합분석이 선택된 상태로 표시 */}
        <AnalysisDetailQuestion selectedIndex={selectedIndex} />
      </a.AllWrap>

      {selectedIndex !== null && selectedIndex !== -1 && (
        <a.DetailWrap>
          <p>파일 경로: {data[selectedIndex].filePath}</p>
          <p>업로드 시간: {data[selectedIndex].uploadTime}</p>
        </a.DetailWrap>
      )}

      <FullButton text="뒤로 가기" onClick={() => navigate('/analysis')} disabled />
    </a.Container>
  )
}

export default AnalysisDetailSection
