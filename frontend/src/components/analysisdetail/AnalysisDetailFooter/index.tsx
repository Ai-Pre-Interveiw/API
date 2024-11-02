import * as a from '@/components/analysisdetail/AnalysisDetailFooter/AnalysisDetailFooter.styled'

const index = () => {
  return (
    <a.Container>
      <a.Wrap>
        <a.Copyright>
          @ 2024, Made by{' '}
          <a.Blue onClick={() => window.open('https://www.notion.so/API-AI-126fcd1b8df481dca394c26b84f2083b', '_blank')}>
            APIs Team
          </a.Blue>{' '}
          &{' '}
          <a.Blue onClick={() => window.open('https://gj-aischool.or.kr/', '_blank')}>
            광인사
          </a.Blue>{' '}
          for a better web
        </a.Copyright>
        {/* <l.Menu>
          <l.Text>GIVEUS</l.Text>
          <l.Text>SSAFY</l.Text>
          <l.Text>C206</l.Text>
          <l.Text>License</l.Text>
        </l.Menu> */}
      </a.Wrap>
    </a.Container>
  )
}

export default index