import * as m from '@/common/Modal/Modal.styled';
import { ModalType } from '@/types/commonType';
import FullButton from '@common/Fullbutton/index';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '@stores/user';

const Index = (props: ModalType & { openSecondModal: () => void }) => {  // 두 번째 모달 열기 함수 추가
  const { width, height, name, texts, onClose, openSecondModal } = props;
  const user = useRecoilValue(userState);
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
    navigate('/mypage')
  }

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
                <div></div>
                }
              </m.TextWrapper>
            ))}
          <m.Backdrop>
            <img src="src/assets/images/x.png" alt="" onClick={onClose} style={{ width: '3vh', height: 'auto' }} />
          </m.Backdrop>
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
          <div></div>
          }

        </m.Wrap>
      </m.Container>
    </>
  );
};

export default Index;
