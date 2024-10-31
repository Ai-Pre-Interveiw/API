import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 10vh;
`

export const Logo = styled.div`
  img {
    width: 120px;
  }
  margin-left: 20px;
  cursor: pointer;
`

export const Button = styled.button`
  display: flex;
  align-items: center;
`

export const Icon = styled.img`
  width: 20px;
  margin-right: 5px;
`

export const AppButton = styled.button`
  margin-right: 0;
  border-radius: 34.5px;
  background: linear-gradient(82deg, #313860 2.25%, #151928 79.87%);
  color: #fff;
  padding: 8px 8%;
`