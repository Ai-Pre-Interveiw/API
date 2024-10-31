import SignupFooter from '@/components/signup/SignupFooter'
import SignupHeader from '@/components/signup/SignupHeader'
import SignupSection from '@/components/signup/SignupSection'
import * as l from '@pages/signup/SignupPage.styeld'

const SignupPage = () => {
  return (
    <l.Container>
      <SignupHeader />
      <SignupSection />
      <SignupFooter />
    </l.Container>
  )
}

export default SignupPage