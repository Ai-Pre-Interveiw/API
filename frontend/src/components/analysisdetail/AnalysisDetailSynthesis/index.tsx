import { BASE_URL } from '@utils/requestMethods'
import * as a from '@components/analysisdetail/AnalysisDetailSynthesis/AnalysisDetailSynthesis.styled'
import { useState } from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRecoilValue } from 'recoil';
import { userState } from '@/stores/user';

// AnalysisDetailSection.tsx
export interface InterviewResult {
  id: number;
  video_path: string;
  anxiety_graph_path: string;
  gaze_distribution_path: string;
  posture_distribution_path: string;
  voice_distribution_path: string;
  expression_distribution_path: string;
  answer_text: string[],
  filler_word_positions: string[];
  follow_up_questions: string[];
  created_at: string;
  updated_at: string;
  interview: number;
  question_detail: {content: string};
}

interface AnalysisDetailSynthesisProps {
  selectedIndex: number;
  data: InterviewResult | InterviewResult[];
}

const AnalysisDetailSynthesis: React.FC<AnalysisDetailSynthesisProps> = ({ selectedIndex, data }) => {
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
      <a.graphTitle>
        질문 별 시선 분포 분석 결과
      </a.graphTitle>
      <a.graph imageUrl={`${BASE_URL}${gazeGraphPath}`}/>
      <div>
        {first_gaze !== '0' ?
          <div>
            {first_gaze} 번 질문
          </div>
          :
          <div></div>
        }
        {first_gaze !== '0' ?
          <div>
            {second_gaze} 번 질문
          </div>
          :
          <div></div>
        }
        <div>
          에서 가장 분포가 고르지 못하게 나타났습니다.
        </div>
        <div>
          질문의 의도를 잘 파악하고 다시한번 연습해보세요!
        </div>
      </div>

      <a.graphTitle>
        질문 별 자세 분포 분석 결과
      </a.graphTitle>
      <a.graph imageUrl={`${BASE_URL}${poseGraphPath}`}/>
      <a.graphTitle>
        질문 별 표정 분석 결과
      </a.graphTitle>
      <a.graph imageUrl={`${BASE_URL}${expressionGraphPath}`}/>
    </a.Container>
  )
}

export default AnalysisDetailSynthesis