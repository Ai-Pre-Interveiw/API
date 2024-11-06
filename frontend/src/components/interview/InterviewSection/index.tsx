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
        <i.TextWrapper>
          <i.TextWrapper4>
            <i.Text2>{texts[0]}</i.Text2>
            <i.Text1>{texts[1]}</i.Text1>
            <i.Text2>{texts[2]}</i.Text2>
          </i.TextWrapper4>
          <i.TextWrapper4>
            <i.Text2>{texts[3]}</i.Text2>
            <i.Text1>{texts[4]}</i.Text1>
            <i.Text2>{texts[5]}</i.Text2>
            <i.Text1>{texts[6]}</i.Text1>
            <i.Text2>{texts[7]}</i.Text2>
          </i.TextWrapper4>
          <i.TextWrapper4>
            <i.Text2>{texts[8]}</i.Text2>
            <i.Text1>{texts[9]}</i.Text1>
            <i.Text2>{texts[10]}</i.Text2>
          </i.TextWrapper4>
        </i.TextWrapper>
      }
    </i.Container>
  )
}

export default index