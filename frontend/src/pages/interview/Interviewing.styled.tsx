import { colors } from '@/styles/theme'
import styled, { css, keyframes } from 'styled-components'
import Webcam from 'react-webcam';
import { lighten } from 'polished';

export const Container = styled.div<{ isStart: boolean }>`
  display: flex;
  flex-direction: row;
  padding-left: 5%;
  padding-right: 5%;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  row-gap: 5%;
  background-color: ${({ isStart }) => (isStart ? lighten(0.35, colors.purple) : 'none')};
  transition: background-color 2s ease; /* 배경색 변경 시 0.5초 동안 부드럽게 전환 */
`;

// export const videoWrap = styled.div`
//   margin-top: 25vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   overflow: hidden;
//   width: 45vw;  /* 원하는 너비 */
//   height: 60vh; /* 원하는 높이 */
//   border-radius: 30px; /* 둥글게 만듦 */
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* 그림자 추가로 입체감 부여 */
// `;

// 애니메이션 키프레임 정의
export const shrinkAndMove = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(42vw, 18vh) scale(0.3); /* 원하는 크기와 위치로 설정 */
  }
`;

export const expandAndMoveBack = keyframes`
  0% {
    transform: translate(42vw, 18vh) scale(0.3);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
`;

// i.videoWrap 스타일 정의
export const videoWrap = styled.div<{ isMinimized: boolean }>`
  position: absolute;
  top: 20vh;
  transition: transform 0.5s ease, opacity 0.5s ease;

  ${({ isMinimized }) =>
    isMinimized
      ? css`
          animation: ${shrinkAndMove} 0.5s forwards;
        `
      : css`
          animation: ${expandAndMoveBack} 0.5s forwards;
        `}
`;

// i.styledWebcam는 기존 스타일 유지
export const styledWebcam = styled(Webcam)`
  top: 1vh;
  width: 45vw;
  height: 60vh;
  object-fit: cover;
  border-radius: 30px; /* 웹캠 화면을 둥글게 */
`;

export const button = styled.div`
  position: absolute;
  right: 4.7vw;
  bottom: 10vh;
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const textWrap1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3vh;
  margin-bottom: 8vh;
  animation: ${fadeIn} 0.8s ease forwards; /* 0.8초 동안 부드럽게 나타남 */
`

export const textWrapAniate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vh;
  
  opacity: 0;
  animation: fadeIn 1s ease-in forwards;
  animation-delay: 2s;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`

export const textWrapAniate2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vh;
  
  opacity: 0;
  animation: fadeIn 1s ease-in forwards;
  animation-delay: 4s;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`

export const textWrapRow = styled.div`
  display: flex;
  flex-direction: row;
`

export const textWrap2 = styled.div`
  font-size: 4vh;
  font-weight: bold;
`

export const textWrap3 = styled.div`
  font-size: 4vh;
  font-weight: bold;
  color: ${colors.purple};
  margin-left: 0.5vw;
  margin-right: 0.5vw;
`

export const questionWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50vw;
  position: absolute;
  font-size: 3vh;
  font-weight: bold;
  top: 5vh;
  padding: 2vh;
  border-radius: 30px;
  background-color: ${lighten(0.35, colors.purple)};
  animation: ${fadeIn} 0.8s ease forwards;
`

// 흔들리는 애니메이션 정의
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-3px); }
  40%, 80% { transform: translateX(3px); }
`;

export const thirtyTimer = styled.div<{ countdown: number }>`
  font-weight: bold;

  color: ${({ countdown }) => (countdown <= 5 ? 'red' : 'black')};
  ${({ countdown }) =>
    countdown <= 5 &&
    css`
      animation: ${shake} 0.2s infinite;
    `}
`

export const sixtyTimer = styled.div<{ countdown: number }>`
  font-weight: bold;
  
  color: ${({ countdown }) => (countdown <= 10 ? 'red' : 'black')};
  ${({ countdown }) =>
    countdown <= 10 &&
    css`
      animation: ${shake} 0.2s infinite;
    `}
`

export const count = styled.div`
  font-size: 2.5vh;
  font-weight: bold;
  margin-top: 0.5vh;
`

// 애니메이션 키프레임 정의
const slideUpAndFade = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-200px);
    opacity: 0;
  }
`;

// 슬라이드 다운 및 페이드 인 애니메이션 (나타날 때)
const slideDownAndFadeIn = keyframes`
  from {
    transform: translateY(-200px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const menu = styled.div<{ isHidden: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  padding: 3vh;
  border-radius: 30px;
  border: 2px solid ${colors.purple};
  position: absolute;
  right: 1.2vw;
  top: 2vh;
  width: 15vw;
  height: 25vh;
  gap: 2vh;
  box-shadow: 0px 4px 8px rgba(0, 0, 1, 0.5); // 그림자 효과
  animation: ${({ isHidden }) =>
    isHidden
      ? css`
          ${slideUpAndFade} 0.5s ease-in-out forwards;
        `
      : css`
          ${slideDownAndFadeIn} 0.5s ease-in-out forwards;
        `};
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
`

export const menuSub = styled.div`
  flex-direction: column;
  font-weight: bold;
`

export const menuText = styled.div`
  margin-top: 0.5vh;
  font-size: 2.5vh;
  font-weight: bold;
`

export const ProgressBarContainer = styled.div`
  width: 40vw;
  height: 10px;
  border-radius: 50px;
  background-color: #e0e0e0; /* 바탕색 */
`;

export const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  border-radius: 50px;
  width: ${({ progress }) => progress}%;
  background-color: ${colors.purple}; /* 진행 색상 */
  transition: width 1s linear; /* 부드러운 진행 효과 */
`;

export const barTimerWrap = styled.div`
  position: absolute;
  bottom: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1vw;
  // background-color: yellow;
`


// 캐릭터 스타일
export const Character = styled.div<{ progress: number }>`
  position: absolute;
  top: -5.8vh; // 진행 바 위에 위치하도록 조정
  left: ${({ progress }) => progress - 15}%; // 진행도에 따라 위치 조정
  width: 8vw; // 캐릭터 크기
  height: 8vh;
  background-image: url('/images/bar.png'); // 캐릭터 이미지 경로
  background-size: contain;
  background-repeat: no-repeat;
  transition: left 1s linear; // 부드럽게 이동
  transform: scaleX(-1);
`;