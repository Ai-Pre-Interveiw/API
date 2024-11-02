import { BASE_URL } from '@utils/requestMethods'
import { useState } from 'react';
import * as a from '@components/analysis/AnalysisSection/AnalysisSection.styled'
import { Navigate, useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import { useRecoilValue } from 'recoil';
import { userState } from '@/stores/user';

const index = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate()
  return (
    <a.Container>
      <a.Title>
        면접분석
      </a.Title>
      <a.Summary>
        <a.SummaryNum>{(user.result?.length || 0)}</a.SummaryNum>
        <a.SummaryText>&nbsp;건의 면접 분석 결과가 있습니다.</a.SummaryText>
      </a.Summary>
      <a.Menu>
        <a.Menu1>
          미리보기
        </a.Menu1>
        <a.Menu2>
          <div>
            진행날짜
          </div>
          <div>
            상태
          </div>
        </a.Menu2>
      </a.Menu>
      {user.result && user.result.length > 0 ? 
        <a.AnalysisList>
          {user.result.map((result, index) => (
            <a.AnlaysisItem>
                <video
                  src={result[0].filePath} // 비디오 파일 URL을 생성
                  width="150" // 원하는 크기로 설정
                  height="80"
                  controls // 비디오 컨트롤(재생, 일시 정지 등) 표시
                />
              <a.AnalysisItemTimeButton>
                {result[0].uploadTime}
                <FullButton text="결과보기" onClick={() => navigate(`/analysis/${index}`)} disabled/>
              </a.AnalysisItemTimeButton>
            </a.AnlaysisItem>
          ))}
        </a.AnalysisList>
      : 
      <a.WrapContent>
        <a.Not> 진행한 모의면접이 없습니다 </a.Not>
      </a.WrapContent>}
    </a.Container>
  )
}

export default index