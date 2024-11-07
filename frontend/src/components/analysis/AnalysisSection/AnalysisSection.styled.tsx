import styled from 'styled-components';
import { colors } from '@styles/theme'
import { lighten } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85vh;
  padding-left: 1%;
  padding-right: 1%;
  overflow: hidden;
  // justify-content: center;
  // align-items: center;
  // row-gap: 5%;
`

export const Title = styled.div`
  font-weight: bold;
  font-size: 4.5vh;
  margin-top: 5vh;
  margin-left: 3vh;
`

export const Summary = styled.div`
  display: flex;
  flex-direction: rows;
  align-items: center;
  padding: 3vh;
  margin: 3vh;
  background-color: ${lighten(0.35, colors.purple)};
  border-radius: 20px;
`

export const SummaryNum = styled.div`
  font-size: 4vh;
  font-weight: bold;
  color: ${colors.purple}
`

export const SummaryText = styled.div`
  font-size: 3vh;
  font-weight: bold;
`

export const Menu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2vh;
  border-bottom: 1px solid;
  font-weight: bold;
  width: 95%;
  margin-left: 5vh;
  font-size: 2.5vh;
`

export const Menu1 = styled.div`
  margin-left: 0.1vw;
`

export const Menu2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 23vw;
  margin-right: 3vw;
`
export const WrapContent = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const Not = styled.p`
  font-size: 4vh;
  margin-bottom: 5vh;
  font-weight: bold;
`

export const SubMenu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2vh;
  padding-left: 1vw;
  padding-right: 3vw;
  padding-bottom: 2vh;
  font-weight: bold;
  border-bottom: 1px solid;
  top: 0; /* 스크롤 시 화면 상단에 고정 */
  z-index: 10; /* 다른 요소보다 앞에 오도록 */
`

export const WrapTimeCheck = styled.div`
  display: flex;
  flex-direction: row;
  width: 20vw;
  align-items: center;
  justify-content: space-between;
`

// 전체 리스트 컨테이너 스타일
export const AnalysisList = styled.div`
  font-size: 2.5vh;
  overflow-y: auto; /* 스크롤 가능하게 설정 */
  &::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 오페라, 엣지 */
    width: 0; /* Remove scrollbar space */
    height: 0;
    background: transparent; /* Optional: just make scrollbar invisible */
    -webkit-appearance: none;
  }
`;

// 각 리스트 항목의 스타일
export const AnlaysisItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  height: 16vh;
  padding-left: 1vw;
  padding-right: 1.2vw;
  border-bottom: 1px solid;
  margin-left: 5vh;
`;

export const AnalysisItemTimeButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 28.8vw;
  margin-right: 2.2vh;
`

export const RegisterButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 16vh;
  border-bottom: 1px solid;
`;