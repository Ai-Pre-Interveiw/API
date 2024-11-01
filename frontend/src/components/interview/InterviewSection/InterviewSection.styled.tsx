import { colors } from '@/styles/theme'
import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 5%;
  padding-right: 10%;
  width: 100%;
  height: 77vh;
  justify-content: space-between;
  align-items: center;
  row-gap: 5%;
`

export const WrapButton = styled.div`
  display: flex;
`

// 애니메이션 정의
const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9); /* 처음에 약간 작은 상태로 시작 */
  }
  to {
    opacity: 1;
    transform: scale(1); /* 원래 크기로 확대 */
  }
`

export const image = styled.div<{ imageUrl: string }>`
  width: 50%;
  height: 90%;
  background-image: url(${(props) => props.imageUrl}); /* 이미지 경로 설정 */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: ${fadeInScale} 0.8s ease-out; /* 애니메이션 적용 */
  position: relative;
  margin-top: 1%;
`

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  height: 10vh;
  width: 40vw;
  gap: 5vh;
  opacity: 0; /* 초기 상태에서 요소가 보이지 않도록 설정 */
  animation: ${fadeInScale} 0.8s ease-out forwards; /* 애니메이션 적용 후 보이도록 설정 */
  animation-delay: 0.2s; /* 약간의 딜레이 추가 */
`;

export const TextWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 1vh;
  opacity: 0; /* 초기 상태에서 요소가 보이지 않도록 설정 */
  animation: ${fadeInScale} 0.8s ease-out forwards; /* 애니메이션 적용 후 보이도록 설정 */
  animation-delay: 0.4s; /* 텀을 더 크게 설정 */
`;

export const Text1 = styled.div`
  font-size: 5vh;
  font-weight: bold;
  color: ${colors.purple};
`;

export const Text2 = styled.div`
  font-size: 3.5vh;
  font-weight: bold;
`;

export const Text3 = styled.div`
  font-size: 4vh;
  font-weight: bold;
`;

export const TextWrapper3 = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 10vh;
  animation: ${fadeInScale} 0.8s ease-out;
`

// 작은 이미지 스타일
// export const SmallImageUpLeft = styled.div`
//   width: 15vh; /* 작은 이미지 크기 */
//   height: 15vh;
//   background-image: url('src/assets/images/pop1.png'); /* 작은 이미지 경로 설정 */
//   background-size: contain;
//   background-position: center;
//   background-repeat: no-repeat;
//   position: absolute;
//   animation: ${bounceUpLeft} 1s ease-in-out infinite; /* 통통 튀는 애니메이션 적용 */

//   /* 각각의 위치 설정 (예시) */
//   &:nth-child(1) {
//     top: -20%;
//     left: 5%;
//     animation-delay: 0s; /* 각 이미지의 애니메이션 딜레이 */
//   }
// `

// export const SmallImageUpRight = styled.div`
//   width: 15vh; /* 작은 이미지 크기 */
//   height: 15vh;
//   background-image: url('src/assets/images/pop2.png'); /* 작은 이미지 경로 설정 */
//   background-size: contain;
//   background-position: center;
//   background-repeat: no-repeat;
//   position: absolute;
//   animation: ${bounceUpRight} 1s ease-in-out infinite; /* 통통 튀는 애니메이션 적용 */

//   /* 각각의 위치 설정 (예시) */
//   &:nth-child(2) {
//     top: -10%;
//     right: -20%;
//     animation-delay: 0.2s; /* 각 이미지의 애니메이션 딜레이 */
//   }
// `

// 작은 이미지 스타일
// export const SmallImageDown = styled.div`
//   width: 50px; /* 작은 이미지 크기 */
//   height: 50px;
//   background-image: url('src/assets/images/pop2.png'); /* 작은 이미지 경로 설정 */
//   background-size: contain;
//   background-position: center;
//   background-repeat: no-repeat;
//   position: absolute;
//   animation: ${bounceDown} 1s ease-in-out infinite; /* 통통 튀는 애니메이션 적용 */

//   /* 각각의 위치 설정 (예시) */
//   &:nth-child(1) {
//     top: 10%;
//     left: 0;
//     animation-delay: 0s; /* 각 이미지의 애니메이션 딜레이 */
//   }
// `




















export const Desc = styled.div`
  color: ${colors.blue01};
  font-size: 2em;
  font-weight: 600;
`

export const SubDesc = styled.div`
  color: ${colors.gray04};
`

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.yellow01};
  color: #3d1d1c;
  font-weight: 700;
  font-size: 0.9em;
  width: 100%;
  height: 49px;
  border-radius: 5px;
  margin-bottom: 50%;

  img {
    width: 17px;
    height: 16px;
    margin-right: 9px;
  }
`