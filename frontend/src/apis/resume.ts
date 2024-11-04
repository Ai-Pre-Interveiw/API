// src/apis/authApi.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Django 서버의 기본 URL


// 서버로부터 반환될 응답 타입 정의
interface Response {
  message: string;
}

// 회원가입 API 요청 함수
export const getResume = async (): Promise<Response> => {
  try {
    const response = await axios.get<Response>(`${BASE_URL}/accounts/signup/`);
    console.log(response.data)
    return response.data; // 요청 성공 시 데이터 반환
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.email || error.response.data.error || '회원가입 실패');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};