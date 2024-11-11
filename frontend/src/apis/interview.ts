import axios, { AxiosResponse } from 'axios';
import { getCsrfToken } from '@apis/auth'
const BASE_URL = 'http://localhost:8000'; // Django 서버의 기본 URL

interface CreateInterviewData {
  resume: number;  // 이력서 ID
  scheduled_start: string; // 면접 시작 시간, ISO 형식 (예: '2024-11-06T10:30:00Z')
  position: string; // 지원하는 직책 (예: '개발자')
  experience_level: string; // '신입' 또는 '경력'
}

interface CreateInterviewResultData {
  interview: number;  // 면접 ID
  question: number;   // 질문 ID
  video_path?: string;  // 비디오 파일 경로
  anxiety_graph_path?: string;  // 긴장도 그래프 경로
  gaze_distribution_path?: string;  // 시선 분포 그래프 경로
  posture_distribution_path?: string;  // 자세 분포 그래프 경로
  voice_distribution_path?: string;  // 목소리 분포 그래프 경로
  expression_distribution_path?: string;  // 표정 분포 그래프 경로
  filler_word_positions?: number[];  // 미사여구 위치 리스트
  follow_up_positions?: { [key: string]: string }[];  // 꼬리질문 위치와 질문 리스트
}

interface UpdateInterview {
  isProcessing: boolean,
  isProcessed: boolean,
}

export const getAllInterviews = async () => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.get(`${BASE_URL}/resume/interviews/`, {
      headers: {
        'X-CSRFToken': csrfToken, // CSRF 토큰 포함
      },
      withCredentials: true, // 인증 쿠키가 필요한 경우 설정
    });
    return response.data; // 면접 데이터 반환
  } catch (error) {
    console.error("면접 조회 오류:", error);
    throw error;
  }
};

export const getInterviewDetails = async (interviewId : number) => {
  try {
    const csrfToken = await getCsrfToken(); // CSRF 토큰을 가져오는 함수가 있다고 가정
    const response = await axios.get(
      `${BASE_URL}/resume/interviews/${interviewId}/`,
      {
        headers: {
          'X-CSRFToken': csrfToken, // CSRF 토큰 포함
        },
        withCredentials: true, // 인증 쿠키가 필요한 경우 설정
      }
    );
    return response.data;  // 응답 데이터를 반환
  } catch (error) {
    console.error("Failed to fetch interview details:", error);
    throw error;  // 오류를 발생시켜 호출한 곳에서 처리할 수 있게 함
  }
};

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

// InterviewResult 생성 요청 함수
export const createInterviewResult = async (data: FormData) => {

  try {
    const csrfToken = await getCsrfToken(); // CSRF 토큰을 가져오는 함수가 있다고 가정
    const response = await axios.post(
      `${BASE_URL}/resume/results/create/`,
      data,
      {
        headers: {
          'X-CSRFToken': csrfToken, // CSRF 토큰 포함
        },
        withCredentials: true, // 인증 쿠키가 필요한 경우 설정
      }
    );
    console.log('Interview Result created:', response.data);
    return response.data; // 성공 시 생성된 InterviewResult 데이터 반환
  } catch (error: any) {
    console.error('Interview Result creation failed:', error.response?.data || error.message);
    throw error;
  }
};

// InterviewResult 수정 요청 함수
export const updateInterviewResult = async (resultId: number, data: Partial<CreateInterviewResultData>) => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.put(
      `${BASE_URL}/resume/interviews/results/${resultId}/update/`,
      data,
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      }
    );
    console.log('Interview Result updated:', response.data);
    return response.data; // 성공 시 수정된 InterviewResult 데이터 반환
  } catch (error: any) {
    console.error('Interview Result update failed:', error.response?.data || error.message);
    throw error;
  }
};

// InterviewResult 조회 요청 함수
export const getInterviewResult = async (interviewId: number) => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.get(
      `${BASE_URL}/resume/interviews/${interviewId}/results/`,
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      }
    );
    console.log('Interview Result retrieved:', response.data);
    return response.data; // 성공 시 조회된 InterviewResult 데이터 반환
  } catch (error: any) {
    console.error('Interview Result retrieval failed:', error.response?.data || error.message);
    throw error;
  }
};

// 아이포즈인퍼런스
export const inferenceEyePose = async (interviewId : number) => {
  console.log('여기')
  try {
    const csrfToken = await getCsrfToken();
    // Django 서버의 URL 경로
    const response = await axios.post(`${BASE_URL}/inference/${interviewId}/`,
      {},
      { timeout: 1800000,
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      }
    );
    updateInterview(interviewId, {isProcessed: true})
    console.log("완료비디오:", response.data.processed_videos);
    // alert("완료됐씀다");
  } catch (error) {
    console.error("Error triggering inference:", error);
    alert("An error occurred while processing the videos.");
    updateInterview(interviewId, {isProcessed: false})
    updateInterview(interviewId, {isProcessing: false})
    window.location.reload();
  }
};

// Interview 수정 요청 함수
export const updateInterview = async (interviewId: number, data: Partial<UpdateInterview>) => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.patch(
      `${BASE_URL}/resume/interviews/${interviewId}/update/`,
      data,
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      }
    );
    console.log('Interview updated:', response.data);
    return response.data; // 성공 시 수정된 Interview 데이터 반환
  } catch (error: any) {
    console.error('Interview update failed:', error.response?.data || error.message);
    throw error;
  }
};