import { colors } from '@/styles/theme';
import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12vh;
  background-color: ${colors.purple}; /* 기본 배경색 */
  color: #fff; /* 기본 글씨 색 */
  height: 5vh;
  border-radius: 30px;
  font-size: 2vh;
  border: none; /* 기본 상태에서는 테두리 없음 */
  transition: background-color 0.3s, color 0.3s, font-weight 0.3s, border 0.3s; /* 전환 효과 추가 */

  /* hover 시 스타일 변경 */
  &:hover {
    background-color: #fff; /* hover 시 배경색 */
    color: ${colors.purple}; /* hover 시 글씨 색 */
    font-weight: bold; /* hover 시 bold 적용 */
    border: 2px solid ${colors.purple}; /* hover 시 보라색 테두리 추가 */
  }
`;

export const textWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.1vw;
`
