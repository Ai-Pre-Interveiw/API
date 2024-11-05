import axios, { AxiosResponse } from 'axios';
import { getCsrfToken } from '@apis/auth'
const BASE_URL = 'http://localhost:8000'; // Django 서버의 기본 URL

interface CreateInterviewData {
  resume: number;  // 이력서 ID
  scheduled_start: string; // 면접 시작 시간, ISO 형식 (예: '2024-11-06T10:30:00Z')
  position: string; // 지원하는 직책 (예: '개발자')
  experience_level: string; // '신입' 또는 '경력'
}

// Interview 생성 요청 함수
export const createInterview = async (data: CreateInterviewData) => {
  try {
    const csrfToken = await getCsrfToken(); // CSRF 토큰을 가져오는 함수가 있다고 가정
    const response = await axios.post(
      `${BASE_URL}/resume/interviews/create/`,
      data,
      {
        headers: {
          'X-CSRFToken': csrfToken, // CSRF 토큰 포함
        },
        withCredentials: true, // 인증 쿠키가 필요한 경우 설정
      }
    );
    // console.log('Interview created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Interview creation failed:', error.response?.data || error.message);
    throw error;
  }
};

export const getInterviewQuestions = async (interviewId: number) => {
  try {
    const csrfToken = await getCsrfToken(); // CSRF 토큰을 가져오는 함수가 있다고 가정
    const response = await axios.get(`${BASE_URL}/resume/interviews/${interviewId}/questions/`, {
      headers: {
        'X-CSRFToken': csrfToken, // CSRF 토큰 포함
      },
      withCredentials: true, // 인증 쿠키가 필요한 경우 설정
    });
    // console.log(response)
    return response.data; // 성공 시 질문 데이터 반환
  } catch (error) {
    console.error("질문 조회 오류:", error);
    throw error;
  }
};