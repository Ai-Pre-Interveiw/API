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

// export const ModalName = styled.div`
//   display: flex;
//   justify-content: center;
//   padding-block: 1em;
//   border-bottom: 2px solid ${colors.gray02};
//   font-weight: 600;
// `