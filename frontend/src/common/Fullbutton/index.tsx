import { FullButtonType } from '@/types/commonType'
import * as f from '@common/Fullbutton/Fullbutton.styled'

const index = (props: FullButtonType) => {
  const { text, onClick } = props

  return (
    <f.Button onClick={onClick}>
      <f.textWrap>
        {text}
      </f.textWrap>
    </f.Button>
  )
}

export default index