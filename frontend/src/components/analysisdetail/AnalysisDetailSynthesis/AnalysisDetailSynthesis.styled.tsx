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

export const titleDiv = styled.div`
  // background-color: yellow;
  font-weight: bold;
  font-size: 3vh;
  padding-top: 2vh;
  padding-bottom: 2vh;
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
  height: 70vh;
  background-image: url(${(props) => props.imageUrl}); /* 이미지 경로 설정 */
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 10px;
`