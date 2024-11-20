import { BASE_URL } from '@utils/requestMethods'
import * as a from '@components/analysisdetail/AnalysisDetailSynthesis/AnalysisDetailSynthesis.styled'
import { useState } from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRecoilValue } from 'recoil';
import { userState } from '@/stores/user';
import FullButton from '@common/Fullbutton/index';

// AnalysisDetailSection.tsx
export interface InterviewResult {
  id: number;
  video_path: string;
  anxiety_graph_path: string;
  gaze_distribution_path: string;
  posture_distribution_path: string;
  voice_distribution_path: string;
  expression_distribution_path: string;
  answer_text: (string | number)[]; // 문자열 또는 숫자 배열
  filler_word_positions: (string | number)[]; // 문자열 또는 숫자 배열
  follow_up_questions: (string | number)[]; // 문자열 또는 숫자 배열
  created_at: string;
  updated_at: string;
  interview: number;
  question_detail: {content: string};
}

interface AnalysisDetailSynthesisProps {
  selectedIndex: number;
  data: InterviewResult | InterviewResult[];
  setSelectedIndex: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const AnalysisDetailSynthesis: React.FC<AnalysisDetailSynthesisProps> = ({ selectedIndex, data, setSelectedIndex, containerRef }) => {
  const [isOpen, setIsOpen] = useState(false);

  // `data`가 배열이고 요소가 있는지 확인
  const gazeGraphPath = Array.isArray(data) && data.length > 0 ? data[0].gaze_distribution_path : null;
  const poseGraphPath = Array.isArray(data) && data.length > 0 ? data[0].posture_distribution_path : null;
  const expressionGraphPath = Array.isArray(data) && data.length > 0 ? data[0].expression_distribution_path : null;
  const answerText = Array.isArray(data) && data.length > 0 ? data[0].answer_text : null;
  const followUp = Array.isArray(data) && data.length > 0 ? data[0].follow_up_questions : null;
  const fillerWord = Array.isArray(data) && data.length > 0 ? data[0].filler_word_positions : null;

  const user = useRecoilValue(userState);
  console.log(answerText)
  console.log(followUp)
  console.log(fillerWord)

  const first_gaze = fillerWord?.[0]
  const second_gaze = fillerWord?.[1]
  const first_pose = followUp?.[0]
  const second_pose = followUp?.[1]
  const first_exp = answerText?.[0]
  const second_exp = answerText?.[1]

  const handleQuestionClick = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' }); // 스크롤을 맨 위로 이동
    }
    setSelectedIndex(index); // 상위 상태 업데이트
  };

  // PDF 다운로드 함수
  const downloadPDF = async () => {
    const element = document.getElementById('pdf-content'); // PDF로 변환할 요소 선택
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('interview_analysis.pdf');
    }
  };

  return (
    <a.Container>
      <a.titleDiv>
        {user.nickname} 님의 모의면접 종합분석 결과 입니다.
      </a.titleDiv>
      <a.subTitleDiv>
        그래프 수치가 높을 수록 각 지표가 불안정함을 나타냅니다.
      </a.subTitleDiv>
      <a.subTitleDiv2>
        이 수치는 절대적인 수치가 아닌 회원님의 면접결과에 대한 상대적인 수치를 나타냅니다.
      </a.subTitleDiv2>
      <a.graphTitle>
        질문 별 시선 분포 분석 결과
      </a.graphTitle>
      <a.graph imageUrl={`${BASE_URL}${gazeGraphPath}`}/>
      <a.contentWrap1>
        <a.contentWrap2>
          <a.contentWrap>
            {first_gaze !== 0 ?
              <a.contentTitle onClick={() => handleQuestionClick(first_gaze as number)}>
                {first_gaze}번 질문
              </a.contentTitle>
              :
              <div></div>
            }
            {second_gaze !== 0 ?
              <a.contentTitle onClick={() => handleQuestionClick(second_gaze as number)}>
                {second_gaze}번 질문
              </a.contentTitle>
              :
              <div></div>
            }
            <a.content>
              에서 가장 분포가 고르지 못하게 나타났습니다.
            </a.content>
          </a.contentWrap>
          <a.subTitleDiv>
            O번 질문 버튼을 누르면 해당 질문 상세페이지로 이동합니다.
          </a.subTitleDiv>
        </a.contentWrap2>
        <a.content>
          질문의 의도를 잘 파악하고 다시한번 연습해보세요!
        </a.content>
      </a.contentWrap1>

      <a.graphTitle>
        질문 별 자세 분포 분석 결과
      </a.graphTitle>
      <a.graph imageUrl={`${BASE_URL}${poseGraphPath}`}/>
      <a.contentWrap1>
        <a.contentWrap>
          {first_pose !== 0 ?
            <a.contentTitle onClick={() => handleQuestionClick(first_pose as number)}>
              {first_pose}번 질문
            </a.contentTitle>
            :
            <div></div>
          }
          {second_pose !== 0 ?
            <a.contentTitle onClick={() => handleQuestionClick(second_pose as number)}>
              {second_pose}번 질문
            </a.contentTitle>
            :
            <div></div>
          }
          <a.content>
            에서 가장 분포가 고르지 못하게 나타났습니다.
          </a.content>
        </a.contentWrap>
        <a.content>
          질문의 의도를 잘 파악하고 다시한번 연습해보세요!
        </a.content>
      </a.contentWrap1>
      <a.graphTitle>
        질문 별 표정 분석 결과
      </a.graphTitle>
      <a.graph imageUrl={`${BASE_URL}${expressionGraphPath}`}/>
      <a.contentWrap1>
        <a.contentWrap>
          {first_exp !== 0 ?
            <a.contentTitle onClick={() => handleQuestionClick(first_exp as number)}>
              {first_exp}번 질문
            </a.contentTitle>
            :
            <div></div>
          }
          {second_exp !== 0 ?
            <a.contentTitle onClick={() => handleQuestionClick(second_exp as number)}>
              {second_exp}번 질문
            </a.contentTitle>
            :
            <div></div>
          }
          <a.content>
            에서 가장 분포가 고르지 못하게 나타났습니다.
          </a.content>
        </a.contentWrap>
        <a.content>
          질문의 의도를 잘 파악하고 다시한번 연습해보세요!
        </a.content>
      </a.contentWrap1>
    </a.Container>
  )
}

export default AnalysisDetailSynthesis