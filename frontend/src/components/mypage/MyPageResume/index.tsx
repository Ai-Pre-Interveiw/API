import { BASE_URL } from '@utils/requestMethods'
import { useEffect, useState } from 'react';
import * as m from '@components/mypage/MyPageResume/MyPageResume.styled'
import { useNavigate } from 'react-router-dom'
import FullButton from '@common/Fullbutton/index'
import Modal from '@/common/Modal/index';
import { useRecoilValue } from 'recoil';
import { userState } from '@stores/user';
import { getResume } from '@/apis/resume';

interface Resume {
  id: number;
  filePath: string;
  uploadTime: string;
}

const Index = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const user = useRecoilValue(userState);
  const [resumes, setResumes] = useState<Resume[]>([]);

  const handleModalOpen = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  useEffect(() => {
    const loadResumes = async () => {
      const resumeData = await getResume();
      setResumes(resumeData); // resumes.data 대신 resumeData로 설정
      console.log(resumeData);
    };
    loadResumes();
  }, []);
  
  return (
    <>
    <m.Container>
      {resumes && resumes.length > 0 ? 
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
      {resumes && resumes.length > 0 ?
        <m.ResumeList>
          {resumes
          .slice() // 원본 배열을 변경하지 않기 위해 복사본을 생성
          .reverse() // 역순으로 배열을 정렬
          .map((resume, index) => (
            <m.ResumeItem key={index}>
              <m.ResumeItemName>
                {resume.filePath.split('/').pop()}
              </m.ResumeItemName>
              <m.ResumeItemTimeButton>
                { // 한국 시간대로 포맷된 업로드 시간 생성
                  new Intl.DateTimeFormat('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true, // 12시간제 형식 사용
                  }).format(new Date(resume.uploadTime))}
                <FullButton 
                  text="자세히 보기" 
                  onClick={() => window.open(`${BASE_URL}/media/${resume.filePath}`, '_blank')} 
                  disabled
                />
              </m.ResumeItemTimeButton>
            </m.ResumeItem>
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
    </m.Container>
    
    {isModalOpen && (
        <Modal
          name="자기소개서 등록"
          onClose={handleModalClose}
          openSecondModal={() => {}} // 두 번째 모달 열기 함수 전달
          texts={[
            '자기소개서 등록',
            '※ .pdf, .docs, .hwp 파일만 가능합니다.',
          ]}
          width="30%"
          height="32%"
        />
      )}
    </>
  )
}

export default Index