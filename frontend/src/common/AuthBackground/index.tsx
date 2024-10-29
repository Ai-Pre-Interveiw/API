import * as a from '@common/AuthBackground/AuthBackground.styled'
import FullButton from '@common/Fullbutton/index'
import { AuthBackgroundType } from '@/types/commonType'

const index = (props: AuthBackgroundType) =>  {

  const { text1, text2, onClick1, onClick2 } = props
  
  return (
    <a.Container>
      <h1>로그인</h1>
      <a.WrapButton>
        <FullButton text={String(text1)} onClick={onClick1} disabled/>
        <FullButton text={String(text2)} onClick={onClick2} disabled/>
      </a.WrapButton>
    </a.Container>
  )
}

export default index