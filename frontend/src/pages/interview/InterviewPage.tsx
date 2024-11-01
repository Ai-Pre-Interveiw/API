import InterviewFooter from '@/components/interview/InterviewFooter'
import InterviewSection from '@/components/interview/InterviewSection'
import InterviewHeader from '@/components/interview/InterviewHeader'
import * as i from '@pages/interview/InterviewPage.styled'
import { useState } from 'react'
import { Outlet } from 'react-router'
import { useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'

const InterviewPage = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < 3) setCurrentPage(currentPage + 1)
  }

  const StartInterview = () => {
    navigate('/interviewing')
  }

  return (
    <i.Container>
      <InterviewHeader />
      {currentPage === 1 ?
        <InterviewSection
          key={currentPage}
          image='src/assets/images/interview1.png'
          texts={[
            '실전 면접에',
            '임한 다는 마음가짐으로',
            '복장을 단정히하고 면접을 진행해주세요.'
          ]}/> :
      currentPage === 2 ?
      <InterviewSection
        key={currentPage}
        image='src/assets/images/interview2.png'
        texts={[
          '정확한 결과분석을 위해',
          '정확한 발음과 적절한 목소리로',
          '면접을 진행해주세요.'
        ]}/> :
      <InterviewSection
        key={currentPage}
        image=''
        texts={[
          '질문은 총 7개로 구성되어 있고',
          '생각 시간은 30초 대답시간은 60초 입니다.',
          '면접은 약 10분간 진행될 예정입니다.'
        ]}/> 
      }
      <InterviewFooter />
      <i.WrapButton>
        {currentPage !== 1 ?
          <FullButton text='이전으로' onClick={handlePrevPage} disabled/> :
          <div></div>}
        {currentPage !== 3 ?
          <FullButton text='다음으로' onClick={handleNextPage} disabled/> :
          <FullButton text='시작하기' onClick={StartInterview} disabled/>}
      </i.WrapButton>
    </i.Container>
  )
}

export default InterviewPage