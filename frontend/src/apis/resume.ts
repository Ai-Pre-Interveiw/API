// src/apis/authApi.ts
import axios, { AxiosResponse } from 'axios';
import { getCsrfToken } from '@apis/auth'
const BASE_URL = 'http://localhost:8000'; // Django 서버의 기본 URL


// 서버로부터 반환될 응답 타입 정의
interface Response {
  resume: { filePath: string; uploadTime: string }[];
}

export const getResume = async (): Promise<AxiosResponse> => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.get(`${BASE_URL}/resume/`, {
      headers: {
        'X-CSRFToken': csrfToken, // CSRF 토큰을 헤더에 포함
      },
      withCredentials: true,
    });
    return response; // 전체 Axios 응답 반환
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.email || error.response.data.error || '회원가입 실패');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);  // 파일 추가
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(`${BASE_URL}/resume/upload/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        'X-CSRFToken': csrfToken,
      },
      withCredentials: true,  // 세션 인증이 필요한 경우 설정
    });
    return(response.data)
    // console.log(response)
    // console.log(response.data);  // 업로드된 파일 정보 출력
  } catch (error) {
    console.error("파일 업로드 오류:", error);
  }
};