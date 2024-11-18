import { BASE_URL } from '@utils/requestMethods'
import { useState, useEffect, useRef } from 'react'
import * as a from '@components/analysisdetail/AnalysisDetailSection/AnalysisDetailSection.styled'
import AnalysisDetailQuestion from '@components/analysisdetail/AnalysisDetailQuestion'
import AnalysisDetailSynthesis from '@components/analysisdetail/AnalysisDetailSynthesis'
import { useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import { useRecoilValue } from 'recoil'
import { userState } from '@/stores/user'
import { getInterviewResult } from '@/apis/interview'


interface InterviewResult {
  id: number,
  video_path: string,
  anxiety_graph_path: string,
  gaze_distribution_path: string,
  posture_distribution_path: string,
  voice_distribution_path: string,
  expression_distribution_path: string,
  answer_text: string[],
  filler_word_positions: string[],
  follow_up_questions: string[],
  created_at: string,
  updated_at: string,
  interview: number,
  question_detail: {content: string};
}

interface AnalysisDetailSectionProps {
  id: string; // id는 문자열로 지정
}

const AnalysisDetailSection: React.FC<AnalysisDetailSectionProps> = ({ id }) => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // 기본값을 0으로 설정하여 종합분석 선택
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([]);

  const handleItemClick = (index: number) => {
    setSelectedIndex(index); // 선택된 항목의 인덱스를 업데이트
  };

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const interviewResultData = await getInterviewResult(parseInt(id!, 10));
        setInterviewResults(interviewResultData);
      } catch (error) {
        console.error("면접을 불러오는 중 오류가 발생했습니다:", error);
      }
    };
    loadInterviews();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {interviewResults.length > 0 ? (
        <a.Container ref={containerRef}>
          <a.Title>분석 결과</a.Title>
          <a.SecondTitle>{user.nickname} 님의</a.SecondTitle>
          <a.ThirdTitle>
            {new Intl.DateTimeFormat("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Seoul", // 한국 시간대 설정
            }).format(new Date(interviewResults[0].updated_at))}{" "}
            진행한 모의면접 분석결과 입니다.
          </a.ThirdTitle>

          <a.AllWrap>
            <a.MenuWrap>
              {/* data 배열을 순회하여 메뉴 표시 */}
              {interviewResults.map((item, index) => (
                <a.MenuItem
                  key={index}
                  onClick={() => handleItemClick(index)}
                  isSelected={selectedIndex === index} // 선택 여부에 따라 스타일링
                >
                  <p>{index === 0 ? "종합분석" : `질문 ${index}`}</p>
                </a.MenuItem>
              ))}
            </a.MenuWrap>

            {/* 기본적으로 인덱스 0이 선택된 상태로 표시 */}
            {selectedIndex === 0 ?
            <AnalysisDetailSynthesis
              selectedIndex={selectedIndex}
              data={[interviewResults[selectedIndex]]}
              setSelectedIndex={setSelectedIndex}
              containerRef={containerRef} // 전달
            /> :
            <AnalysisDetailQuestion
              selectedIndex={selectedIndex}
              data={[interviewResults[selectedIndex]]}
            />}
          </a.AllWrap>
        </a.Container>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default AnalysisDetailSection;
