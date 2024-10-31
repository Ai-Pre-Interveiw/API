import { BASE_URL } from '@utils/requestMethods'
import * as h from '@components/home/HomeSection/HomeSection.styled'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '@/stores/user'
import FullButton from '@common/Fullbutton/index'
import MainBackground from '@common/MainBackground/index'

const index = () => {
  
  return (
    <h.Container>
      <h.image>
        {/* <h.SmallImageUpLeft/>
        <h.SmallImageUpRight/> */}
      </h.image>
      <MainBackground
        image_url={[
          'src/assets/images/main1.png',
          'src/assets/images/main2.png',
          'src/assets/images/main3.png'
        ]}
        text1={[
          '원하는 시간과',
          '원하는 장소에서',
          'AI를 기반으로 한',
          '철저한 모의면접 분석',
          '면접분석과',
          '합격전략 까지'
        ]}
        text2={[
          '언제 어디서든',
          '편하게 모의면접을 진행할 수 있습니다.',
          '음성, 자세, 시선 등을 기반으로',
          '모의면접을 분석합니다.',
          '모의면접 결과를 상세하게 분석하고',
          '합격전략을 제공합니다.'
        ]}
      >
      </MainBackground>
    </h.Container>
  )
}

export default index