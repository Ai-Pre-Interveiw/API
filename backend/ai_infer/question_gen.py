import os
import getpass
import re
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI  # 수정된 부분
from langchain_openai import OpenAIEmbeddings  # 수정된 부분
from langchain.schema import Document
# from langchain_community.document_loaders import PyPDFLoader
from langchain.document_loaders import PyPDFLoader
from dotenv import load_dotenv
load_dotenv()
from django.conf import settings
import openai
import django
import sys
import json


# 프로젝트 루트 디렉토리를 sys.path에 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Django 설정 초기화
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'API.settings')
django.setup()

# OpenAI API 키 설정
openai.api_key = settings.OPENAI_API_KEY
# OpenAI API Key 설정
# os.environ['OPENAI_API_KEY'] = settings.OPENAI_API_KEY

# FAISS 벡터 스토어를 저장할 리스트 json로 하기 다시 생성
vectorstores = []

# 벡터 스토어 경로 리스트
folders = [
    "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/question_guide",
    "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/guideline",
    "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/8_vector_store", 
    "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/sanghwang_vector_store"
]

# 임베딩 모델 초기화
embeddings = OpenAIEmbeddings()


# 관련 문서 검색 함수
def search_across_all_stores(query_text, top_k=3):
    all_results = []
    for vectorstore in vectorstores:
        results = vectorstore.similarity_search(query_text, k=top_k)
        all_results.extend(results)
    return "\n\n".join([doc.page_content for doc in all_results])

# 텍스트 길이 제한 함수 (각 텍스트를 최대 1500자로 제한)
def truncate_text(text, max_length=1500):
    return text[:max_length] if len(text) > max_length else text


# Function to parse questions from the content
def parse_questions(content):
    # 질문 유형, 질문 번호, 질문, 근거를 추출하는 정규 표현식
    pattern = r"질문 유형\s*:\s*(.*?)\s+질문\s*(\d+):\s*(.*?)\s+근거\s*\d+:\s*(.*?)(?=\s+질문 유형|$)"
    questions = []
    # 패턴 매칭
    matches = re.findall(pattern, content, re.DOTALL)
    # 결과 출력
    for match in matches:
        question_type = match[0].strip()     # 질문 유형
        question_number = match[1].strip()   # 질문 번호
        question_text = match[2].strip()     # 질문 내용
        ground_text = match[3].strip()       # 근거 내용
        
        if question_type != '기초 역량 질문' and question_type != '기술 역량 질문' and question_type != '직무 역량 질문' and question_type != '기본 직무 역량 질문':
            question_type = '기타 질문'

        questions.append({
            'number': question_number,
            'type': question_type,
            'question': question_text,
            'ground': ground_text
        })
    return questions

# Function to select best questions
def select_best_questions(questions_by_type):
    final_best_questions = []
    # For '직무 역량 관련 질문' and '기본 직무 역량 관련 질문', pick 2 each
    for qtype in ['직무 역량 질문', '기초 역량 질문', '기술 역량 질문', '기본 직무 역량 질문']:
        qs = questions_by_type.get(qtype, [])
        # Remove selected questions from the list after adding
        for _ in range(2):
            if not qs:
                break
            best_q = max(qs, key=lambda x: len(x['question']))
            final_best_questions.append(best_q)
            qs.remove(best_q)
    # For '인성 질문' and '돌발 질문', pick 1 each
    for qtype in ['인성 질문', '돌발 질문']:
        qs = questions_by_type.get(qtype, [])
        if qs:
            best_q = max(qs, key=lambda x: len(x['question']))
            final_best_questions.append(best_q)
            qs.remove(best_q)
    # If we have less than 6 questions, fill with '기타 질문'
    if len(final_best_questions) < 6:
        qs = questions_by_type.get('기타 질문', [])
        while len(final_best_questions) < 6 and qs:
            best_q = max(qs, key=lambda x: len(x['question']))
            final_best_questions.append(best_q)
            qs.remove(best_q)
    return final_best_questions

