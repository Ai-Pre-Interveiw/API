import * as m from '@/common/Modal/Modal.styled';
import { useState, useEffect } from 'react';
import { ModalType } from '@/types/commonType';
import FullButton from '@common/Fullbutton/index';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '@stores/user';

const Index = (props: ModalType & { openSecondModal: () => void }) => {  // 두 번째 모달 열기 함수 추가
  const { width, height, name, texts, onClose, openSecondModal } = props;
  const user = useRecoilValue(userState);
  const setUserState = useSetRecoilState(userState);
  const navigate = useNavigate();

  const goMyPageOrStart = () => {
    if (user.resume.length !== 0) {
      navigate('/interview');
    } else {
      onClose(); // 첫 번째 모달 닫기
      openSecondModal(); // 두 번째 모달 열기
    }
  };

  const goMyPage = () => {
    onClose();
    navigate('/mypage');
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null); // 파일 선택 시 상태 업데이트
  };

  const handleUpload = () => {
    if (selectedFile) {
      const filePath = `src/data/resume/${selectedFile.name}`; // 파일 경로를 지정
  
      // 한국 시간대로 포맷된 업로드 시간 생성
      const uploadTime = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // 12시간제 형식 사용
      }).format(new Date());
  
      // 현재 userState에서 resume 배열 업데이트
      setUserState((prevState) => ({
        ...prevState,
        resume: [...prevState.resume, { filePath, uploadTime }] // resume 배열에 경로와 시간 추가
      }));
  
      console.log('파일 업로드:', selectedFile);
      console.log(user);
      onClose(); // 업로드 후 모달 닫기
    } else {
      alert('파일을 선택해 주세요.');
    }
  };

  // 타이머 상태 설정
  const [countdown, setCountdown] = useState(30);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  // 5초 타이머 자동 시작
  useEffect(() => {
    if (name.includes('생각')) {
      setCountdown(30); // 타이머를 5초로 초기화
      setIsCountdownActive(true); // 타이머 시작
    }
  }, [name]);

  // 타이머 카운트다운 로직
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null; // 초기값을 null로 설정
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      if (timer) clearInterval(timer); // timer가 할당된 경우에만 clearInterval 호출
      setIsCountdownActive(false); // 타이머 종료
      onClose();
    }
    return () => {
      if (timer) clearInterval(timer); // cleanup 시에도 동일하게 체크
    };
  }, [isCountdownActive, countdown]);

  return (
    <>
    <m.BlackBox onClick={onClose} />
      <m.Container>
        <m.Wrap width={width} height={height}>
          {name === '모의면접' ?
            <m.TextWrapper>
              <m.BoldText>{texts[0]}</m.BoldText>
              <m.BoldText>{texts[1]}</m.BoldText>
              <m.SubText>{texts[2]}</m.SubText> 
            </m.TextWrapper> :
          name === '등록모달' ? 
            <m.TextWrapper>
              <m.BoldText>{texts[0]}</m.BoldText>
              <m.BoldText>{texts[1]}</m.BoldText>
              <m.BoldText>{texts[2]}</m.BoldText>
              <m.SubText>{texts[3]}</m.SubText>
            </m.TextWrapper> :
          name === '자기소개서 등록' ? 
            <m.TitleText>{texts[0]}</m.TitleText> : 
          name === '질문 시작1' ?
            <m.InterviewTextWrap>
              <m.InterviewTextSubWrap>
                <m.InterviewText> {texts[0]}</m.InterviewText>
                <m.InterviewText> {texts[1]}</m.InterviewText>
                <m.InterviewText> {texts[2]}</m.InterviewText>
              </m.InterviewTextSubWrap>
              <m.InterviewText> {texts[3]}</m.InterviewText>
            </m.InterviewTextWrap> :
          name === '질문 시작2 0' ?
            <m.InterviewTextWrap>
              <m.InterviewTextSubWrap>
                <m.InterviewText> {texts[0]}</m.InterviewText>
                <m.InterviewText> {texts[1]}</m.InterviewText>
              </m.InterviewTextSubWrap>
              <m.InterviewTextSubWrap>
                <m.InterviewText> {texts[2]}</m.InterviewText>
                <m.InterviewText> {texts[3]}</m.InterviewText>
                <m.InterviewText> {texts[4]}</m.InterviewText>
              </m.InterviewTextSubWrap>
              <m.InterviewText> {texts[5]}</m.InterviewText>
            </m.InterviewTextWrap> :
          name.includes('생각') ?
            <m.ThinkButtonWrap>
              <FullButton text={`${countdown}초 남음`} onClick={() => {}} disabled={countdown === 0} />
              <FullButton text="답변하기" onClick={onClose} disabled/>
            </m.ThinkButtonWrap> :
          name.includes('진행') ?
            <m.FinishContent>
              <m.InterviewText> {texts[1]}</m.InterviewText>
              <m.InterviewText> {texts[2]}</m.InterviewText>
            </m.FinishContent> :
          <div></div>
          }
          {!name.includes('질문') && (
            <m.Backdrop>
              <img src="/images/x.png" alt="" onClick={onClose} style={{ width: '3vh', height: 'auto' }} />
            </m.Backdrop>
          )}
          {name === '자기소개서 등록' ? (
            <m.FileInputWrapper>
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.docs,.hwp"
                onChange={handleFileChange}
                hidden
              />
              <label htmlFor="file-upload" className="custom-file-upload">
                {selectedFile ? selectedFile.name : texts[1]}
              </label>
            </m.FileInputWrapper>
          ) : <div></div>}
          {name === '모의면접' ?           
            <m.ButtonWrap>
              <FullButton text="뒤로가기" onClick={onClose} disabled/>
              <FullButton text="시작하기" onClick={goMyPageOrStart} disabled/>
            </m.ButtonWrap> :
          name === '등록모달' ?
            <m.ButtonWrap>
              <FullButton text="뒤로가기" onClick={onClose} disabled/>
              <FullButton text="등록하기" onClick={goMyPage} disabled/>
            </m.ButtonWrap> :
          name === '자기소개서 등록' ?
            <m.ButtonWrap>
              <FullButton text="뒤로가기" onClick={onClose} disabled/>
              <FullButton text="등록하기" onClick={handleUpload} disabled/>
            </m.ButtonWrap> :
          name === '질문 시작1' ?
            <m.InterviewButtonWrap>
              <FullButton text="시작하기" onClick={onClose} disabled/>
            </m.InterviewButtonWrap> :
          name.includes('0') ?
            <m.InterviewButtonWrap>
              <FullButton text="생각하기" onClick={() => {
                onClose();
                openSecondModal();
              }} disabled/>
            </m.InterviewButtonWrap> :
          name === '질문 진행 4' ?
          <m.InterviewButtonWrap>
            <FullButton text="종료하기" onClick={() => {
              onClose();
            }} disabled/>
          </m.InterviewButtonWrap> :
          <div></div>
          }

        </m.Wrap>
      </m.Container>
    </>
  );
};

export default Index;
