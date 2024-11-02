import { useState, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import Modal from '@/common/Modal/index'
import FullButton from '@/common/Fullbutton'
import { useNavigate } from 'react-router-dom'

const Interviewing = () => {
  const navigate = useNavigate()
  const webcamRef = useRef<Webcam | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [videoSize, setVideoSize] = useState({
    width: window.innerHeight * 2,
    height: window.innerHeight
  })
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(true)
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false)
  const [timer, setTimer] = useState(60)
  const [currentFirstQuestion, setCurrentFirstQuestion] = useState(1)
  const [modalFirstContent, setModalFirstContent] = useState({
    name: '질문 시작1',
    texts: [
      '마이크 테스트를 위해',
      '시작하기 버튼을 누르고 다음 문장을 읽어주세요',
      '대답을 완료하면 하단에 답변완료 버튼을 눌러주세요',
      '안녕하십니까 지원자 OOO 입니다. 잘 부탁드립니다.'
    ]
  })
  const [currentSecondQuestion, setCurrentSecondQuestion] = useState(1)
  const [modalSecondContent, setModalSecondContent] = useState({
    name: '질문 생각1',
    texts: [
      'Q1. 1분 자기소개를 진행해주세요.'
    ]
  })

  const handleFirstNextQuestion = () => {
    if (currentFirstQuestion < 10) {
      setCurrentFirstQuestion(currentFirstQuestion + 1)
      updateModalFirstContent(currentFirstQuestion + 1)
    }
  }

  const handleSecondNextQuestion = () => {
    if (currentSecondQuestion < 10) {
      setCurrentSecondQuestion(currentSecondQuestion + 1)
      updateModalSecondContent(currentSecondQuestion + 1)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight
      const width = height * 1.8
      setVideoSize({ width, height })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (webcamRef.current && webcamRef.current.video) {
      webcamRef.current.video.muted = true
    }
  }, [webcamRef])

  const updateModalFirstContent = (questionNumber: number) => {
    const firstQuestionData = [
      {
        name: '질문 시작1',
        texts: [
          '마이크 테스트를 위해',
          '시작하기 버튼을 누르고 다음 문장을 읽어주세요',
          '답변을 완료하면 하단에 답변완료 버튼을 눌러주세요',
          '안녕하십니까 지원자 OOO 입니다. 잘 부탁드립니다.'
        ]
      },
      {
        name: '질문 시작2 0',
        texts: [
          '이제 카메라를 얼굴에 맞게 고정시킨 후',
          '면접을 진행해주세요',
          '생각하기 버튼을 누르면 질문과 생각시간 30초가 주어집니다',
          '답변 준비가 완료되면 답변하기 버튼을 눌러 답변을 시작하세요',
          '30초가 지나면 자동으로 답변이 시작합니다',
          '준비가 끝났다면 아래 생각하기 버튼을 눌러주세요',
        ]
      },
      {
        name: '질문 진행 01',
        texts: [
          'Q1. 1분 자기소개를 진행해주세요.',
          '첫 번째 질문이 끝났습니다.',
          '두 번째 질문 준비를 위해 생각하기 버튼을 눌러주세요.',
        ]
      },
      {
        name: '질문 진행 02',
        texts: [
          'Q2. Stable Diffusion을 활용한 프로젝트에서 text-inversion, lora, dreamboose 등 다양한 방법을 모색했다고 하셨는데, 각각의 방법을 선택하게 된 이유와 실제로 어떻게 적용하셨는지 구체적으로 설명해 주시겠습니까',
          '두 번째 질문이 끝났습니다.',
          '세 번째 질문 준비를 위해 생각하기 버튼을 눌러주세요.',
        ]
      },
      {
        name: '질문 진행 03',
        texts: [
          'Q3. 우리 회사에서 일하고 싶은 이유는 무엇인가요?',
          '마지막 질문 입니다.',
          '마지막 질문 준비를 위해 생각하기 버튼을 눌러주세요.',
        ]
      },
      {
        name: '질문 진행 4',
        texts: [
          'Q4. 앞으로 5년 후의 목표는 무엇인가요?',
          '면접이 끝났습니다.',
          '종료하기 버튼을 눌러 홈페이지로 이동해주세요.',
        ]
      },
    ]
    setModalFirstContent(firstQuestionData[questionNumber - 1])
  }

  const updateModalSecondContent = (questionNumber: number) => {
    const secondQuestionData = [
      {
        name: '질문 생각1',
        texts: ['Q1. 1분 자기소개를 진행해주세요.']
      },
      {
        name: '질문 생각2',
        texts: ['Q2. Stable Diffusion을 활용한 프로젝트에서 text-inversion, lora, dreamboose 등 다양한 방법을 모색했다고 하셨는데, 각각의 방법을 선택하게 된 이유와 실제로 어떻게 적용하셨는지 구체적으로 설명해 주시겠습니까']
      },
      {
        name: '질문 생각3',
        texts: ['Q3. 우리 회사에서 일하고 싶은 이유는 무엇인가요?']
      },
      {
        name: '질문 생각4',
        texts: ['Q4. 앞으로 5년 후의 목표는 무엇인가요?']
      },
    ]
    setModalSecondContent(secondQuestionData[questionNumber - 1])
  }

  const handleModalClose = () => {
    setIsFirstModalOpen(false)
    if (modalFirstContent.name === '질문 진행 4') {
      handleSaveRecording()
      navigate('/')
    }
    setTimeout(() => {
      if (modalFirstContent.name.includes('0')) {
        handleSecondModalOpen()
        handleSaveRecording()
        setTimer(60) // 타이머를 초기화
      }
    }, 100)
  }

  const handleSecondModalOpen = () => {
    setIsSecondModalOpen(true)
    handleFirstNextQuestion()
  }

  const handleSecondModalClose = () => {
    setIsSecondModalOpen(false)
    handleSecondNextQuestion()
  }

  useEffect(() => {
    if (!isFirstModalOpen && !isSecondModalOpen) {
      startRecording()
      const countdown = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1
          } else {
            stopRecording()
            clearInterval(countdown)
            return 0
          }
        })
      }, 1000)
      return () => clearInterval(countdown)
    }
  }, [isFirstModalOpen, isSecondModalOpen])

  const startRecording = () => {
    const stream = webcamRef.current?.video?.srcObject as MediaStream | null
    if (!stream) return

    const options = { mimeType: 'video/webm' }
    mediaRecorderRef.current = new MediaRecorder(stream, options)

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data])
      }
    }
    mediaRecorderRef.current.start()
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    if (currentFirstQuestion === 1) {
      handleFirstNextQuestion()
    }
    setIsFirstModalOpen(true)
    setTimer(60)
  }

  const handleSaveRecording = () => {
    const blob = new Blob(recordedChunks, { type: 'video/mp4' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = 'recorded_video.mp4'
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    setRecordedChunks([])
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      position: 'relative'
    }}>
      <Webcam
        audio={true}
        ref={webcamRef}
        mirrored
        style={{
          width: videoSize.width,
          height: videoSize.height,
          objectFit: 'cover',
          borderRadius: '10px',
          position: 'relative',
        }}
      />

      <div style={{
        position: 'absolute',
        right: '8.5vw',
        bottom: '2vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: '1vw',
        backgroundColor: 'white',
        height: '6vh',
        width: '12vw',
        borderRadius: '30px'
      }}>
        <FullButton text={`${timer}초 남음`} onClick={() => {}} disabled/>
        <FullButton text='답변완료' onClick={stopRecording} disabled={timer === 0}/>
      </div>

      {modalFirstContent.name.includes('진행') && !isFirstModalOpen ?
        <div style={{
          position: 'absolute',
          bottom: '1.6vh',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'left',
          backgroundColor: 'white',
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '3vh',
          width: '69.6vw',
          right: '22vw',
          zIndex: '100',
          padding: '1%',
        }}>
          {modalFirstContent.texts[0]}
        </div>
      :
      <div></div>
      }

      <img 
        src="src/assets/images/guideline.png" 
        alt="Overlay"
        style={{
          position: 'absolute',
          bottom: 0,
          width: '60vw',
          height: '90vh',
          opacity: 0.4
        }}
      />

      {isFirstModalOpen && (
        <Modal
          name={modalFirstContent.name}
          onClose={handleModalClose}
          texts={modalFirstContent.texts}
          width="100%"
          height="100%"
          openSecondModal={() => {
            if (!modalFirstContent.name.includes('시작')) {
              handleSecondModalOpen()
            }
          }}
        />
      )}

      {isSecondModalOpen && (
        <Modal
          name={modalSecondContent.name}
          onClose={handleSecondModalClose}
          openSecondModal={() => {}}
          texts={modalSecondContent.texts}
          width="100%"
          height="100%"
        />
      )}
    </div>
  )
}

export default Interviewing