def get_question(entry_or_experienced, job, resume):
    # 각 폴더의 FAISS 인덱스를 로드
    for folder in folders:
        vectorstore = FAISS.load_local(folder, embeddings=embeddings, allow_dangerous_deserialization=True)
        vectorstores.append(vectorstore)

    # 모델 초기화 (온도 설정 동일)
    fixed_model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    # 질문 생성 체인에서는 temperature를 높임
    random_model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)

    # 두 번째 체인: 강점 및 약점 분석
    strengths_weaknesses_prompt = PromptTemplate(
        input_variables=["doc_text", "applicant_info"],
        template=""" 
        다음 자기소개서를 바탕으로 지원자의 강점과 약점을 분석해 주세요. 강점과 약점 각각에 대해 한 문장씩 작성해 주세요.

        지원자 정보:
        {applicant_info}

        자기소개서:
        {doc_text}

        분석 결과:
        - 강점: 
        - 약점: 
        """
    )

    # 네 번째 체인: 학문적 경험과 실무 경험 추출
    academic_experience_prompt = PromptTemplate(
        input_variables=["doc_text", "applicant_info"],
        template=""" 
        다음 자기소개서와 지원자 정보를 바탕으로 지원자의 학문적 경험과 실무 경험을 추출해 주세요. 각각에 대해 간단하게 요약해 주세요.

        지원자 정보:
        {applicant_info}

        자기소개서:
        {doc_text}

        학문적 경험:
        실무 경험:
        """
    )

    # 다섯 번째 체인: 지원자 정보, 경력 상태, 강점과 약점을 바탕으로 질문 생성
    question_prompt = PromptTemplate(
        input_variables=["doc_text", "guideline_texts", "strengths_weaknesses", "real_experiences", "applicant_info"],
        template=""" 
        다음 자기소개서의 내용을 바탕으로, 지원자의 직종, 경력 상태, 강점, 약점, 실무 경험 및 학문적 경험을 종합하여 6개의 질문을 생성해 주세요.
        각 질문에는 반드시 관련된 가이드라인 내용을 참고하여 근거를 작성해 주세요.

        지원자 정보:
        {applicant_info}

        자기소개서 내용:
        {doc_text}

        분석된 강점과 약점:
        {strengths_weaknesses}

        실무 경험 및 학문적 경험:
        {real_experiences}

        참고 가이드라인:
        {guideline_texts}

        bold체 없이 총 6개의 질문을 생성해 주세요.

        예시)

        질문 유형 : 유형내용
        질문 1: 질문내용
        근거 1: 근거내용
        
        질문 유형 : 유형내용
        질문 2: 질문내용
        근거 2: 근거내용
        
        질문 유형 : 유형내용
        질문 3: 질문내용
        근거 3: 근거내용
        
        질문 유형 : 유형내용
        질문 4: 질문내용
        근거 4: 근거내용
        
        질문 유형 : 유형내용
        질문 5: 질문내용
        근거 5: 근거내용

        질문 유형 : 유형내용
        질문 6: 질문내용
        근거 6: 근거내용
        """
    )

    # 자기소개서 텍스트 로드 및 분할
    loader = PyPDFLoader(f"C:/Users/USER/Desktop/pjt/API/backend/media/resume/{resume}")
    doc_lst = loader.load_and_split()  # 페이지별로 텍스트 분할
    response_lst = []

    # 가이드라인 내용 검색 및 트렁케이션
    guideline_text = truncate_text(search_across_all_stores("핵심 평가 요소 질문 생성 지침"))
    guideline_text += "\n\n" + truncate_text(search_across_all_stores("질문 생성 전 검토 과정"))

    # 두 번째 체인 (강점 및 약점 분석)
    strengths_weaknesses_chain = strengths_weaknesses_prompt | fixed_model

    # 네 번째 체인 (학문적 경험과 실무 경험 추출)
    academic_experience_chain = academic_experience_prompt | fixed_model

    # 다섯 번째 체인(질문 생성)
    question_chain = question_prompt | random_model

    # 모든 페이지의 텍스트를 하나의 문자열로 결합
    all_doc_text = "\n".join([truncate_text(doc.page_content) for doc in doc_lst])

    # 두 번째 체인 실행: 강점 및 약점 분석
    strengths_weaknesses_response = strengths_weaknesses_chain.invoke({
        "doc_text": all_doc_text,
        "applicant_info": None
    })

    # 네 번째 체인 실행: 학문적 경험 및 실무 경험 추출
    real_experiences_response = academic_experience_chain.invoke({
        "doc_text": all_doc_text,
        "applicant_info": None
    })

    # 관련 텍스트 검색 및 길이 제한
    related_text = truncate_text(search_across_all_stores(all_doc_text))

    # 질문 세트 4개 생성
    response_lst = []
    for _ in range(4):
        # 다섯 번째 체인 실행: 질문 생성 (6개의 질문을 생성)
        question_response = question_chain.invoke({
            "doc_text": all_doc_text, 
            "guideline_texts": guideline_text + "\n\n" + related_text,
            "applicant_info": [entry_or_experienced, job],  # applicant_info는 question_chain 내부에서 추출
            "strengths_weaknesses": strengths_weaknesses_response,
            "real_experiences": real_experiences_response
        })

        # 결과 저장
        response_lst.append((question_response, strengths_weaknesses_response, real_experiences_response))

    # 결과 출력 (6개의 질문을 포함한 4개의 질문 세트)
    for i, (question_response, strengths_weaknesses_response, real_experiences_response) in enumerate(response_lst, 1):
        print(f"\nResponse Set {i} (질문 생성):\n{question_response.content}\n{'-'*30}\n")

    # Collect all questions from response_lst
    all_questions = []
    for response in response_lst:
        content = response[0].content
        questions = parse_questions(content)
        all_questions.extend(questions)

    # Group questions by type
    questions_by_type = {}
    for q in all_questions:
        qtype = q['type']
        questions_by_type.setdefault(qtype, []).append(q)


    # Get the final best questions
    best_questions = select_best_questions(questions_by_type)

    result = ['1분 자기소개를 해주세요.']
    # Print the best questions
    print("\nBest Questions Set by Type (6 questions):\n")
    for i, q in enumerate(best_questions, 1):
        if i == 7:
            break
        else:
            result.append(q['question'])
            print(f"Best Question {i}:")
            print(f"Type: {q['type']}")
            print(f"Question: {q['question']}")
            print(f"Ground: {q['ground']}")
            print('-'*30)

    result.append('test')
    print(result)
    return result

