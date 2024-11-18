import { useState, useEffect, useRef} from 'react'
import Webcam from 'react-webcam'
import Modal from '@/common/Modal/index'
import FullButton from '@/common/Fullbutton'
import { useNavigate, useLocation  } from 'react-router-dom'
import { useSetRecoilState } from 'recoil';
import { userState } from '@stores/user';
import { getInterviewQuestions,
        createInterviewResult,
        getInterviewDetails,
        inferenceEyePose,
       } from '@/apis/interview'
import * as i from '@pages/interview/Interviewing.styled'
import InterviewFooter from '@/components/interview/InterviewFooter'
import { BASE_URL } from '@/utils/requestMethods'

interface Interview {
  position: string;
  experience_level: string;
  // 다른 필요한 속성들도 여기에 추가하세요.
}

interface Question {
  audio_file: string;
  content: string;
  // 필요에 따라 다른 속성들도 추가
}

const Interviewing = () => {
  const navigate = useNavigate()
  const setUserState = useSetRecoilState(userState);
  const webcamRef = useRef<Webcam | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const location = useLocation();
  const interviewId = location.state?.interviewId;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [interveiw, setInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 질문 인덱스 상태 추가
  const [isThinking, setIsThinking] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const SixtyInitialCountdown = 60;
  const ThirtyInitialCountdown = 30;
  const [SixtyCountdown, setSixtyCountdown] = useState(SixtyInitialCountdown); // 카운트다운 상태 추가
  const [ThirtyCountdown, setThirtyCountdown] = useState(ThirtyInitialCountdown); // 카운트다운 상태 추가
  const timerRef = useRef<NodeJS.Timeout | null>(null); // 타이머 레퍼런스
  const audioRef = useRef<HTMLAudioElement | null>(null); // 오디오 재생을 위한 ref

  const questionContent = questions.length > 0 ? [
    {
      name: '질문 시작1',
      texts: [
        '마이크 테스트를 위해 하단의', '시작하기', '버튼을 누르고', '테스트 문장', '을 확인해주세요.',
        '',
        '확인 후', '답변하기', '버튼을 눌러 테스트 문장에 답변 해주시고',
        '답변을 완료하면 하단에', '답변완료', '버튼을 눌러주세요.',
        '안녕하십니까 지원자 OOO 입니다. 잘 부탁드립니다.'
      ]
    },
    {
      name: '질문 시작2 0',
      texts: [
        '이제 카메라를 얼굴에 맞게 고정시킨 후 면접을 진행해주세요',
        '생각하기', '버튼을 누르면 질문과 생각시간', '30초', '가 주어집니다',
        '30초', '가 지나면 자동으로 답변을 시작합니다',
        '답변 준비가 완료되면', '답변하기', '버튼을 눌러 답변을 시작하세요',
        '답변 시간은', '60초', '입니다',
        '준비가 끝났다면 아래', '생각하기', '버튼을 눌러주세요',
        questions[0]['content'],
      ]
    },
    {
      name: '질문 진행 01',
      texts: [
        '첫 번째 질문이 끝났습니다.',
        '두 번째 질문 준비를 위해', '생각하기', '버튼을 눌러주세요.',
        questions[1]['content'],
      ]
    },
    {
      name: '질문 진행 02',
      texts: [
        '두 번째 질문이 끝났습니다.',
        '세 번째 질문 준비를 위해', '생각하기', '버튼을 눌러주세요.',
        questions[2]['content'],
      ]
    },
    {
      name: '질문 진행 03',
      texts: [
        '세 번째 질문이 끝났습니다.',
        '네 번째 질문 준비를 위해', '생각하기', '버튼을 눌러주세요.',
        questions[3]['content'],
      ]
    },
    {
      name: '질문 진행 04',
      texts: [
        '네 번째 질문이 끝났습니다.',
        '다섯 번째 질문 준비를 위해', '생각하기', '버튼을 눌러주세요.',
        questions[4]['content'],
      ]
    },
    {
      name: '질문 진행 05',
      texts: [
        '다섯 번째 질문이 끝났습니다.',
        '여섯 번째 질문 준비를 위해', '생각하기', '버튼을 눌러주세요.',
        questions[5]['content'],
      ]
    },
    {
      name: '질문 진행 06',
      texts: [
        '여섯 번째 질문이 끝났습니다.',
        '마지막 질문 준비를 위해', '생각하기', '버튼을 눌러주세요.',
        questions[6]['content'],
      ]
    },
    {
      name: '질문 진행 7',
      texts: [
        '면접이 끝났습니다.',
        '종료하기', '버튼을 눌러 홈페이지로 이동해주세요.',
        '',
      ]
    },
  ] : []

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questionsData = await getInterviewQuestions(interviewId); // 질문 데이터 비동기 요청
        const interviewData = await getInterviewDetails(interviewId)
        setQuestions(questionsData); // 질문 상태 설정
        setInterview(interviewData)
      } catch (error) {
        console.error("질문을 불러오는데 실패했습니다:", error);
      }
    };
    loadQuestions();
  }, []); // 처음 한 번만 실행

  useEffect(() => {
    console.log(questions)
    console.log(interveiw)
  }, [questions, interveiw])

  useEffect(() => {
    if (webcamRef.current && webcamRef.current.video) {
      webcamRef.current.video.muted = true
    }
  }, [webcamRef])

  const startRecording = () => {
    const stream = webcamRef.current?.video?.srcObject as MediaStream | null;
    if (!stream) return;
  
    const options = { mimeType: 'video/mp4' };
    mediaRecorderRef.current = new MediaRecorder(stream, options);
  
    const chunks: Blob[] = []; // 녹화된 데이터를 저장할 배열
  
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data); // chunks 배열에 데이터 추가
      }
    };
  
    mediaRecorderRef.current.onstop = async () => {
      if (chunks.length === 0) {
        console.log("No recorded chunks available.");
        return;
      }
  
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const formData = new FormData();
      formData.append('interview', interviewId.toString());
  
      const questionId = currentQuestionIndex === 0
        ? (interviewId * 8).toString()
        : (((interviewId - 1) * 8) + currentQuestionIndex).toString();
  
      formData.append('question', questionId);
      formData.append('video_path', blob, `recorded_video_${new Date().toISOString()}_${questionId}.mp4`);
  
      try {
        const response = await createInterviewResult(formData);
        console.log("Recording saved:", response);
      } catch (error) {
        console.error("Error saving recording:", error);
      }
    };
  
    mediaRecorderRef.current.start();
  };
  
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };
  
  // const [videoList, setVideoList] = useState<{ filePath: string; uploadTime: string }[]>([]);

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

  useEffect(() => {
    // countdown이 0이 될 때 상태에 따라 자동으로 다음 동작으로 전환
    if (ThirtyCountdown === 0) {
        handleAnswerMode(); // 생각모드가 끝나면 답변모드로 전환
      } 
  }, [ThirtyCountdown]);

  useEffect(() => {
    if (SixtyCountdown === 0) {
        handleAnswerComplete(); // 답변모드가 끝나면 다음 질문으로 이동
      }
  }, [SixtyCountdown]);

  const startThirtyCountdown = (seconds : any) => {
    // 타이머 시작
    setThirtyCountdown(seconds);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setThirtyCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSixtyCountdown = (seconds : any) => {
    // 타이머 시작
    setSixtyCountdown(seconds);
    console.log(seconds)
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSixtyCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetThirtyCountdown = () => {
    // 타이머 초기화
    setThirtyCountdown(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetSixtyCountdown = () => {
    // 타이머 초기화
    setSixtyCountdown(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 오디오 파일 재생 함수
  const playAudioFile = (audioPath: string) => {
    console.log('오디오패스요', audioPath)
    if (audioRef.current) {
      if (audioPath === 'normal.mp3') {
        audioRef.current.src = 'normal.mp3';
        audioRef.current.play().catch((error) => {
          console.error("오디오 파일 재생 실패:", error);
        });
      }
      else {
        audioRef.current.src = `${BASE_URL}${audioPath}`;
        audioRef.current.play().catch((error) => {
          console.error("오디오 파일 재생 실패:", error);
        });
      }
    }
  };

// 오디오 재생 중지 함수
const stopAudio = () => {
  if (audioRef.current) {
    audioRef.current.pause(); // 오디오 재생 중지
    audioRef.current.currentTime = 0; // 재생 위치를 처음으로 되돌림
  }
};

  const handleThinkingMode = () => {
    setIsThinking(true);
    setIsAnswering(false);
    startThirtyCountdown(30); // 생각하기 모드에서 30초 카운트다운 시작
    if (questions[currentQuestionIndex - 1]?.audio_file && currentQuestionIndex > 0) {
      playAudioFile(questions[currentQuestionIndex - 1].audio_file);
    } else if (currentQuestionIndex !== 0) {
      playAudioFile('normal.mp3');
    }
  };

  const handleAnswerMode = () => {
    setIsThinking(false);
    setIsAnswering(true);
    stopAudio();
    startSixtyCountdown(60); // 답변하기 모드에서 60초 카운트다운 시작
    startRecording();
  };


  const handleAnswerComplete = () => {
    // resetThirtyCountdown();
    resetSixtyCountdown(); // 카운트다운 초기화
    setIsAnswering(false);
    stopRecording(); // 녹화 종료
    setSixtyCountdown(60); // 60초로 리셋
    if (currentQuestionIndex < questionContent.length - 1) {
      stopAudio()
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // 다음 질문으로 이동
      setIsThinking(false);
    } else {
      alert('모든 질문이 완료되었습니다.');
      alert('분석결과 페이지에서 분석하기 버튼을 눌러주세요.');
      navigate('/')
    }
  };

  const ThirtyProgress = (ThirtyCountdown / ThirtyInitialCountdown) * 100; // 진행률 계산 (퍼센트)
  const SixtyProgress = (SixtyCountdown / SixtyInitialCountdown) * 100; // 진행률 계산 (퍼센트)
  
  return (
    <div>
      <audio ref={audioRef} /> {/* 오디오 엘리먼트 추가 */}
      {/* <InterviewHeader/> */}
      <i.Container isStart={currentQuestionIndex >= 1}>
        <i.videoWrap isMinimized={!isThinking && !isAnswering}>
          <i.styledWebcam
            audio={true}
            ref={webcamRef}
            mirrored
          />
        </i.videoWrap>

        {/* 마이크 감도 바 */}
          <div style={{
            position: 'absolute',
            bottom: '18vh',
            right: '4vw',
            width: '7vw',
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
          </div>

        {isThinking || isAnswering ? 
            // 생각하기 모드일 때는 마지막 텍스트만 표시
            <i.questionWrap>{questionContent[currentQuestionIndex]?.texts.slice(-1)[0]}</i.questionWrap>
            : currentQuestionIndex === 0 ?
            <i.textWrap1>
              <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[0]}</i.textWrap2>
              <i.textWrapRow>
                <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[1]}</i.textWrap3>
                <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[2]}</i.textWrap2>
                <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[3]}</i.textWrap3>
                <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[4]}</i.textWrap2>
              </i.textWrapRow>
              <i.textWrap2></i.textWrap2>
              <i.textWrapRow>
                <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[6]}</i.textWrap2>
                <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[7]}</i.textWrap3>
                <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[8]}</i.textWrap2>
              </i.textWrapRow>
              <i.textWrapRow>
                <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[9]}</i.textWrap2>
                <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[10]}</i.textWrap3>
                <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[11]}</i.textWrap2>
              </i.textWrapRow>
            </i.textWrap1>
            : currentQuestionIndex === 1 ?
            <i.textWrap1>
              <i.textWrapRow>
                <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[0]}</i.textWrap2>
              </i.textWrapRow>
              <i.textWrap2></i.textWrap2>
              <i.textWrapAniate>
                <i.textWrapRow>
                  <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[1]}</i.textWrap3>
                  <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[2]}</i.textWrap2>
                  <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[3]}</i.textWrap3>
                  <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[4]}</i.textWrap2>
                </i.textWrapRow>
                <i.textWrapRow>
                  <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[5]}</i.textWrap3>
                  <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[6]}</i.textWrap2>
                </i.textWrapRow>
              </i.textWrapAniate>
              <i.textWrap2></i.textWrap2>
              <i.textWrapAniate2>
                <i.textWrapRow>
                  <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[7]}</i.textWrap2>
                  <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[8]}</i.textWrap3>
                  <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[9]}</i.textWrap2>
                </i.textWrapRow>
                <i.textWrapRow>
                  <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[10]}</i.textWrap2>
                  <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[11]}</i.textWrap3>
                  <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[12]}</i.textWrap2>
                </i.textWrapRow>
                <i.textWrapRow>
                  <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[13]}</i.textWrap2>
                  <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[14]}</i.textWrap3>
                  <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[15]}</i.textWrap2>
                </i.textWrapRow>
              </i.textWrapAniate2>
            </i.textWrap1>
            : currentQuestionIndex !== 8 ?
            <i.textWrap1>
              <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[0]}</i.textWrap2>
              <i.textWrapRow>
                <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[1]}</i.textWrap2>
                <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[2]}</i.textWrap3>
                <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[3]}</i.textWrap2>
              </i.textWrapRow>
            </i.textWrap1> :
            <i.textWrap1>
            <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[0]}</i.textWrap2>
            <i.textWrapRow>
              <i.textWrap3>{questionContent[currentQuestionIndex]?.texts[1]}</i.textWrap3>
              <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[2]}</i.textWrap2>
              <i.textWrap2>{questionContent[currentQuestionIndex]?.texts[3]}</i.textWrap2>
            </i.textWrapRow>
          </i.textWrap1>
          }

        <i.button>
        {
        isThinking ?
          <FullButton text='답변하기' onClick={handleAnswerMode} disabled/> :
        isAnswering ?
          <FullButton
            text='답변완료'
            onClick={() => {
              if (!isMicActive && currentQuestionIndex === 0) {
                alert('마이크가 연결되지 않았습니다.')
              } else {
                stopRecording()
                handleAnswerComplete()
              }
            }} disabled/> :
        currentQuestionIndex === 0 ? 
          <FullButton text='시작하기' onClick={handleThinkingMode} disabled/> :
        currentQuestionIndex === 8 ?
          <FullButton text='종료하기' onClick={handleAnswerComplete} disabled/> :
          <FullButton text='생각하기' onClick={handleThinkingMode} disabled/>
        }
        </i.button>

        {/* 타이머 표시 */}
        {/* {isAnswering || isThinking ?
        <i.timer>
          {countdown}초
        </i.timer> :
        <div></div>} */}

        <i.menu isHidden={isAnswering}>
          <i.menuSub>
            <div>
              지원 분야
            </div>
            <i.menuText>
              {interveiw?.position}
            </i.menuText>
          </i.menuSub>
          <i.menuSub>
            <div>
              경력 여부
            </div>
            <i.menuText>
              {interveiw?.experience_level === 'entry' ? '신입' : '경력'}
            </i.menuText>
          </i.menuSub>
          <i.menuSub>
            <div>
              진행도
            </div>
          <i.count>
            {
              currentQuestionIndex === 8 ? <div>완료</div> : <div>{currentQuestionIndex} / 7</div>
            }
          </i.count>
          </i.menuSub>
        </i.menu>

          {isThinking ?
          <i.barTimerWrap>
            <i.ProgressBarContainer>
              <i.ProgressBar progress={100 - ThirtyProgress} />
              <i.Character progress={100 - ThirtyProgress} />
            </i.ProgressBarContainer>
            <i.thirtyTimer countdown={ThirtyCountdown}>{ThirtyCountdown}</i.thirtyTimer>
          </i.barTimerWrap> :
          isAnswering ? 
          <i.barTimerWrap>
            <i.ProgressBarContainer>
              <i.ProgressBar progress={100 - SixtyProgress} />
              <i.Character progress={100 - SixtyProgress} />
            </i.ProgressBarContainer>
            <i.sixtyTimer countdown={SixtyCountdown}>{SixtyCountdown}</i.sixtyTimer>
          </i.barTimerWrap> :
          <div></div>
          }




        {/* <div style={{
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
        </div> */}

        {/* <div style={{
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
        </div> */}

        {/* <div style={{
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
        </div> */}

        {/* <img 
          src="src/assets/images/guideline.png" 
          alt="Overlay"
          style={{
            position: 'absolute',
            bottom: 0,
            width: '60vw',
            height: '90vh',
            opacity: 0.2
          }}
        /> */}
      </i.Container>
      <InterviewFooter/>
    </div>
  )
}

export default Interviewing