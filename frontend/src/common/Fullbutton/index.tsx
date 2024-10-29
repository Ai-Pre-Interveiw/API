import { FullButtonType } from '@/types/commonType'
import * as f from '@common/Fullbutton/Fullbutton.styled'

const index = (props: FullButtonType) => {
  const { text, onClick } = props

  return (
    <f.Button onClick={onClick}>
      {text}
    </f.Button>
  )
}

export default index