# get_question('entry', 'AI')

# #질문 세트 8개
# # 각 자기소개서 페이지 텍스트에 대해 정보 추출, 강점/약점 분석, 경험 추출 후 질문 생성
# for idx, doc_text in enumerate(doc_lst, 1):
#     doc_text_content = truncate_text(doc_text.page_content)  # 트렁케이션 적용
    
#     # 두 번째 체인 실행: 강점 및 약점 분석
#     strengths_weaknesses_response = strengths_weaknesses_chain.invoke({"doc_text": doc_text_content, "applicant_info": None})

#     # 네 번째 체인 실행: 학문적 경험 및 실무 경험 추출
#     real_experiences_response = academic_experience_chain.invoke({"doc_text": doc_text_content, "applicant_info": None})

#     # 관련 텍스트 검색 및 길이 제한
#     related_text = truncate_text(search_across_all_stores(doc_text_content))

#     # 다섯 번째 체인 실행: 지원자 정보 추출 및 질문 생성
#     question_response = question_chain.invoke({
#         "doc_text": doc_text_content, 
#         "guideline_texts": guideline_text + "\n\n" + related_text,
#         "applicant_info": None,  # applicant_info는 question_chain 내부에서 추출
#         "strengths_weaknesses": strengths_weaknesses_response,
#         "real_experiences": real_experiences_response  # 추가된 변수
#     })

#     # 결과 저장
#     response_lst.append((question_response, strengths_weaknesses_response, real_experiences_response))

