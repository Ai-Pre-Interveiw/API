import { colors } from '@/styles/theme'
import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85vh;
  padding-left: 1%;
  padding-right: 1%;
  // justify-content: space-between;
  // align-items: center;
  // row-gap: 5%;
`

export const Menu = styled.button<{ selected: boolean }>`
  font-size: 3.5vh;
  padding: 1%;
  border: none;
  background: none;
  // color: ${({ selected }) => (selected ? colors.purple : 'inherit')}; /* 선택된 경우 글씨 색상을 보라색으로 */
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')}; /* 선택된 경우 글씨를 bold로 */
  position: relative;
  transition: all 0.1s ease; /* 부드러운 전환 효과 */


  &:hover { /* hover 시 글씨를 bold로 */
    font-weight: bold;
  }

  /* selected 상태에서만 안쪽 보더를 표시하는 ::after 가상 요소 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0; /* 버튼 아래쪽에 위치 */
    left: 1%; /* 좌우 간격을 약간 좁혀서 내부에 보더를 주는 효과 */
    right: 2%;
    height: 0.7vh; /* 보더의 높이 */
    background-color: ${({ selected }) => (selected ? colors.purple : 'transparent')}; /* 선택된 경우 보라색으로 */
    border-radius: 5px 5px 0 0; /* 테두리를 둥글게 */
  }
`;

export const WrapMenu = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2%;
  border-bottom: 1px solid #ccc;
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

// 통통 튀는 애니메이션 정의
const bounceUpLeft = keyframes`
  0%, 100% {
    transform: translate(0, 0); /* 처음과 끝 위치 */
  }
  50% {
    transform: translate(-5px, -15px); /* 왼쪽 위 대각선으로 튀어오르기 */
  }
`

const bounceUpRight = keyframes`
  0%, 100% {
    transform: translate(0, 0); /* 처음과 끝 위치 */
  }
  50% {
    transform: translate(5px, -15px); /* 왼쪽 위 대각선으로 튀어오르기 */
  }
`


export const image = styled.div`
  width: 30%; /* 필요한 너비와 높이 설정 */
  height: 60%;
  background-image: url('src/assets/images/login.png'); /* 이미지 경로 설정 */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: ${fadeInScale} 0.8s ease-out; /* 애니메이션 적용 */
  position: relative;
`

// 작은 이미지 스타일
export const SmallImageUpLeft = styled.div`
  width: 15vh; /* 작은 이미지 크기 */
  height: 15vh;
  background-image: url('src/assets/images/pop1.png'); /* 작은 이미지 경로 설정 */
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  animation: ${bounceUpLeft} 1s ease-in-out infinite; /* 통통 튀는 애니메이션 적용 */

  /* 각각의 위치 설정 (예시) */
  &:nth-child(1) {
    top: -20%;
    left: 5%;
    animation-delay: 0s; /* 각 이미지의 애니메이션 딜레이 */
  }
`

export const SmallImageUpRight = styled.div`
  width: 15vh; /* 작은 이미지 크기 */
  height: 15vh;
  background-image: url('src/assets/images/pop2.png'); /* 작은 이미지 경로 설정 */
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  animation: ${bounceUpRight} 1s ease-in-out infinite; /* 통통 튀는 애니메이션 적용 */

  /* 각각의 위치 설정 (예시) */
  &:nth-child(2) {
    top: -10%;
    right: -20%;
    animation-delay: 0.2s; /* 각 이미지의 애니메이션 딜레이 */
  }
`

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