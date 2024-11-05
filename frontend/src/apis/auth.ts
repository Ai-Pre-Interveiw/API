// src/apis/authApi.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Django 서버의 기본 URL

// 회원가입 요청에 사용할 타입 정의
interface SignUpData {
  email: string;
  password1: string;
  password2: string;
  nickname: string;
}

// 로그인 요청에 사용할 타입 정의
interface LoginData {
  email: string;
  password: string;
}

// 서버로부터 반환될 응답 타입 정의
interface Response {
  message: string;
}

// 유저 정보 응답 타입 정의
interface UserInfoResponse {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  createdAt: string;
}

// CSRF 토큰을 가져오는 함수
export const getCsrfToken = async () => {
  const response = await axios.get(`${BASE_URL}/accounts/csrf-token/`, {
    withCredentials: true,  // 세션 쿠키를 포함하여 요청
  });
  return response.data.csrfToken;
}

// 회원가입 API 요청 함수
export const signUp = async (data: SignUpData): Promise<Response> => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(`${BASE_URL}/accounts/signup/`, data, {
      headers: {
        'X-CSRFToken': csrfToken,  // CSRF 토큰을 헤더에 포함
      },
      withCredentials: true,
    });
    console.log(response.data);
    return response.data; // 요청 성공 시 데이터 반환
  } catch (error: any) {
    if (error.response) {
      if (error.response.data.email[0] === 'user with this email already exists.') {
        alert('이미 사용중인 이메일입니다.')
      }
      throw new Error(error.response.data.email || error.response.data.error || '회원가입 실패');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};

// 로그인 API 요청 함수
export const login = async (data: LoginData): Promise<Response> => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.post<Response>(`${BASE_URL}/accounts/login/`, data, {
      headers: {
        'X-CSRFToken': csrfToken,  // CSRF 토큰을 헤더에 포함
      },
      withCredentials: true,
    });
    return response.data; // 요청 성공 시 데이터 반환
  } catch (error: any) {
    if (error.response) {
      alert(error.response.data.non_field_errors[0])
      throw new Error(error.response.data.detail || '로그인 실패');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};

// 유저 조회 API 요청 함수
export const getUserInfo = async (): Promise<UserInfoResponse> => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.get<UserInfoResponse>(`${BASE_URL}/accounts/profile/`, {
      headers: {
        'X-CSRFToken': csrfToken,  // CSRF 토큰을 헤더에 포함
      },
      withCredentials: true,
    });
    return response.data; // 요청 성공 시 데이터 반환
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.detail || '유저 정보 조회 실패');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};
