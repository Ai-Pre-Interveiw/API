import { Link } from 'react-router-dom'
import { colors } from '@styles/theme'
import styled from 'styled-components'

export const Container = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  padding: 1%;
  box-shadow: 6px 4px 18px 3px rgba(0.1, 0.1, 0.1, 0.1);
  }
`

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 9px;
`

export const ButtonWrap = styled.div`
  display:flex;
  width: 25vh;
  justify-content: space-between;
`

export const LoginButtonWrap = styled.div`
  display:flex;
  width: 45vh;
  justify-content: space-between;

  p {
    font-size: 1.5vh;
    margin: 4% 0; /* p 태그 위아래 간격 설정 */
  }
`

export const MentImageWrap = styled.div`
  display:flex;
  flex-direction: row;
  width: 15.8vh;

  button {
    margin-left: 5%;
  }
`

export const UserInfoWrap = styled.div`
  display:flex;
  flex-direction: column;
  align-items: end;
  justify-content: center;
`

export const ProfileButton = styled.button`
  width: 5vh;
  height: auto;
  transition: transform 0.3s ease; /* 부드러운 크기 전환 효과 */

  &:hover {
    transform: scale(1.1); /* 마우스 올렸을 때 약간 확대 */
  }

  img {
    width: 100%;
    height: auto;
  }
`;

export const image = styled.button`
  display:flex;
  transition: transform 0.3s ease;
  
  &:hover {
  transform: scale(1.1); /* 마우스 올렸을 때 약간 확대 */
  }
`

export const Item = styled(Link)`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const Icon = styled.img``

export const Label = styled.div<{ $active: boolean }>`
  font-size: 0.7em;
  font-weight: 700;
  margin-top: 6px;
  color: ${props => (props.$active ? colors.blue01 : colors.gray04)};
`