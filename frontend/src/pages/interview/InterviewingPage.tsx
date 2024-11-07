import { useState, useEffect, useRef} from 'react'
import Webcam from 'react-webcam'
import Modal from '@/common/Modal/index'
import FullButton from '@/common/Fullbutton'
import { useNavigate, useLocation  } from 'react-router-dom'
import { useSetRecoilState } from 'recoil';
import { userState } from '@stores/user';
import { getInterviewQuestions } from '@/apis/interview'
import { createInterviewResult } from '@/apis/interview'
import * as i from '@pages/interview/Interviewing.styled'

const Interviewing = () => {
  const navigate = useNavigate()
  const setUserState = useSetRecoilState(userState);
  const webcamRef = useRef<Webcam | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [videoSize, setVideoSize] = useState({
    width: window.innerHeight * 2,
    height: window.innerHeight
  })
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(true)
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false)
  const [timer, setTimer] = useState(1000000)
  const [currentFirstQuestion, setCurrentFirstQuestion] = useState(1)
  const location = useLocation();
  const interviewId = location.state?.interviewId;
  const [questions, setQuestions] = useState([])
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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questionsData = await getInterviewQuestions(interviewId); // 질문 데이터 비동기 요청
        setQuestions(questionsData); // 질문 상태 설정
      } catch (error) {
        console.error("질문을 불러오는데 실패했습니다:", error);
      }
    };
    
    loadQuestions();
  }, []); // 처음 한 번만 실행

  useEffect(() => {
    console.log(questions)
  }, [questions])


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
          questions[0]['content'],
          '첫 번째 질문이 끝났습니다.',
          '두 번째 질문 준비를 위해 생각하기 버튼을 눌러주세요.',
        ]
      },
      {
        name: '질문 진행 02',
        texts: [
          questions[1]['content'],
          '두 번째 질문이 끝났습니다.',
          '세 번째 질문 준비를 위해 생각하기 버튼을 눌러주세요.',
        ]
      },
      {
        name: '질문 진행 03',
        texts: [
          questions[2]['content'],
          '세 번째 질문이 끝났습니다.',
          '네 번째 질문 준비를 위해 생각하기 버튼을 눌러주세요.',
        ]
      },
      {
        name: '질문 진행 04',
        texts: [
          questions[3]['content'],
          '네 번째 질문이 끝났습니다.',
          '다섯 번째 질문 준비를 위해 생각하기 버튼을 눌러주세요.',
        ]
      },
      {
        name: '질문 진행 05',
        texts: [
          questions[4]['content'],
          '다섯 번째 질문이 끝났습니다.',
          '여섯 번째 질문 준비를 위해 생각하기 버튼을 눌러주세요.',
        ]
      },
      {
        name: '질문 진행 06',
        texts: [
          questions[5]['content'],
          '여섯 번째 질문이 끝났습니다.',
          '마지막 질문 준비를 위해 생각하기 버튼을 눌러주세요.',
        ]
      },
      {
        name: '질문 진행 7',
        texts: [
          questions[6]['content'],
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
        texts: questions[0]['content']
      },
      {
        name: '질문 생각2',
        texts: questions[1]['content']
      },
      {
        name: '질문 생각3',
        texts: questions[2]['content']
      },
      {
        name: '질문 생각4',
        texts: questions[3]['content']
      },
      {
        name: '질문 생각5',
        texts: questions[4]['content']
      },
      {
        name: '질문 생각6',
        texts: questions[5]['content']
      },
      {
        name: '질문 생각7',
        texts: questions[6]['content']
      },
    ]
    setModalSecondContent(secondQuestionData[questionNumber - 1])
  }

  const handleModalClose = () => {
    setIsFirstModalOpen(false)
    if (modalFirstContent.name === '질문 진행 7') {
      handleSaveRecording()
      setUserState((prevUser) => ({
        ...prevUser,
        result: [...(prevUser.result || []), [...videoList]], // videoList를 result에 추가
      }));
      setVideoList([]);
      toggleFullScreen();
      navigate('/')
    }
    setTimeout(() => {
      if (modalFirstContent.name.includes('0')) {
        handleSecondModalOpen()
        handleSaveRecording()
        setTimer(1000000) // 타이머를 초기화
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
    setTimer(100000)
  }

  const [videoList, setVideoList] = useState<{ filePath: string; uploadTime: string }[]>([]);

  const handleSaveRecording = async () => {
    // console.log(recordedChunks);
    const blob = new Blob(recordedChunks, { type: 'video/webm' })

    if (currentSecondQuestion === 1) {
      // console.log(interviewId)
      // console.log(((interviewId) * 8))
    
      const formData = new FormData();
      formData.append('interview', interviewId.toString());  // 면접 ID
      formData.append('question', (interviewId * 8).toString()); // 질문 ID
      formData.append('video_path', blob, `recorded_video_${new Date().toISOString()}.webm`);  // 파일 데이터 추가
      
      const response = await createInterviewResult(formData);
    } else {
      // console.log(interviewId)
      // console.log(((interviewId - 1) * 8) + currentSecondQuestion - 1)
      
      const formData = new FormData();
      formData.append('interview', interviewId.toString());  // 면접 ID
      formData.append('question', (((interviewId - 1) * 8) + currentSecondQuestion - 1).toString()); // 질문 ID
      formData.append('video_path', blob, `recorded_video_${new Date().toISOString()}.webm`);  // 파일 데이터 추가

      const response = createInterviewResult(formData);
    }

    setRecordedChunks([])
  }

  const [isMicActive, setIsMicActive] = useState(false)
  const [micLevel, setMicLevel] = useState(0)

  useEffect(() => {
    // 마이크 상태와 감도 확인
    const checkMicStatus = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const audioContext = new AudioContext()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)
        analyser.fftSize = 256
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
  
        const checkAudioInput = () => {
          analyser.getByteFrequencyData(dataArray)
          const volume = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length // 평균 볼륨 계산
          setMicLevel(volume) // 마이크 감도 상태 업데이트
  
          if (volume > 50 && !isMicActive) { 
            // isMicActive가 이미 true라면 변경하지 않음
            setIsMicActive(true)
          }
        }
        const interval = setInterval(checkAudioInput, 100)
  
        return () => {
          clearInterval(interval)
          audioContext.close()
          stream.getTracks().forEach(track => track.stop())
        }
      } catch (error) {
        console.error("마이크 접근에 실패했습니다:", error)
      }
    }
    checkMicStatus()
  }, [isMicActive])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // 전체화면 토글 함수
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch(err => console.error("Failed to enter fullscreen:", err))
    } else {
      document.exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch(err => console.error("Failed to exit fullscreen:", err))
    }
  }

  useEffect(() => {
    // F11을 누른 효과를 위해 컴포넌트가 마운트될 때 전체화면으로 전환
    toggleFullScreen()
  }, [])
  
  return (
    <div
      ref={containerRef}
      style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      position: 'relative',
      backgroundColor: 'black',
      }}
    >
      <Webcam
        audio={true}
        ref={webcamRef}
        mirrored
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
        }}
      />

      {/* 마이크 감도 바 */}
      {currentFirstQuestion == 1 ?
        <div style={{
          position: 'absolute',
          bottom: '18vh',
          right: '4vw',
          width: '9vw',
          height: '1vh',
          backgroundColor: 'lightgray',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${micLevel}%`, // 마이크 감도에 따라 너비 조정
            height: '100%',
            backgroundColor: micLevel > 50 ? 'green' : 'red',
            transition: 'width 0.1s ease' // 부드러운 애니메이션 효과
          }} />
        </div> : 
      <div></div>
      }


      <div style={{
        position: 'absolute',
        right: '5vw',
        bottom: '10vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <FullButton text='답변완료' onClick={() => {
         if (isMicActive) {
          stopRecording()
         } else {
          alert('마이크가 연결되지 않았습니다.')
         }
        }} disabled={timer === 0}/>
      </div>

      <div style={{
        position: 'absolute',
        right: '5vw',
        top: '5vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: timer <= 10 ? 'red' : 'white',
        height: '6vh',
        width: '6.8vw',
        borderRadius: '30px',
        fontWeight: 'bold',
        fontSize: '2vh',
        color: timer <= 10 ? 'white' : 'black'
      }}>
        {timer}초
      </div>

      <div style={{
        position: 'absolute',
        left: '5vw',
        top: '5vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '6vh',
        width: '6.8vw',
        borderRadius: '30px',
        fontWeight: 'bold',
        fontSize: '2vh',
      }}>
        {currentSecondQuestion - 1} / 7
      </div>

      {modalFirstContent.name.includes('진행') && !isFirstModalOpen ?
        <i.AnimatedDiv isHidden={isFirstModalOpen}>
          {modalFirstContent.texts[0]}
        </i.AnimatedDiv>
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
          opacity: 0.2
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