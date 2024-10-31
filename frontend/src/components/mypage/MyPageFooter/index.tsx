import * as m from '@components/mypage/MyPageFooter/MyPageFooter.styled'

const index = () => {
  return (
    <m.Container>
      <m.Wrap>
        <m.Copyright>
          @ 2024, Made by{' '}
          <m.Blue onClick={() => window.open('https://www.notion.so/API-AI-126fcd1b8df481dca394c26b84f2083b', '_blank')}>
            APIs Team
          </m.Blue>{' '}
          &{' '}
          <m.Blue onClick={() => window.open('https://gj-aischool.or.kr/', '_blank')}>
            광인사
          </m.Blue>{' '}
          for a better web
        </m.Copyright>
        {/* <l.Menu>
          <l.Text>GIVEUS</l.Text>
          <l.Text>SSAFY</l.Text>
          <l.Text>C206</l.Text>
          <l.Text>License</l.Text>
        </l.Menu> */}
      </m.Wrap>
    </m.Container>
  )
}

export default index