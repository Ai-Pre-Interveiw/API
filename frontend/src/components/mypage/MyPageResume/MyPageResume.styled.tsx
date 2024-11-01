import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85vh;
  padding-left: 1%;
  padding-right: 1%;
  overflow: hidden;
  // justify-content: space-between;
  // align-items: center;
  // row-gap: 5%;
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
export const ResumeList = styled.div`
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
export const ResumeItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 16vh;
  padding-left: 1vw;
  padding-right: 1.2vw;
  border-bottom: 1px solid;
`;

export const ResumeItemName = styled.div`
  font-weight: bold;
`

export const ResumeItemTimeButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 26vw;
`

export const RegisterButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 16vh;
  border-bottom: 1px solid;
`;