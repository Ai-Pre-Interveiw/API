import InterviewFooter from '@/components/interview/InterviewFooter'
import InterviewSection from '@/components/interview/InterviewSection'
import InterviewHeader from '@/components/interview/InterviewHeader'
import * as i from '@pages/interview/InterviewPage.styled'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'


const InterviewPage = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const location = useLocation();
  const interviewId = location.state?.interviewId;
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < 5) setCurrentPage(currentPage + 1)
  }

  const StartInterview = () => {
    navigate('/interviewing', { state: { interviewId: interviewId } })
  }

  // useEffect for auto-advance from page 4 to 5 after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentPage === 4) {
      timer = setTimeout(() => {
        setCurrentPage(5);
      }, 5000); // 5 seconds delay
    }
    return () => clearTimeout(timer); // Clear the timer on cleanup
  }, [currentPage]);

  return (
    <i.Container>
      <InterviewHeader />
      {currentPage === 1 ?
        <InterviewSection
          key={currentPage}
          image='/images/interview1.png'
          texts={[
            '실전 면접에',
            '임한다는 마음가짐으로',
            '복장을 단정히하고 면접을 진행해주세요.'
          ]}/> :
      currentPage === 2 ?
      <InterviewSection
        key={currentPage}
        image='/images/interview2.png'
        texts={[
          '정확한 결과분석을 위해',
          '정확한 발음과 적절한 목소리로',
          '면접을 진행해주세요.'
        ]}/> :
      currentPage === 3 ?
      <InterviewSection
        key={currentPage}
        image=''
        texts={[
          '질문은 총', '7개', '로 구성되며',
          '생각 시간은', '30초', '대답시간은', '60초', '입니다.',
          '면접은 약', '10분', '간 진행될 예정입니다.'
        ]}/> :
      currentPage === 4 ?
      <InterviewSection
        key={currentPage}
        image='/images/connecting.png'
        texts={[
          '면접관을 연결중입니다', '.'
        ]}/> :
      <InterviewSection
        key={currentPage}
        image='/images/check.png'
        texts={[
          '면접관이 연결되었습니다 !',
        ]}/>
      }
      <InterviewFooter />
      <i.WrapButton>
        {currentPage !== 1 ?
          <FullButton text='이전으로' onClick={handlePrevPage} disabled/> :
          <div></div>}
        {currentPage === 4 ? 
        <div></div>:
        currentPage !== 5 ?
          <FullButton text='다음으로' onClick={handleNextPage} disabled/> :
          <FullButton text='시작하기' onClick={StartInterview} disabled/>}
      </i.WrapButton>
    </i.Container>
  )
}

export default InterviewPage