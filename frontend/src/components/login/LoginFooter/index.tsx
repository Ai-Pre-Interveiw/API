import * as l from '@components/login/LoginFooter/LoginFooter.styled'

const index = () => {
  return (
    <l.Container>
      <l.Wrap>
        <l.Copyright>
          @ 2024, Made by{' '}
          <l.Blue onClick={() => window.open('https://www.notion.so/API-AI-126fcd1b8df481dca394c26b84f2083b', '_blank')}>
            APIs Team
          </l.Blue>{' '}
          &{' '}
          <l.Blue onClick={() => window.open('https://gj-aischool.or.kr/', '_blank')}>
            광인사
          </l.Blue>{' '}
          for a better web
        </l.Copyright>
        {/* <l.Menu>
          <l.Text>GIVEUS</l.Text>
          <l.Text>SSAFY</l.Text>
          <l.Text>C206</l.Text>
          <l.Text>License</l.Text>
        </l.Menu> */}
      </l.Wrap>
    </l.Container>
  )
}

export default index