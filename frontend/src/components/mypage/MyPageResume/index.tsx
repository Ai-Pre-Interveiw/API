import { BASE_URL } from '@utils/requestMethods'
import { useState } from 'react';
import * as m from '@components/mypage/MyPageResume/MyPageResume.styled'
import { useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import Modal from '@/common/Modal/index';
import { useRecoilValue } from 'recoil';
import { userState } from '@stores/user';

const index = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const user = useRecoilValue(userState);

  const handleModalOpen = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
  };
  
  return (
    <m.Container>
      {user.resume && user.resume.length > 0 ? 
      <m.SubMenu>
        이름
        <m.WrapTimeCheck>
          <div>
            등록일자
          </div>
          <div>
            확인
          </div>
        </m.WrapTimeCheck>
      </m.SubMenu>
      : <div></div>}
      {user.resume && user.resume.length > 0 ? 
        <m.ResumeList>
          {user.resume.map((resume, index) => (
            <m.ResumeItem key={index}>
              <m.ResumeItemName>
                {resume.filePath.split('/').pop()}
              </m.ResumeItemName>
              <m.ResumeItemTimeButton>
                {resume.uploadTime}
                <FullButton text="로컬이라" onClick={() => {}} disabled/>
              </m.ResumeItemTimeButton>
            </m.ResumeItem> // resume의 파일명을 표시
          ))}
          <m.RegisterButton>
            <FullButton text="등록하기" onClick={handleModalOpen} disabled/>
          </m.RegisterButton>
        </m.ResumeList> :
      <m.WrapContent>
        <m.Not>등록된 자기소개서 없습니다.</m.Not>
        <FullButton text="등록하기" onClick={handleModalOpen} disabled/>
      </m.WrapContent>
      
      }

      {isModalOpen && (
        <Modal
          name="자기소개서 등록"
          onClose={handleModalClose}
          openSecondModal={handleModalOpen} // 두 번째 모달 열기 함수 전달
          texts={[
            '자기소개서 등록',
            '※ .pdf, .docs, .hwp 파일만 가능합니다.',
          ]}
          width="30%"
          height="32%"
        />
      )}

    </m.Container>
  )
}

export default index