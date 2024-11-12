import os
import getpass
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_text_splitters import CharacterTextSplitter
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# OpenAI API 키 설정
# os.environ['OPENAI_API_KEY'] = getpass.getpass('OpenAI API Key:')

vectorstores = []

folders = [
    "/kaggle/input/r-vector-store/vector_store/job_korea_1",
    "/kaggle/input/r-vector-store/vector_store/job_korea_2",
    "/kaggle/input/r-vector-store/vector_store/link_1", 
    "/kaggle/input/r-vector-store/vector_store/link_2",
    "/kaggle/input/r-vector-store/vector_store/link_3",
]

embeddings = OpenAIEmbeddings()

for folder in folders:
    vectorstore = FAISS.load_local(folder, embeddings=embeddings, allow_dangerous_deserialization=True)
    vectorstores.append(vectorstore)

def search_across_all_stores(query_text, top_k=3):
    all_results = []
    for vectorstore in vectorstores:
        results = vectorstore.similarity_search(query_text, k=top_k)
        all_results.extend(results)
    return "\n\n".join([doc.page_content for doc in all_results]), all_results

def truncate_text(text, max_length=2000):
    return text[:max_length] if len(text) > max_length else text

question = '상사가 개인적인 업무나 부당한 지시를 한다면 어떻게 대처하시겠습니까?'
answer1 = """
우선 제 상사이기 때문에, 할 수 있는 일이라면 진행을 하겠습니다.
다만 이 일이 '저'에게만 피해가 가는게 아니라
'회사에' 피해가 간다면 혼자서 판단할 수 있는 문제가 아니기 때문에, 
다른 회사 동료분들이나 상사분께 여쭈어 본 다음에 일을 진행하도록 하겠습니다.
"""
guide_query = """This gpt is the company's human resources manager and 
is an interviewer who judges the appropriateness of the answers to the questions asked by the applicants."""
query = question
question_guide, r_result = search_across_all_stores(query)
r_guide_query = search_across_all_stores(guide_query)

# 분할 설정
text_splitter = CharacterTextSplitter(
    separator='',
    chunk_size=500,
    chunk_overlap=100,
    length_function=len,
)
rr_guide = r_guide_query[0]
# 문자열 데이터를 분할
texts = text_splitter.split_text(question_guide)
keys = text_splitter.split_text(rr_guide)
# 텍스트와 키를 합침
tekeys = texts + keys

def extract_keywords(text):
    from konlpy.tag import Okt
    okt = Okt()
    nouns = okt.nouns(text)
    keywords = list(set(nouns))
    return keywords

def similarity_score(keyword, text):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([keyword, text])
    vector_values = vectors.toarray()
    score = cosine_similarity([vector_values[0]], [vector_values[1]])[0][0]
    return score

def generate_tail_questions(keywords, answer_text, max_questions=5):
    all_tail_questions = []
    for keyword in keywords:
        sim_score = similarity_score(keyword, answer_text)
        # 키워드에 따라 다양한 꼬리 질문을 생성하고 keyword 변수를 사용해 질문에 키워드를 넣음
        questions = [
            f"'{keyword}'에 대해 좀 더 자세히 설명해 주실 수 있나요?",
            f"'{keyword}'와 관련된 구체적인 경험이 있으신가요?",
            f"'{keyword}'을(를) 처리한 다른 사례를 말씀해 주세요.",
            f"이전의 '{keyword}' 관련된 상황을 공유해 주실 수 있나요?",
            f"이런 '{keyword}' 문제를 해결하기 위해 어떤 방법을 사용했나요?",
        ]
        # 유사도가 낮을수록 우선적으로 질문을 추가
        weighted_questions = [(q, sim_score) for q in questions]
        all_tail_questions.extend(weighted_questions)

    # 유사도를 기준으로 가장 적합한 질문을 선택하여 출력
    sorted_questions = sorted(all_tail_questions, key=lambda x: x[1])
    top_questions = [q for q, _ in sorted_questions[:max_questions]]
    
    return top_questions

def question_answer_chain(question, answer, rag_query):
    # 시스템 메시지에 rag_query 포함
    system_message = f"""
당신은 회사의 인사 담당자이며, 지원자가 제출한 질문과 답변 쌍을 평가하는 인터뷰어입니다.
지원자의 답변에서 키워드를 추출하고, 각 키워드의 답변 내 근거를 분석합니다.
답변 내에 키워드의 근거가 부족하다면 해당 키워드에 대한 꼬리 질문을 생성합니다.
평가 절차:
1. 지원자의 답변이 질문에 성실하게 답했는지 평가합니다.
2. 답변에서 키워드를 추출합니다.
3. 각 키워드에 대해 답변 내에서의 근거를 분석하고, 유사도가 낮은 키워드에 대해 추가 질문을 생성합니다.
모든 출력은 한국어로 작성되어야 합니다.
예시: {rag_query}
"""

    prompt_template = PromptTemplate.from_template("질문: {question}\n답변: {answer}")
    formatted_prompt = prompt_template.format(question=question, answer=answer)

    llm = ChatOpenAI(model='gpt-4', temperature=0.7)

    chat_prompt = ChatPromptTemplate.from_messages([
        ('system', system_message),
        ('user', formatted_prompt)
    ])

    chain = chat_prompt | llm

    # 초기 결과 반환
    initial_result = chain.invoke({}).content

    # 키워드 추출
    keywords = extract_keywords(answer)
    # 꼬리 질문 생성 (가장 적합한 질문 5개 선택)
    tail_questions = generate_tail_questions(keywords, answer, max_questions=5)
    
    # 최종 결과 구성
    final_result = f"{initial_result}\n\n추가 질문:\n"
    for idx, q in enumerate(tail_questions, 1):
        final_result += f"{idx}. {q}\n"
    # 마지막 불필요한 두 줄 제거
    final_result_lines = final_result.splitlines()
    final_output = "\n".join(final_result_lines[:-6])

    return final_output

# 실행
result = question_answer_chain(question, answer1, tekeys)
print(result)