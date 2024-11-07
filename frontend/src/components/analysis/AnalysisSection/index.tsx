import { BASE_URL } from '@utils/requestMethods'
import { useState, useEffect } from 'react';
import * as a from '@components/analysis/AnalysisSection/AnalysisSection.styled'
import { Navigate, useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import { useRecoilValue } from 'recoil';
import { userState } from '@/stores/user';
import { getAllInterviews } from '@/apis/interview';
import { getResume } from '@/apis/resume';

interface Interview {
  id: number;
  scheduled_start: string;
  position: string;
  experience_level: string;
  resume: number;
}

const Index = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [resumes, setResumes] = useState<{ id: number; filePath: string; uploadTime: string }[]>([]);

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
    const loadResumes = async () => {
      const resumes = await getResume();
      setResumes(resumes.data)
    };
    loadResumes();
    loadInterviews();
  }, []);

  useEffect(() => {
    console.log(interviews)
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
          기반 자기소개서
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
          {[...interviews].reverse().map((result, index) => {
            // resumes 배열에서 result.resume과 id가 일치하는 항목 찾기
            const matchingResume = resumes.find((resume) => resume.id === result.resume);
            
            return (
              <a.AnlaysisItem key={index}>
                {matchingResume && (
                  <a.SummaryText>{matchingResume.filePath.split('/').pop()}</a.SummaryText>
                )}
                <a.AnalysisItemTimeButton>
                  {new Intl.DateTimeFormat('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true, // 오후/오전 표시
                    timeZone: 'Asia/Seoul' // 한국 시간대 설정
                  }).format(new Date(result.scheduled_start))}
                  <FullButton text="결과보기" onClick={() => navigate(`/analysis/${result.id}`)} disabled/>
                </a.AnalysisItemTimeButton>
              </a.AnlaysisItem>
            );
          })}
        </a.AnalysisList>
      : 
      <a.WrapContent>
        <a.Not> 진행한 모의면접이 없습니다 </a.Not>
      </a.WrapContent>}
    </a.Container>
  )
}

export default Index
