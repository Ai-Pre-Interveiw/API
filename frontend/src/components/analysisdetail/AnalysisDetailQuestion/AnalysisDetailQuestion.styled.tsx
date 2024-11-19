import styled from 'styled-components';
import { colors } from '@styles/theme'
import { lighten } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 335vh;
  padding-left: 1%;
  padding-right: 1%;
  overflow: hidden;
  // justify-content: center;
  // align-items: center;
  // row-gap: 5%;
`

export const question = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5vh;
  font-weight: bold;
  padding: 1.2vh;
  margin-top: 3vh;
  // background-color: yellow;
`

export const titleText = styled.div`
  // background-color: yellow;
  font-size: 2.5vh;
  font-weight: bold;
  padding: 1.2vh;
  margin-top: 3vh;
`

export const videoGraphWrap = styled.div`
  // background-color: blue;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1.2vh;
`

// 스타일 정의
export const video = styled.video`
  width: 37vw;
  height: 47.5vh;
  border-radius: 10px; // 둥근 모서리 추가
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); // 그림자 효과
  border: 2px solid #ccc; // 테두리 추가

  &:hover {
    border-color: #888; // 호버 시 테두리 색상 변경
    transition: all 0.3s ease; // 부드러운 전환 효과
  }

  &:focus {
    outline: none; // 클릭 시 외곽선 제거
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.4); // 클릭 시 그림자 강조
  }
`;

export const nervousGraph = styled.div<{ imageUrl: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 30px;
  // width: 10vw;
  height: 47vh;
  width: 50vw;
  background-image: url(${(props) => props.imageUrl}); /* 이미지 경로 설정 */
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;
`

export const summaryWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7vh;
`

export const summary = styled.div`
  font-size: 2.2vh;
  font-weight: bold;
`

export const script = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  height: 50vh;
  border-radius: 30px;
  padding: 2vh;
  margin-bottom: 1.2vh;
`

export const ToggleButton = styled.div`
  margin-top: 2vh;
  cursor: pointer;
  font-size: 2.2vh;
  font-weight: bold;
  width: 30vw;
  transition: transform 0.05s ease; // 부드러운 전환 효과 추가

  &:hover {
    transform: scale(1.01) // 호버 시 크기 증가
  }
`;

export const Content = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  width: 100%;
  padding: ${({ isOpen }) => (isOpen ? '10px' : '0')};
  background-color: #fafafa;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  margin-top: 1vh;
  margin-bottom: 2vh;
`;

export const ContentText = styled.p`
  margin: 0;
  padding: 0 10px;
  color: #333;
  line-height: 1.6;
`;

export const grapBigWrap = styled.div`
  display: flex;
  flex-direction: row;
  item-align: center;
  justify-content: space-between;
  width: 100%;
  // background-color: blue;
  padding: 1.2vh;
  margin-top: 3vh;
`

export const graphWrap = styled.div`
  // background-color: yellow;
  width: 40vw;
  height: 80vh;
`

export const graphTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  // background-color: blue;
  padding: 1.5vh;
  font-weight: bold;
  font-size: 2.3vh;
`

export const graph = styled.div<{ imageUrl: string }>`
  background-color: white;
  margin: 2vh;
  height: 60vh;
  background-image: url(${(props) => props.imageUrl}); /* 이미지 경로 설정 */
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 10px;
`

export const graphSummaryWrap = styled.div`
  margin-left: 1vw;
  display: flex;
  flex-direction: column;
  gap: 0.7vh;
`