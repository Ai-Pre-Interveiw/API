import { useState, useEffect } from 'react';
import * as m from '@common/MainBackground/MainBackground.styled';
import { MainBackgroundType } from '@/types/commonType';

const Index = (props: MainBackgroundType) => {
  const { image_url, text1, text2 } = props;
  
  // 현재 슬라이드 인덱스를 저장하는 상태
  const [currentSlide, setCurrentSlide] = useState(0);

  // 슬라이드 자동 전환을 위한 useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % image_url.length);
    }, 5000); // 3초마다 슬라이드 전환

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [image_url.length]);

  return (
    <m.Container>
      {image_url.map((url, index) => (
        <m.Slide key={index} isActive={index === currentSlide}>
          <m.Image src={url} alt={`Slide ${index + 1}`} />
          <m.TextWrapper>
            <m.TextWrapper2>
              <m.Text1>{text1[index * 2]}</m.Text1>
              <m.Text1>{text1[index * 2 + 1]}</m.Text1>
            </m.TextWrapper2>
            <m.TextWrapper2>
              <m.Text2>{text2[index * 2]}</m.Text2>
              <m.Text2>{text2[index * 2 + 1]}</m.Text2>
            </m.TextWrapper2>
          </m.TextWrapper>
        </m.Slide>
      ))}
    </m.Container>
  );
};

export default Index;
