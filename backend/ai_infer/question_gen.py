import os
import getpass
import re
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.document_loaders import PyPDFLoader

# OpenAI API Key 설정
os.environ['OPENAI_API_KEY'] = getpass.getpass('OpenAI API Key:')

# FAISS 벡터 스토어를 저장할 리스트 json로 하기 다시 생성
vectorstores = []

# 벡터 스토어 경로 리스트
folders = [
    "/kaggle/input/r-vector-store/vector_store/question_guide",
    "/kaggle/input/r-vector-store/vector_store/guideline",
    "/kaggle/input/8-sanghwang-vector-store/rr_vector_store/8_vector_store", 
    "/kaggle/input/8-sanghwang-vector-store/rr_vector_store/sanghwang_vector_store"
]

# 임베딩 모델 초기화
embeddings = OpenAIEmbeddings()

# 각 폴더의 FAISS 인덱스를 로드
for folder in folders:
    vectorstore = FAISS.load_local(folder, embeddings=embeddings, allow_dangerous_deserialization=True)
    vectorstores.append(vectorstore)

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

    총 6개의 질문을 생성해 주세요.
    """
)

# 자기소개서 텍스트 로드 및 분할
loader = PyPDFLoader('/kaggle/input/darun-saram-jagisoge-pdf/().pdf')
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
        "applicant_info": None,  # applicant_info는 question_chain 내부에서 추출
        "strengths_weaknesses": strengths_weaknesses_response,
        "real_experiences": real_experiences_response
    })

    # 결과 저장
    response_lst.append((question_response, strengths_weaknesses_response, real_experiences_response))

# 결과 출력 (6개의 질문을 포함한 4개의 질문 세트)
for i, (question_response, strengths_weaknesses_response, real_experiences_response) in enumerate(response_lst, 1):
    print(f"\nResponse Set {i} (질문 생성):\n{question_response.content}\n{'-'*30}\n")

# Mapping from question types in the data to desired categories
type_mapping = {
    '직무 역량 관련': '직무 역량 관련 질문',
    '기본 직무 역량 관련': '기본 직무 역량 관련 질문',
    '인성 관련': '인성 질문',
    '상황 제시형 질문': '기본 직무 역량 관련 질문',  # Assuming it maps here
    '돌발 질문': '돌발 질문',
    # You can add more mappings if needed
}

# Function to parse questions from the content
def parse_questions(content):
    # Split the content by '### 질문' with optional spaces and colons
    parts = re.split(r'###\s*질문\s*\d+\s*[:：]?\s*', content)
    questions = []
    question_numbers = re.findall(r'###\s*질문\s*(\d+)', content)
    
    for idx, part in enumerate(parts[1:]):  # Skip the first empty split
        lines = part.strip().split('\n', 3)
        if len(lines) < 3:
            continue
        # Extract question number
        question_num = int(question_numbers[idx])
        # Extract question type from the header
        header = lines[0].strip()
        question_type_raw = header
        question_type = type_mapping.get(question_type_raw.strip(), '기타 질문')
        # Extract question text
        question_line = lines[1]
        question_match = re.match(r'\*\*질문:\*\*\s*(.*)', question_line)
        question_text = question_match.group(1).strip() if question_match else ''
        # Extract grounds
        ground_line = lines[2]
        ground_match = re.match(r'-\s*\*\*근거:\*\*\s*(.*)', ground_line)
        ground_text = ground_match.group(1).strip() if ground_match else ''
        questions.append({
            'number': question_num,
            'type': question_type,
            'question': question_text,
            'ground': ground_text
        })
    return questions

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

# Function to select best questions
def select_best_questions(questions_by_type):
    final_best_questions = []
    # For '직무 역량 관련 질문' and '기본 직무 역량 관련 질문', pick 2 each
    for qtype in ['직무 역량 관련 질문', '기본 직무 역량 관련 질문']:
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

# Get the final best questions
best_questions = select_best_questions(questions_by_type)

# Print the best questions
print("\nBest Questions Set by Type (6 questions):\n")
for i, q in enumerate(best_questions, 1):
    print(f"Best Question {i}:")
    print(f"Type: {q['type']}")
    print(f"Question: {q['question']}")
    print(f"Ground: {q['ground']}")
    print('-'*30)

#질문 세트 8개
# 각 자기소개서 페이지 텍스트에 대해 정보 추출, 강점/약점 분석, 경험 추출 후 질문 생성
for idx, doc_text in enumerate(doc_lst, 1):
    doc_text_content = truncate_text(doc_text.page_content)  # 트렁케이션 적용
    
    # 두 번째 체인 실행: 강점 및 약점 분석
    strengths_weaknesses_response = strengths_weaknesses_chain.invoke({"doc_text": doc_text_content, "applicant_info": None})

    # 네 번째 체인 실행: 학문적 경험 및 실무 경험 추출
    real_experiences_response = academic_experience_chain.invoke({"doc_text": doc_text_content, "applicant_info": None})

    # 관련 텍스트 검색 및 길이 제한
    related_text = truncate_text(search_across_all_stores(doc_text_content))

    # 다섯 번째 체인 실행: 지원자 정보 추출 및 질문 생성
    question_response = question_chain.invoke({
        "doc_text": doc_text_content, 
        "guideline_texts": guideline_text + "\n\n" + related_text,
        "applicant_info": None,  # applicant_info는 question_chain 내부에서 추출
        "strengths_weaknesses": strengths_weaknesses_response,
        "real_experiences": real_experiences_response  # 추가된 변수
    })

    # 결과 저장
    response_lst.append((question_response, strengths_weaknesses_response, real_experiences_response))

# 생성된 질문 출력
for i, (question_response, strengths_weaknesses_response, real_experiences_response) in enumerate(response_lst, 1):
    print(f"\nResponse {i} (질문 생성):\n{question_response.content}\n{'-'*30}\n")


# 필요한 라이브러리 임포트
from sentence_transformers import SentenceTransformer, util
import numpy as np

# 이전 코드에서 생성된 response_lst를 사용한다고 가정합니다.
# 각 질문 세트에서 질문을 추출합니다.
question_sets = []

for i, (question_response, strengths_weaknesses_response, real_experiences_response) in enumerate(response_lst, 1):
    # 질문을 개별적으로 추출합니다.
    questions = question_response.content.strip().split('\n')
    # 빈 줄과 불필요한 공백을 제거합니다.
    questions = [q.strip() for q in questions if q.strip()]
    question_sets.append(questions)

# 사전 학습된 문장 임베딩 모델 로드
model = SentenceTransformer('all-MiniLM-L6-v2')

# 각 질문에 대한 임베딩 생성
question_embeddings = []

for questions in question_sets:
    embeddings = model.encode(questions, convert_to_tensor=True)
    question_embeddings.append(embeddings)

# 유사도 행렬 초기화
num_sets = len(question_sets)
similarity_matrix = np.zeros((num_sets, num_sets))

# 각 질문 세트 간의 유사도 계산
for i in range(num_sets):
    for j in range(i+1, num_sets):
        emb_i = question_embeddings[i]
        emb_j = question_embeddings[j]
        # 모든 질문 쌍에 대한 코사인 유사도 계산
        cosine_scores = util.cos_sim(emb_i, emb_j).numpy()
        # 세트 i의 각 질문이 세트 j의 질문들과 얼마나 유사한지의 최대값
        max_similarities_i = cosine_scores.max(axis=1)
        # 세트 j의 각 질문이 세트 i의 질문들과 얼마나 유사한지의 최대값
        max_similarities_j = cosine_scores.max(axis=0)
        # 최대 유사도의 평균 계산
        avg_max_similarity = (max_similarities_i.mean() + max_similarities_j.mean()) / 2
        # 유사도 행렬에 저장
        similarity_matrix[i,j] = avg_max_similarity
        similarity_matrix[j,i] = avg_max_similarity  # 대칭 행렬이므로

# 유사도 결과 출력
print("각 질문 세트 간의 유사도 (0과 1 사이의 값):\n")
for i in range(num_sets):
    for j in range(i+1, num_sets):
        print(f"세트 {i+1}와 세트 {j+1} 간의 유사도: {similarity_matrix[i,j]:.4f}")