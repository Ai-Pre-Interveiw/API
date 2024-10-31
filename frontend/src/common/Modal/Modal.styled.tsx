import { colors } from '@styles/theme'
import styled from 'styled-components'

export const BlackBox = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.3;
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

export const Wrap = styled.div<{ width?: string; height?: string }>`
  position: relative;
  z-index: 101;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: 40px;
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
  text-align: center;
  justify-content: center;
`;

export const BoldText = styled.p`
  font-size: 1.5rem; /* 두꺼운 텍스트 크기 */
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1vh;
`;

export const SubText = styled.p`
  font-size: 1rem; /* 작은 텍스트 크기 */
  font-weight: 300;
  color: #666; /* 옅은 색상 */
  margin-top: 3vh;
`;

export const ButtonWrap = styled.div`
  display:flex;
  width: 30vh;
  justify-content: space-between;
  margin-top: 5vh;
`

// export const ModalName = styled.div`
//   display: flex;
//   justify-content: center;
//   padding-block: 1em;
//   border-bottom: 2px solid ${colors.gray02};
//   font-weight: 600;
// `