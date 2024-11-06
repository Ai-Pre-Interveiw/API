import { BASE_URL } from '@utils/requestMethods'
import { useState, useEffect } from 'react';
import * as a from '@components/analysis/AnalysisSection/AnalysisSection.styled'
import { Navigate, useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import { useRecoilValue } from 'recoil';
import { userState } from '@/stores/user';
import { getAllInterviews } from '@/apis/interview';

interface Interview {
  id: number;
  scheduled_start: string;
  position: string;
  experience_level: string;
  // 필요한 다른 필드도 정의합니다
}

const index = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState<Interview[]>([]);

  // 페이지 로드 시 인터뷰 조회 요청
  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const interviewData = await getAllInterviews();
        setInterviews(interviewData);
      } catch (error) {
        console.error("면접을 불러오는 중 오류가 발생했습니다:", error);
      }
    };
    loadInterviews();
  }, []);

  useEffect(() => {
    // console.log(interviews)
  }, [interviews]);

  return (
    <a.Container>
      <a.Title>
        면접분석
      </a.Title>
      <a.Summary>
        <a.SummaryNum>{(interviews?.length || 0)}</a.SummaryNum>
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
      {interviews && interviews.length > 0 ? 
        <a.AnalysisList>
          {interviews.map((result, index) => (
            <a.AnlaysisItem>
                {/* <video
                  src={result[0].filePath} // 비디오 파일 URL을 생성
                  width="200vw" // 원하는 크기로 설정
                  height="120vh"
                  controls // 비디오 컨트롤(재생, 일시 정지 등) 표시
                /> */}
              <a.AnalysisItemTimeButton>
                {result.scheduled_start}
                <FullButton text="결과보기" onClick={() => navigate(`/analysis/${result.id}`)} disabled/>
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