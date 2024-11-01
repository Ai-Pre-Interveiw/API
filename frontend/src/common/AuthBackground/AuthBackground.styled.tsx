import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 70vh;
  height: 70vh;
  justify-content: center;
  align-items: center;
  row-gap: 5%;
  border-radius: 50px;
  box-shadow: 6px 4px 18px 3px rgba(0, 0, 0, 0.1);
  position: relative; /* 고정 요소 위치 설정을 위해 relative 추가 */
`;

export const Title = styled.h1`
  font-size: 3.5vh; /* 글씨 크기 조절 */
  font-weight: bold;
  position: absolute;
  top: 5vh; /* 위에 고정시키기 위해 top 설정 */
  text-align: center;
  width: 100%;
`;

export const WrapButton = styled.div`
  display: flex;
  width: 60%;
  justify-content: space-between;
  position: absolute;
  bottom: 5vh;
`

export const loginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  height: 30%;
`

export const signupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  height: 60%;
`

export const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

export const Label = styled.label`
  font-size: 2vh;
  margin-bottom: 5px;
  display: block;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 8px;
  border: none; /* 전체 테두리 제거 */
  border-bottom: 1px solid #ddd; /* 아래쪽에만 테두리 추가 */
  box-sizing: border-box;
  font-size: 2.1vh;
  height: 80%;
`;

export const HintText = styled.p`
  font-size: 1.5vh; /* 작은 폰트 크기 */
  color: #888; /* 옅은 색상 */
  margin: 0;
  padding: 0;
  text-align: center;
`;

// 새로운 스타일: Hint와 회원가입 버튼을 정렬
export const HintButtonWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center; /* 세로 가운데 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */
  gap: 1vh; /* HintText와 버튼 사이 간격 */
`;

export const GuideText = styled.p`
  font-size: 2vh;
`

/* ment_group */

// position: absolute;
// width: 717px;
// height: 883px;
// left: 934px;
// top: 178px;
// box-shadow: 6px 4px 18px 3px rgba(0.1, 0.1, 0.1, 0.1);
// filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
