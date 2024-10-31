import { colors } from '@/styles/theme'
import styled from 'styled-components'

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12vh;
  background-color: ${colors.purple};
  color: #fff;
  height: 5vh;
  border-radius: 30px;
  font-size: 1.8vh;
`