import * as m from '@/common/Modal/Modal.styled';
import { useState } from 'react';
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

  return (
    <>
      <m.Container>
        <m.BlackBox onClick={onClose} />
        <m.Wrap width={width} height={height}>
            {texts.map((text, index) => (
              <m.TextWrapper key={index}>
                {name === '모의면접' ? 
                  index === 0 || index === 1 ? 
                    <m.BoldText>{text}</m.BoldText> : 
                    <m.SubText>{text}</m.SubText> : 
                name === '등록모달' ? 
                  index !== 3? 
                    <m.BoldText>{text}</m.BoldText> : 
                    <m.SubText>{text}</m.SubText> :
                name === '자기소개서 등록' ? 
                index === 0 ?
                  <m.TitleText>{text}</m.TitleText> : 
                  <div></div> :
                <div></div>
                }
              </m.TextWrapper>
            ))}
          <m.Backdrop>
            <img src="src/assets/images/x.png" alt="" onClick={onClose} style={{ width: '3vh', height: 'auto' }} />
          </m.Backdrop>
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
          <div></div>
          }

        </m.Wrap>
      </m.Container>
    </>
  );
};

export default Index;
