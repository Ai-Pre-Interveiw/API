import { colors } from '@/styles/theme'
import styled, { keyframes } from 'styled-components'
import Webcam from 'react-webcam';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 5%;
  padding-right: 5%;
  width: 100%;
  height: 77vh;
  justify-content: center;
  align-items: center;
  row-gap: 5%;
`

export const videoWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 45vw;  /* 원하는 너비 */
  height: 60vh; /* 원하는 높이 */
  border-radius: 30px; /* 둥글게 만듦 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* 그림자 추가로 입체감 부여 */
`;

export const styledWebcam = styled(Webcam)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 30px; /* 웹캠 화면도 둥글게 */
`;

// 애니메이션 키프레임 정의
const slideUpAndFade = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px);
    opacity: 0;
  }
`;

// 애니메이션이 적용된 컨테이너 스타일 정의
export const AnimatedDiv = styled.div<{ isHidden: boolean }>`
  position: absolute;
  top: 2.5vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  background-color: white;
  border-radius: 30px;
  font-weight: bold;
  font-size: 3vh;
  width: 69.6vw;
  right: 15vw;
  z-index: 103;
  padding: 1%;
  animation: ${({ isHidden }) => (isHidden ? slideUpAndFade : 'none')} 0.5s ease-in-out;
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  transition: opacity 0.5s;
`;