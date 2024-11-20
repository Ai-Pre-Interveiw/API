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
  answer_text: string[],
  filler_word_positions: string;
  follow_up_questions: string[];
  created_at: string;
  updated_at: string;
  interview: number;
  question_detail: {content: string};
  voice_top_indices: number[],
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
  const answerText = Array.isArray(data) && data.length > 0 ? data[0].answer_text : null;
  const followUp = Array.isArray(data) && data.length > 0 ? data[0].follow_up_questions : null;
  const voiceIndices = Array.isArray(data) && data.length > 0 ? data[0].voice_top_indices : null;
  const fillerWord = Array.isArray(data) && data.length > 0 ? data[0].filler_word_positions : null;
  
  const first_voice = voiceIndices?.[0]
  const second_voice = voiceIndices?.[1]

  // "좋은점"과 "아쉬운점" 분리
  const positiveFeedback = fillerWord?.includes("좋은점:") 
    ? fillerWord.split("아쉬운점:")[0].replace("좋은점:", "").trim()
    : "";
  const negativeFeedback = fillerWord?.includes("아쉬운점:")
    ? fillerWord.split("아쉬운점:")[1].trim()
    : "";

  console.log(fillerWord)
  console.log(positiveFeedback)
  console.log(negativeFeedback)
  // console.log(data);
  // console.log(anxietyGraphPath)
  // console.log(voiceGraphPath)

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
          <a.newSummaryWrap>
            <a.summaryWrap>
              <a.summary>
                질문에 대한 긴장도 분석 결과입니다.
              </a.summary>
              <a.summary>
                긴장도 최고치는 {first_voice}초와 {second_voice}초 였습니다. 영상을 확인하고 이유와 원인을 찾아보세요.
              </a.summary>
            </a.summaryWrap>
            <a.graphSummary>
              ※ 그래프가 녹색 구역을 벗어나 높아질 수록 긴장했다는 것을 의미합니다.
            </a.graphSummary>
          </a.newSummaryWrap>
          <a.titleText>
            답변 분석 결과
          </a.titleText>
          <a.script>
            {answerText}
          </a.script>
          <a.summaryWrap>
            {positiveFeedback !== 'NaN' ?
              <a.summary>
                좋은점 : {positiveFeedback}
              </a.summary>:
              <div></div>
            }
            {negativeFeedback !== 'NaN' ?
              <a.summary>
                아쉬운점 : {negativeFeedback}
              </a.summary>:
              <div></div>
            }
          </a.summaryWrap>
          <a.ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '▲' : '▼'} 예상 꼬리질문 보러가기
          </a.ToggleButton>
          <a.Content isOpen={isOpen}>
            <a.ContentText>
              {followUp}
            </a.ContentText>
          </a.Content>
          <a.grapBigWrap>
            <a.graphWrap>
              <a.graphTitle>
                시선분포
              </a.graphTitle>
              <a.graph imageUrl={`${BASE_URL}${gazeGraphPath}`}>
              </a.graph>
              <a.graphSummaryWrap>
                <a.summary>
                  그래프가 녹색영역에 집중되어 있다면
                </a.summary>
                <a.summary>
                  시선을 한 곳에 집중하여 답변 했다는 것을 의미합니다.
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
                  그래프가 녹색영역에 집중되어 있다면
                </a.summary>
                <a.summary>
                  바른 자세로 움직이지 않고 답변 했다는 것을 의미합니다.
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
                  그래프가 녹색 범위를 벗어나 위로 상승하면
                </a.summary>
                <a.summary>
                  답변 목소리의 긴장도가 높아졌음을 의미합니다.
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
                  점선은 표정의 평균 긴장 정도 입니다.
                </a.summary>
                <a.summary>
                  점선을 벗어나 수치가 많이 올라간다면 표정의 긴장도가 높아졌음을 의미합니다.
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
