import { colors } from '@styles/theme'
import styled, { keyframes } from 'styled-components'

export const BlackBox = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
`

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
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

export const Wrap = styled.div<{ width?: string; height?: string }>`
  position: relative;
  z-index: 101;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ width }) => (width === '100%' ? 'transparent' : '#fff')};
  border-radius: ${({ width }) => (width === '100%' ? '0px' : '40px;')};
  padding-top: 7vh;
  width: ${({ width }) => width || '40%'}; /* props로 전달된 width 사용 */
  height: ${({ height }) => height || '50%'}; /* props로 전달된 height 사용 */
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 오페라, 엣지 */
    width: 0; /* Remove scrollbar space */
    height: 0;
    background: transparent; /* Optional: just make scrollbar invisible */
    -webkit-appearance: none;
  }
`

export const Backdrop = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin: 1em;
`

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
`;

export const BoldText = styled.p`
  font-size: 3.5vh; /* 두꺼운 텍스트 크기 */
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1vh;
`;

export const SubText = styled.p`
  font-size: 2.5vh; /* 작은 텍스트 크기 */
  font-weight: 300;
  color: #666; /* 옅은 색상 */
  margin-top: 3vh;
`;

export const TitleText = styled.p`
  font-size: 2.5vh;
  font-weight: bold;
`

export const InterviewText = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 5vh;
  font-weight: bold;
  color: #FFFFFF;
  animation: ${fadeInScale} 1.5s ease-out;
`

export const InterviewTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10vh;
  margin-top: 10vh;
`

export const InterviewTextSubWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3vh;
`

export const InterviewButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;
  opacity: 0;
  animation: ${fadeInScale} 0.8s ease-out forwards;
  animation-delay: 1s;

  /* FullButton 크기 조정 */
  button {
    width: 10vw; /* 버튼 너비 */
    height: 6vh; /* 버튼 높이 */
    font-size: 3vh; /* 버튼 글씨 크기 */
  }
`

export const ButtonWrap = styled.div`
  display:flex;
  width: 30vh;
  justify-content: space-between;
  margin-top: 5vh;
`

export const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;

  .custom-file-upload {
    display: inline-block;
    padding: 8px 12px;
    width: 23vw; /* 고정된 너비 */
    height: 5vh; /* 고정된 높이 */
    cursor: pointer;
    background-color: #fff;
    color: #888;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 2vh;
    text-align: left; /* 텍스트 중앙 정렬 */
    overflow: hidden; /* 텍스트가 넘칠 경우 숨김 */
    white-space: nowrap; /* 텍스트가 한 줄로 유지되도록 설정 */
    text-overflow: ellipsis; /* 텍스트가 길 경우 ... 표시 */
    transition: all 0.3s ease;

    &:hover {
      background-color: #f7f7f7;
      border-color: #888;
    }
  }
`;

export const FileName = styled.span`
  margin-left: 10px;
  font-size: 2vh;
  color: #555;
`;

export const ThinkTextWrap = styled.div`
  display: flex;
  align-items: end;
  height: 100%;
  margin-bottom: 1vh;
`

export const ThinkWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 83vw;
  bottom: 0;
`

export const ThinkButtonWrap = styled.div`
  position: absolute;
  right: 8.5vw;
  bottom: 2vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1vw;
  width: 12vw;
  background-color: white;
  height: 6vh;
  border-radius: 30px;
  font-weight: bold;
  font-size: 3vh;
`

export const ThinkContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 69.7vw;
  // padding: 1%;
  background-color: white;
  border-radius: 30px;
  font-weight: bold;
  font-size: 3vh;
`

export const FinishContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10vh;
  margin-top: 30vh;
  animation: ${fadeInScale} 1.2s ease-out;
`

// export const ModalName = styled.div`
//   display: flex;
//   justify-content: center;
//   padding-block: 1em;
//   border-bottom: 2px solid ${colors.gray02};
//   font-weight: 600;
// `