# # 생성된 질문 출력
# for i, (question_response, strengths_weaknesses_response, real_experiences_response) in enumerate(response_lst, 1):
#     print(f"\nResponse {i} (질문 생성):\n{question_response.content}\n{'-'*30}\n")


# # 필요한 라이브러리 임포트
# from sentence_transformers import SentenceTransformer, util
# import numpy as np

# # 이전 코드에서 생성된 response_lst를 사용한다고 가정합니다.
# # 각 질문 세트에서 질문을 추출합니다.
# question_sets = []

# for i, (question_response, strengths_weaknesses_response, real_experiences_response) in enumerate(response_lst, 1):
#     # 질문을 개별적으로 추출합니다.
#     questions = question_response.content.strip().split('\n')
#     # 빈 줄과 불필요한 공백을 제거합니다.
#     questions = [q.strip() for q in questions if q.strip()]
#     question_sets.append(questions)


# # 사전 학습된 문장 임베딩 모델 로드
# model = SentenceTransformer('all-MiniLM-L6-v2')

# # 각 질문에 대한 임베딩 생성
# question_embeddings = []

# for questions in question_sets:
#     embeddings = model.encode(questions, convert_to_tensor=True)
#     question_embeddings.append(embeddings)

# # 유사도 행렬 초기화
# num_sets = len(question_sets)
# similarity_matrix = np.zeros((num_sets, num_sets))

# # 각 질문 세트 간의 유사도 계산
# for i in range(num_sets):
#     for j in range(i+1, num_sets):
#         emb_i = question_embeddings[i]
#         emb_j = question_embeddings[j]
#         # 모든 질문 쌍에 대한 코사인 유사도 계산
#         cosine_scores = util.cos_sim(emb_i, emb_j).numpy()
#         # 세트 i의 각 질문이 세트 j의 질문들과 얼마나 유사한지의 최대값
#         max_similarities_i = cosine_scores.max(axis=1)
#         # 세트 j의 각 질문이 세트 i의 질문들과 얼마나 유사한지의 최대값
#         max_similarities_j = cosine_scores.max(axis=0)
#         # 최대 유사도의 평균 계산
#         avg_max_similarity = (max_similarities_i.mean() + max_similarities_j.mean()) / 2
#         # 유사도 행렬에 저장
#         similarity_matrix[i,j] = avg_max_similarity
#         similarity_matrix[j,i] = avg_max_similarity  # 대칭 행렬이므로

# # 유사도 결과 출력
# print("각 질문 세트 간의 유사도 (0과 1 사이의 값):\n")
# for i in range(num_sets):
#     for j in range(i+1, num_sets):
#         print(f"세트 {i+1}와 세트 {j+1} 간의 유사도: {similarity_matrix[i,j]:.4f}")










# pdf_path = "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/r_vector_store/aibook_pdf/aibook.pdf"
# json_path = pdf_path.replace(".pdf", ".json")

# # PDF 파일 로드 및 텍스트 추출
# loader = PyPDFLoader(pdf_path)
# documents = loader.load_and_split()

# # 문서를 JSON 형식으로 변환하여 저장
# json_documents = [{"page_content": doc.page_content, "metadata": doc.metadata} for doc in documents]

# with open(json_path, "w", encoding="utf-8") as json_file:
#     json.dump(json_documents, json_file, ensure_ascii=False, indent=4)

# print(f"PDF 내용을 JSON 형식으로 {json_path}에 저장했습니다.")


# # 임베딩 모델 초기화
# embeddings = OpenAIEmbeddings()

# # JSON 파일 경로
# json_path = "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/r_vector_store/aibook_pdf/aibook.json"

# # JSON 파일에서 텍스트 로드
# with open(json_path, "r", encoding="utf-8") as json_file:
#     documents = json.load(json_file)

# # 각 문서를 Document 객체로 변환
# document_objects = [Document(page_content=doc["page_content"], metadata=doc["metadata"]) for doc in documents]

# # FAISS 인덱스 생성
# vectorstore = FAISS.from_documents(document_objects, embeddings)

# # 저장 폴더 설정
# save_folder = "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/r_vector_store/sanghwang_vector_store"
# os.makedirs(save_folder, exist_ok=True)

