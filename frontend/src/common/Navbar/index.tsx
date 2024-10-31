import { useState } from 'react';
import FullButton from '@common/Fullbutton/index';
import * as n from '@common/Navbar/Navbar.styled';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '@stores/user';
import Modal from '@/common/Modal/index';

const Index = (props: { current: string }) => {
  const { current } = props;
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false); // 첫 번째 모달 상태
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false); // 두 번째 모달 상태

  const NoLoginClick = () => {
    if (user.memberNo === -1) alert('로그인 후 이용해주세요.');
  };

  const goHome = () => {
    navigate('/');
  };

  const goMyPage = () => {
    navigate('/mypage');
  };

  const goAnalysisPage = () => {
    navigate('/analysis');
  };

  const handleFirstModalOpen = () => {
    setIsFirstModalOpen(true); // 첫 번째 모달 열기
  };

  const handleFirstModalClose = () => {
    setIsFirstModalOpen(false); // 첫 번째 모달 닫기
  };

  const handleSecondModalOpen = () => {
    setIsSecondModalOpen(true); // 두 번째 모달 열기
  };

  const handleSecondModalClose = () => {
    setIsSecondModalOpen(false); // 두 번째 모달 닫기
  };

  return (
    <n.Container>
      <n.Wrap>
        <n.image onClick={goHome}>
          <img src="src/assets/images/api_logo_web.png" alt="..." style={{ width: '13vh', height: 'auto' }} />
        </n.image>
        {user.memberNo === -1 ? (
          <n.ButtonWrap>
            <FullButton text="모의 면접" onClick={NoLoginClick} disabled />
            <FullButton text="분석 결과" onClick={NoLoginClick} disabled />
          </n.ButtonWrap>
        ) : (
          <n.LoginButtonWrap>
            <FullButton text="모의 면접" onClick={handleFirstModalOpen} disabled/> {/* 첫 번째 모달 열기 */}
            <FullButton text="분석 결과" onClick={goAnalysisPage} disabled/>
            <n.MentImageWrap>
              <n.UserInfoWrap>
                <p>{user.nickname} 님</p>
                <p>환영합니다!</p>
              </n.UserInfoWrap>
              <n.ProfileButton onClick={goMyPage}>
                <img src={user.imageUrl} alt="" />
              </n.ProfileButton>
            </n.MentImageWrap>
          </n.LoginButtonWrap>
        )}
      </n.Wrap>

      {/* 첫 번째 모달 */}
      {isFirstModalOpen && (
        <Modal
          name="모의면접"
          onClose={handleFirstModalClose}
          openSecondModal={handleSecondModalOpen} // 두 번째 모달 열기 함수 전달
          texts={[
            '모의면접을',
            '시작 하시겠습니까?',
            '시작하기 버튼을 누르면 준비페이지로 넘어갑니다.'
          ]}
          width="40%"
          height="35%"
        />
      )}

      {/* 두 번째 모달 */}
      {isSecondModalOpen && (
        <Modal
          name="등록모달"
          onClose={handleSecondModalClose}
          openSecondModal={() => {}}
          texts={[
            '등록된 자기소개서가 없습니다.',
            '내정보 페이지에서',
            '자기소개서를 등록해주세요.',
            '등록하기 버튼을 누르면 내정보 페이지로 이동합니다.',
          ]}
          width="40%"
          height="40%"
        />
      )}
    </n.Container>
  );
};

export default Index;
