import { BASE_URL } from '@utils/requestMethods'
import * as i from '@components/interview/InterviewSection/InterviewSection.styled'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '@/stores/user'
import FullButton from '@common/Fullbutton/index'
import MainBackground from '@common/MainBackground/index'


const index = (props: { image: string; texts:string[] }) => {
  
  const { image, texts } = props;

  return (
    <i.Container>
      {image !== '' ?
        <i.image key={image} imageUrl={image}/> :
        null
      }
      {image !== '' ?
        <i.TextWrapper key={image}>
          <i.Text1>{texts[0]}</i.Text1>
          <i.TextWrapper2 key={image}>
            <i.Text2>{texts[1]}</i.Text2>
            <i.Text2>{texts[2]}</i.Text2>
          </i.TextWrapper2>
        </i.TextWrapper> :
        <i.TextWrapper3>
          <i.Text3>
            {texts[0]} 
          </i.Text3>
          <i.Text3>
            {texts[1]} 
          </i.Text3> 
          <i.Text3>
            {texts[2]} 
          </i.Text3> 
        </i.TextWrapper3>
      }
    </i.Container>
  )
}

export default index