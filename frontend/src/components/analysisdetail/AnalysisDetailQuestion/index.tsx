import { BASE_URL } from '@utils/requestMethods'
import * as a from '@components/analysisdetail/AnalysisDetailQuestion/AnalysisDetailQuestion.styled'
import { useNavigate } from 'react-router-dom'
import { userState } from '@/stores/user'
import { useRecoilValue } from 'recoil'
import { useState } from 'react'
import FullButton from '@common/Fullbutton/index'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// AnalysisDetailSection.tsx
export interface InterviewResult {
  id: number;
  video_path: string;
  anxiety_graph_path: string;
  gaze_distribution_path: string;
  posture_distribution_path: string;
  voice_distribution_path: string;
  expression_distribution_path: string;
  filler_word_positions: string[];
  follow_up_questions: string[];
  created_at: string;
  updated_at: string;
  interview: number;
  question_detail: {content: string};
}

interface AnalysisDetailQuestionProps {
  selectedIndex: number;
  data: InterviewResult | InterviewResult[];
}

const AnalysisDetailQuestion: React.FC<AnalysisDetailQuestionProps> = ({ selectedIndex, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  // `data`가 배열이고 요소가 있는지 확인
  const videoPath = Array.isArray(data) && data.length > 0 ? data[0].video_path : null;
  const questionContent = Array.isArray(data) && data.length > 0 ? data[0].question_detail.content : null;
  const gazeGraphPath = Array.isArray(data) && data.length > 0 ? data[0].gaze_distribution_path : null;
  const poseGraphPath = Array.isArray(data) && data.length > 0 ? data[0].posture_distribution_path : null;
  const anxietyGraphPath = Array.isArray(data) && data.length > 0 ? data[0].anxiety_graph_path : null;
  const voiceGraphPath = Array.isArray(data) && data.length > 0 ? data[0].voice_distribution_path : null;
  const expressionGraphPath = Array.isArray(data) && data.length > 0 ? data[0].expression_distribution_path : null;

  console.log(data);
  console.log(anxietyGraphPath)
  console.log(voiceGraphPath)

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
      {/* <FullButton text="PDF 다운로드" onClick={downloadPDF} disabled/> */}
      <div id='pdf-content'>
      {selectedIndex === -1 ? (
        <div>
          <p>종합 분석</p>
        </div>
      ) : selectedIndex !== null ? (
        <div>
          <a.question>
            ' {questionContent} '
          </a.question>
          <a.titleText>
            긴장도 & 당황도 분석 결과
          </a.titleText>
          <a.videoGraphWrap>
            <a.video
                src={`${BASE_URL}${videoPath}`} // BASE_URL과 video_path를 조합하여 동영상 URL 생성
                controls // 동영상 컨트롤 표시
              />
              <a.nervousGraph imageUrl={`${BASE_URL}${anxietyGraphPath}`}>
              </a.nervousGraph>
          </a.videoGraphWrap>
          <a.summaryWrap>
            <a.summary>
              질문에 대한 긴장도 분석 결과입니다.
            </a.summary>
            <a.summary>
              긴장도 최고치는 BACKEND초와 BACKEND초 였습니다. 영상을 확인하고 이유와 원인을 찾아보세요.
            </a.summary>
          </a.summaryWrap>
          <a.titleText>
            답변 분석 결과
          </a.titleText>
          <a.script>
            스크립트 부분
          </a.script>
          <a.summaryWrap>
            <a.summary>
              질문 {selectedIndex + 1}에 대한 답변의 적절성은 BACKEND 입니다.
            </a.summary>
            <a.summary>
              꼬리질문 생성 가능성 높음의 키워드가 BACKEND건 발견 되었습니다.
            </a.summary>
          </a.summaryWrap>
          <a.ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '▲' : '▼'} 예상 꼬리질문 보러가기
          </a.ToggleButton>
          <a.Content isOpen={isOpen}>
            <a.ContentText>
              여기에 예상 꼬리질문 내용이 들어갑니다. 추가적인 정보나 질문을 표시하려면 이곳을 사용하세요.
            </a.ContentText>
            <a.ContentText>
              여러 줄의 텍스트를 넣을 수 있으며, 확장/축소가 가능합니다.
            </a.ContentText>
          </a.Content>
          <a.summaryWrap>
            <a.summary>
              어, 음 등의 반복어가 BACKEND건 발견되었습니다.
            </a.summary>
            <a.summary>
              답변에 신중하신 것은 좋지만 지나친 미사여구는 면접에 불이익이 될 수 있습니다.
            </a.summary>
          </a.summaryWrap>
          <a.grapBigWrap>
            <a.graphWrap>
              <a.graphTitle>
                시선분포
              </a.graphTitle>
              <a.graph imageUrl={`${BASE_URL}${gazeGraphPath}`}>
              </a.graph>
              <a.graphSummaryWrap>
                <a.summary>
                  시선이 평균에 벗어나는 빈도수가 많습니다.
                </a.summary>
                <a.summary>
                  실제로 면접관의 눈을 본다고 생각하고 면접에 임해주세요.
                </a.summary>
                <a.summary>
                  시선을 회피하면 면접관은 면접자가 자신감이 없다고 생각합니다.
                </a.summary>
              </a.graphSummaryWrap>
            </a.graphWrap>
            <a.graphWrap>
              <a.graphTitle>
                자세분포
              </a.graphTitle>
              <a.graph imageUrl={`${BASE_URL}${poseGraphPath}`}>
              </a.graph>
              <a.graphSummaryWrap>
                <a.summary>
                  자세의 분포가 아주 좋습니다.
                </a.summary>
                <a.summary>
                  꾸준히 노력하여 좋은 자세로 면접에 임해주세요.
                </a.summary>
              </a.graphSummaryWrap>
            </a.graphWrap>
          </a.grapBigWrap>
          <a.grapBigWrap>
            <a.graphWrap>
              <a.graphTitle>
                목소리 분포
              </a.graphTitle>
              <a.graph imageUrl={`${BASE_URL}${voiceGraphPath}`}>
              </a.graph>
              <a.graphSummaryWrap>
                <a.summary>
                  목소리의 분포가 아주 좋습니다.
                </a.summary>
                <a.summary>
                  꾸준히 노력하여 좋은 목소리로 면접에 임해주세요.
                </a.summary>
              </a.graphSummaryWrap>
            </a.graphWrap>
            <a.graphWrap>
              <a.graphTitle>
                표정분포
              </a.graphTitle>
              <a.graph imageUrl={`${BASE_URL}${expressionGraphPath}`}>
              </a.graph>
              <a.graphSummaryWrap>
                <a.summary>
                  표정의 분포가 아주 좋습니다.
                </a.summary>
                <a.summary>
                  꾸준히 노력하여 좋은 표정로 면접에 임해주세요.
                </a.summary>
              </a.graphSummaryWrap>
            </a.graphWrap>
          </a.grapBigWrap>
        </div>
      ) : (
        <p>선택된 질문이 없습니다</p>
      )}
            
    </div>
    </a.Container>
  )
}

export default AnalysisDetailQuestion
