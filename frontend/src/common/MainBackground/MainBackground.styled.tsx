import { styled, keyframes } from 'styled-components'
import { colors } from '@/styles/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 70vh;
  height: 75vh;
  justify-content: center;
  align-items: center;
  row-gap: 5%;
  border-radius: 50px;
  box-shadow: 6px 4px 18px 3px rgba(0, 0, 0, 0.1);
  position: relative; /* 고정 요소 위치 설정을 위해 relative 추가 */
`;

// 애니메이션 정의
const fadeSlideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeSlideOut = keyframes`
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-20px);
  }
`;

// Slide 스타일 정의
export const Slide = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  animation: ${({ isActive }) => (isActive ? fadeSlideIn : fadeSlideOut)} 1s ease-in-out;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
`;

export const Image = styled.img`
  width: 70%;
  height: auto;
  object-fit: cover;
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5vh; /* Text1과 Text2 간격 조절 */
`;

export const TextWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
`

export const Text1 = styled.p`
  font-size: 1.6rem;
  font-weight: bold;
  color: ${colors.purple};
`;

export const Text2 = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;