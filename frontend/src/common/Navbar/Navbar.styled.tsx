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
`

export const image = styled.button`
  display:flex;
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