# # 인덱스를 저장
# vectorstore.save_local(save_folder)
# print(f"인덱스를 {save_folder}에 저장했습니다.")


# # 임베딩 모델 초기화
# embeddings = OpenAIEmbeddings()

# # 주어진 텍스트 데이터를 개별 문서로 분할
# text_data = """
# --- 문서 1 ---
# 이 모델은 특정 회사에 입사 지원을 희망하는 지원자가 해당 회사에 제출한 자기소개서를 바탕으로 질문을 생성하는 구조를 가집니다. 지식(Knowledge)에 업로드된 데이터를 기반으로 자기소개서가 입력되면, 지원자의 역할은 인사 담당자 및 면접관으로 설정되고, 사용자가 업로드한 자기소개서의 내용을 바탕으로 경험적 요소와 심층 질문을 생성합니다.
# [출처: 출처 없음]

# --- 문서 2 ---
# 질문 생성 방법: 자기소개서 기반 성격 질문 1개
# 질문 생성 과정
# 자기소개서 분석
# 입력된 자기소개서를 기반으로 면접 질문을 구성합니다. 자기소개서의 특정 문장을 바탕으로 각 질문을 생성하고, 해당 질문이 어떤 자기소개서 내용에 기반하였는지 표시합니다.
# [출처: 출처 없음]

# --- 문서 3 ---
# 각 지원자마다 고정된 질문과 점수를 생성하기 위해 고정된 시드를 사용하여 일관된 값을 얻을 수 있도록 설정하고, 새로운 문서가 입력될 경우 자동으로 시드를 변경하여 해당 문서에 대한 시드를 저장합니다. 모든질문은 반드시 한글로 생성합니다.
# [출처: 출처 없음]

# --- 문서 4 ---
# 3가지 핵심 평가 요소
# 직무 역량: 직무 수행 능력 및 전문성 평가
# 질문 생성 방법: 자기소개서 기반 도출 질문 2개
# 기본 직무 역량: 지원자의 강점, 기본 역량, 공통 역량 평가
# 질문 생성 방법: 자기소개서와 가장 가까운 상황 기반 질문을 지식(Konwledge)의 상황제시형질문(책).pdf에서 1개, 가장 먼 상황 기반 질문 1개, 과거 상황 질문 2개 (자기소개서 기반 도출)
# 성격: 지원자의 핵심 가치 및 회사의 인재상 평가
# 질문 생성 방법: 자기소개서 기반 성격 질문 1개
# 질문 생성 과정
# 자기소개서 분석
# [출처: 출처 없음]

# --- 문서 5 ---
# 근거: 자기소개서에서 '성취 경험' 부분을 기반으로 질문 생성
# 과거 상황 질문 2: "예상치 못한 문제를 해결한 경험이 있으신가요? 어떻게 해결하셨나요?"
# 근거: 자기소개서에서 '문제 해결 경험' 부분을 기반으로 질문 생성
# 성격
# 성격 질문: "회사의 핵심 가치 중 하나는 [자기소개서 내용]인데, 이에 대해 어떻게 생각하시나요?"
# 근거: 자기소개서에서 '핵심 가치' 부분을 기반으로 질문 생성
# [출처: 출처 없음]

# --- 문서 6 ---
# 근거: 자기소개서에서 '직무 관련 경험' 부분을 기반으로 질문 생성
# 기본 직무 역량
# 가장 가까운 상황 기반 질문: 상황제시형질문(책).pdf 몇 번
# 근거: 자기소개서에서 '팀 프로젝트 경험' 부분과 유사
# 가장 먼 상황 기반 질문: 상황제시형질문(책).pdf 몇 번
# 근거: 자기소개서에서 기술 도입 부분과 거리가 멈
# 과거 상황 질문 1: "이전에 맡았던 업무에서 가장 성취감을 느꼈던 순간은 언제였나요?"
# 근거: 자기소개서에서 '성취 경험' 부분을 기반으로 질문 생성
# [출처: 출처 없음]

