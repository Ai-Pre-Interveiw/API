import { BASE_URL } from '@utils/requestMethods'
import { useState, useEffect } from 'react';
import * as a from '@components/analysis/AnalysisSection/AnalysisSection.styled'
import { Navigate, useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import { useRecoilValue } from 'recoil';
import { userState } from '@/stores/user';
import { getAllInterviews, inferenceEyePose, updateInterview } from '@/apis/interview';
import { getResume } from '@/apis/resume';


interface Interview {
  id: number;
  scheduled_start: string;
  position: string;
  experience_level: string;
  resume: number;
  isProcessing?: boolean; // 분석 중 여부 속성 추가
  isProcessed?: boolean; // 분석 완료 여부 속성 추가
}

interface Resume {
  id: number;
  filePath: string;
  uploadTime: string;
}

const Index = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);

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
      const resumeData = await getResume();
      setResumes(resumeData)
    };
    loadResumes();
    loadInterviews();
  }, []);

  useEffect(() => {
    console.log(interviews)
  }, [interviews]);

  const handleAnalysisClick = async (interviewId: number) => {
    try {
      // 분석 중 상태를 설정
      setInterviews((prevInterviews) =>
        prevInterviews.map((interview) =>
          interview.id === interviewId
            ? { ...interview, isProcessing: true, isProcessed: false }
            : interview
        )
      );

      updateInterview(interviewId, {isProcessing: true})
  
      // 분석 함수 실행
      await inferenceEyePose(interviewId);
  
      // 분석 완료 후 상태를 업데이트하여 '결과보기'로 변경
      setInterviews((prevInterviews) =>
        prevInterviews.map((interview) =>
          interview.id === interviewId
            ? { ...interview, isProcessing: true, isProcessed: true }
            : interview
        )
      );

    } catch (error) {
      console.error("분석 요청 중 오류가 발생했습니다:", error);
      alert("분석 중 오류가 발생했습니다.");
    }
  };


  return (
    <a.Container>
      <a.Title>
        면접분석
      </a.Title>
      <a.Summary>
        <a.SummaryNum>{(interviews?.length || 0)}</a.SummaryNum>
        <a.SummaryText>&nbsp; 건의 면접 분석 결과가 있습니다.</a.SummaryText>
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
          {interviews
            .slice() // 원본 interviews 배열을 변경하지 않도록 복사본 생성
            .sort((a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime()) // 최신 날짜 순으로 정렬
            .map((result, index) => {
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
                    {result.isProcessing && result.isProcessed ? 
                      <FullButton text="결과보기" onClick={() => navigate(`/analysis/${result.id}`)} disabled/> :
                    result.isProcessing && !result.isProcessed ?
                      <FullButton text="분석중" onClick={() => {}} disabled/> :
                      <FullButton text="분석하기" onClick={() => handleAnalysisClick(result.id)} disabled/>
                    }
                  </a.AnalysisItemTimeButton>
                </a.AnlaysisItem>
              )
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
