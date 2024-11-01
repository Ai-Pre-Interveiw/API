import { useState, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import Modal from '@/common/Modal/index'
import FullButton from '@/common/Fullbutton'

const Interviewing = () => {
  const webcamRef = useRef<Webcam | null>(null) // Webcam 타입 설정
  const mediaRecorderRef = useRef<MediaRecorder | null>(null) // MediaRecorder 타입 설정
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]) // 녹화된 데이터 저장
  const [videoSize, setVideoSize] = useState({
    width: window.innerHeight * 1.8,
    height: window.innerHeight
  })
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [timer, setTimer] = useState(60)

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
      webcamRef.current.video.muted = true // 오디오 출력 제한
    }
  }, [webcamRef])

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (!isModalOpen) {
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
  }, [isModalOpen])

  const startRecording = () => {
    const stream = webcamRef.current?.video?.srcObject as MediaStream | null
    if (!stream) return

    const options = { mimeType: 'video/mp4' }
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
        right: '9vw',
        bottom: '2vh',
        display: 'flex',
        flexDirection: 'row',
        gap: '1vw',
      }}>
        <FullButton text={`${timer}초 남음`} onClick={() => {}} disabled/>
        <FullButton text='대답완료' onClick={stopRecording} disabled/>
      </div>

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

      {isModalOpen && (
        <Modal
          name="면접 시작"
          onClose={handleModalClose}
          texts={[
            '마이크 테스트를 위해',
            '시작하기 버튼을 누르고 다음 문장을 읽어주세요',
            '안녕하십니까 지원자 OOO 입니다. 잘 부탁드립니다.'
          ]}
          width="100%"
          height="100%"
          openSecondModal={() => {}}
        />
      )}
    </div>
  )
}

export default Interviewing


      {/* {recordedChunks.length > 0 && (
        <FullButton 
          text="녹화 저장" 
          onClick={handleSaveRecording} 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px'
          }}
        />
      )} */}