# --- 문서 7 ---
# 질문 유형 종류 : [기초 역량 질문, 직무 역량 질문, 인성 질문, 돌발 질문]

# 질문 예시 (모든 질문과 근거는 한국어로 작성됨)

# 질문유형 : 기초 역량 질문 (질문 유형 종류 중 가장 잘 맞는 유형 중 하나 선택)
# 질문 1: 이전에 경험하셨던 [자기소개서 내용] 프로젝트에서 가장 큰 어려움은 무엇이었으며, 이를 어떻게 극복하셨나요?
# 근거 1: 자기소개서에서 '프로젝트 진행 경험' 부분을 기반으로 질문 생성

# 질문유형 : 기술 역량 질문 (질문 유형 종류 중 가장 잘 맞는 유형 중 하나 선택)
# 질문 2: [자기소개서 내용] 경험을 통해 얻게 된 직무 역량을 현재 지원하는 직무에 어떻게 적용할 수 있을 것이라 생각하시나요?
# 근거 2: 자기소개서에서 '직무 관련 경험' 부분을 기반으로 질문 생성
# [출처: 출처 없음]

# --- 문서 8 ---
# 질문 유사성 체크
# 처음 생성된 질문이 자기소개서에 이미 포함된 내용과 유사한지를 확인합니다. 생성된 질문의 답변이 이미 자기소개서에 포함되어 있으면(유사도 0.7 이상), 해당 질문을 다른 질문으로 대체합니다.

# 최종 질문 업데이트
# 유사성 체크 과정을 거친 후, 자기소개서 기반의 최종 면접 질문을 업데이트하여 출력합니다.
# [출처: 출처 없음]
# """

# # 각 문서를 구분자로 분리
# documents_text = text_data.strip().split('--- 문서 ')[1:]  # '--- 문서 '로 분할 후 첫 항목은 버림

# # Document 객체로 변환
# documents = []
# for doc in documents_text:
#     doc_lines = doc.strip().splitlines()
#     page_content = "\n".join(line for line in doc_lines if not line.startswith("[출처:"))
#     metadata = {"source": "출처 없음"}  # 메타데이터 예시
#     documents.append(Document(page_content=page_content, metadata=metadata))

# # FAISS 인덱스 생성
# vectorstore = FAISS.from_documents(documents, embeddings)

# # 저장 폴더 설정
# save_folder = "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/guideline"
# os.makedirs(save_folder, exist_ok=True)

# # 인덱스를 저장
# vectorstore.save_local(save_folder)
# print(f"텍스트 문서 인덱스를 {save_folder}에 저장했습니다.")

# import pandas as pd
# # 임베딩 모델 초기화
# embeddings = OpenAIEmbeddings()

# # CSV 파일 경로
# csv_path = "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/link_1/link_1.csv"

# # CSV 파일을 pandas로 읽기
# df = pd.read_csv(csv_path, encoding="utf-8")  # 필요한 경우 인코딩을 'cp949' 또는 'euc-kr'로 변경

# def split_text(text, max_length=500):
#     return [text[i:i + max_length] for i in range(0, len(text), max_length)]

# document_objects = []
# count = 0
# for _, row in df.iterrows():
#     chunks = split_text(row["Content"])
#     for chunk in chunks:
#         document_objects.append(
#             Document(
#                 page_content=chunk,
#                 metadata={"page": row["Page"], "url": row["URL"]}
#             )
#         )
#         count += 1  # 각 Document 객체마다 카운터 증가

#         # 1000번마다 진행 상황 출력
#         if count % 1000 == 0:
#             print(f"{count}개의 Document 객체 생성 완료")

# # FAISS 인덱스 생성
# vectorstore = FAISS.from_documents(document_objects, embeddings)

# # 저장 폴더 설정
# save_folder = "C:/Users/USER/Desktop/pjt/API/backend/ai_infer/vector_store/link_1"
# os.makedirs(save_folder, exist_ok=True)

# # 인덱스를 저장
# vectorstore.save_local(save_folder)
# print(f"인덱스를 {save_folder}에 저장했습니다.")