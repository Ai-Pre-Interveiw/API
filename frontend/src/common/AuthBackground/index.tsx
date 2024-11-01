import * as a from '@common/AuthBackground/AuthBackground.styled';
import FullButton from '@common/Fullbutton/index';
import { AuthBackgroundType } from '@/types/commonType';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from '@/stores/user';
import { useNavigate } from 'react-router-dom';

const Index = (props: AuthBackgroundType) => {
  const { title, text1, text2, onClick1, onClick2, inputs } = props;

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>(
    inputs.reduce((acc, input) => ({ ...acc, [input.inputTitle]: '' }), {})
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, inputTitle: string) => {
    const { value } = e.target;
    setInputValues(prevValues => ({
      ...prevValues,
      [inputTitle]: value
    }));
  };

  const setUserState = useSetRecoilState(userState);
  const navigate = useNavigate();

  const onClick = () => {
    console.log(inputValues);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if ('password2' in inputValues) {
      const newUser = {
        memberNo: 1,
        email: inputValues.email,
        nickname: inputValues.nickname,
        createdAt: new Date().toISOString(),
        imageUrl: '/src/assets/images/profile.png',
        resume: []
      };
      if (inputValues.email === '' || inputValues.password1 === '' || inputValues.password2 === '') {
        alert('* 표시는 필수 입력사항 입니다.')
      } else if (!emailPattern.test(inputValues.email)) {
        alert('아이디는 email 형식을 따라야 합니다.')
      } else if (inputValues.password1.length < 8 || inputValues.password1.length > 15) {
        alert('비밀번호는 8자 이상 15자 미만으로 설정해주세요.');
      } else if (inputValues.password1 !== inputValues.password2) {
        alert('비밀번호가 일치하지 않습니다.');
      } else if (inputValues.nickname.length > 6) {
        alert('닉네임은 6자 이하로 작성해주세요.')
      } else {
        setUserState(newUser)
        navigate('/')
      }
    } else {
      const user = {
        memberNo: 1,
        email: inputValues.email,
        nickname: 'test',
        createdAt: new Date().toISOString(),
        imageUrl: '/src/assets/images/profile.png',
        resume: []
      };
      if (!emailPattern.test(inputValues.email)) {
        alert('아이디는 email 형식을 따라야 합니다.')
      } else {
        setUserState(user)
        navigate('/')
      }
    }
  };

  return (
    <a.Container>
      <a.Title>{title}</a.Title>
      {title === '로그인' ? (
        <a.loginContainer>
          {inputs.map((input, index) => (
            <a.InputWrapper key={index}>
              <a.Label>{input.inputTitle === 'email' ? '아이디' : '비밀번호'}</a.Label>
              <a.InputField
                type={input.inputTitle === 'password' ? 'password' : 'email'}
                placeholder={input.inputText}
                required={input.isEssentail}
                value={inputValues[input.inputTitle] || ''}
                onChange={(e) => handleInputChange(e, input.inputTitle)}
              />
            </a.InputWrapper>
          ))}
        </a.loginContainer>
      ) : (
        <a.signupContainer>
          {inputs.map((input, index) => (
            <a.InputWrapper key={index}>
              <a.Label>
                {input.inputTitle === 'email' ? (
                  <>
                    아이디 <span style={{ color: 'red' }}>*</span>
                  </>
                ) : input.inputTitle === 'password1' ? (
                  <>
                    비밀번호 <span style={{ color: 'red' }}>*</span>
                  </>
                ) : input.inputTitle === 'password2' ? (
                  <>
                    비밀번호 확인 <span style={{ color: 'red' }}>*</span>
                  </>
                ) : (
                  '닉네임'
                )}
              </a.Label>
              <a.InputField
                type={
                  input.inputTitle === 'password1' || input.inputTitle === 'password2'
                    ? 'password'
                    : input.inputTitle === 'nickname'
                    ? 'text'
                    : 'email'
                }
                placeholder={input.inputText}
                required={input.isEssentail}
                value={inputValues[input.inputTitle] || ''}
                onChange={(e) => handleInputChange(e, input.inputTitle)}
              />
            </a.InputWrapper>
          ))}
          <a.GuideText>
            <span style={{ color: 'red' }}>* </span>
            표시는 필수 입력사항 입니다.
          </a.GuideText>
        </a.signupContainer>
      )}
      <a.WrapButton>
        {title === '로그인' ?
          <a.HintButtonWrapper>
            <a.HintText>아직 회원이 아니신가요?</a.HintText>
            <FullButton text={String(text1)} onClick={onClick1} disabled />
          </a.HintButtonWrapper>
          : <FullButton text={String(text1)} onClick={onClick1} disabled />
        }
        <FullButton text={String(text2)} onClick={onClick} disabled />
      </a.WrapButton>
    </a.Container>
  );
};

export default Index;
