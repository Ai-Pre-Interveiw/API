import os
import sys
import django
import openai
import numpy as np
from django.conf import settings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 프로젝트 루트 디렉토리를 sys.path에 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Django 설정 초기화
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'API.settings')
django.setup()

# OpenAI API 키 설정
openai.api_key = settings.OPENAI_API_KEY

# 질문-답변 데이터와 코멘트 데이터가 저장된 폴더들
question_folder = r"C:\Users\USER\Desktop\pjt\API\backend\ai_infer\vector_store\jobk_q"
answer_folder = r"C:\Users\USER\Desktop\pjt\API\backend\ai_infer\vector_store\jobk_a"
comment_folder = r"C:\Users\USER\Desktop\pjt\API\backend\ai_infer\vector_store\jobk_c"

# 임베딩 모델 초기화
embeddings = OpenAIEmbeddings()

# FAISS 인덱스 로드
question_vectorstore = FAISS.load_local(question_folder, embeddings=embeddings, allow_dangerous_deserialization=True)
answer_vectorstore = FAISS.load_local(answer_folder, embeddings=embeddings, allow_dangerous_deserialization=True)
comment_vectorstore = FAISS.load_local(comment_folder, embeddings=embeddings, allow_dangerous_deserialization=True)

# 모든 문서 ID를 출력
# print("Question Vectorstore IDs:")
# print(question_vectorstore.docstore._dict.get('d80350ed-2721-48be-b457-144e09b850d8'))
# for doc_id in question_vectorstore.docstore._dict.get('d80350ed-2721-48be-b457-144e09b850d8'):
#     print(doc_id)
#     break

# print("\nAnswer Vectorstore IDs:")
# print(answer_vectorstore.docstore._dict.get('e8999ef6-3554-4cad-b908-fc2bae2ed783'))
# for doc_id in answer_vectorstore.docstore._dict.get('e8999ef6-3554-4cad-b908-fc2bae2ed783'):
#     print(doc_id)
#     break

def get_all_embeddings_and_docs(vectorstore):
    num_vectors = vectorstore.index.ntotal
    all_embeddings = vectorstore.index.reconstruct_n(0, num_vectors)
    all_docs = list(vectorstore.docstore._dict.values())
    return np.array(all_embeddings), all_docs

def inner_product_search(vectorstore, query_text, k):
    query_embedding = embeddings.embed_query(query_text)
    all_vectors, all_docs = get_all_embeddings_and_docs(vectorstore)
    similarities = np.dot(all_vectors, query_embedding)
    
    # 유사도가 0.85 이상인 항목만 필터링하고, 큰 순서대로 상위 k개 선택
    top_k_indices = np.argsort(similarities)[::-1]
    top_k_docs_with_scores = [(all_docs[i], similarities[i]) for i in top_k_indices if similarities[i] >= 0.85]
    
    # 상위 k개로 제한
    top_k_docs_with_scores = top_k_docs_with_scores[:k]
    
    return top_k_docs_with_scores

def search_and_generate_comment(question, answer, top_k=1):
    question_query_text = f"{question}"
    answer_query_text = f"{answer}"
    q_results_with_scores = inner_product_search(question_vectorstore, question_query_text, 30)
    print(len(q_results_with_scores))
    matching_answers = []

    # 상위 30개의 질문에 대해 관련 답변을 찾음
    for q_result, q_score in q_results_with_scores:
        # print(q_result)
        q_doc_content = q_result.metadata.get("question")
        q_doc_id = q_result.metadata.get('index')
        if q_doc_id:
            for a_doc in answer_vectorstore.docstore._dict.values():
                if a_doc.metadata.get("index") == q_doc_id and a_doc.metadata.get('question') == q_doc_content:
                    matching_answers.append(a_doc)

    print(len(matching_answers))
    temp_vectorstore = FAISS.from_documents(matching_answers, embeddings)

    # 각 질문에 대해 관련 상위 5개의 답변을 찾음
    related_answers_with_scores = inner_product_search(temp_vectorstore, answer_query_text, 5)
    # print(related_answers_with_scores)

    matched_pairs = []  # 매칭된 질문, 답변, 유사도 저장
    similar_comments = []
    # 질문과 관련된 상위 5개의 답변을 매칭하여 저장
    for answer_doc, score in related_answers_with_scores:
        matched_pairs.append((answer_doc.metadata.get('question'), answer_doc.page_content, score))
        a_doc_content = answer_doc.metadata.get("answer")
        a_doc_id = answer_doc.metadata.get('index')
        if a_doc_id:
            for c_doc in comment_vectorstore.docstore._dict.values():
                if c_doc.metadata.get('index') == a_doc_id and c_doc.metadata.get('answer') == a_doc_content:
                    similar_comments.append((c_doc.metadata.get('question'), c_doc.page_content, c_doc.metadata.get('answer'), c_doc.metadata.get('good_points'), c_doc.metadata.get('improvements')))

    
    # 상위 30개의 질문 출력
    print('--------------------------top 30 질문 유사도------------------------------------')
    for i, (q_result, q_score) in enumerate(q_results_with_scores, 1):
        print(f"\n질문 {i} (유사도 점수: {q_score:.4f}):\n{q_result.page_content}")


    # 각 질문과 관련된 상위 5개의 답변 출력
    print("\n-------------------------top 5 질문&답변 유사도---------------------------------")
    for i, (q_content, answer_content, score) in enumerate(matched_pairs, 1):
        print(f"\n매칭 {i}번 관련 질문:\n{q_content}")
        print(f"매칭 {i}번 관련 답변 (유사도 점수: {score:.4f}):\n{answer_content}")

    q1 = ''
    a1 = ''
    g1 = ''
    b1 = ''
    q2 = ''
    a2 = ''
    g2 = ''
    b2 = ''
    q3 = ''
    a3 = ''
    g3 = ''
    b3 = ''
    q4 = ''
    a4 = ''
    g4 = ''
    b4 = ''
    q5 = ''
    a5 = ''
    g5 = ''
    b5 = ''
    print("\n-------------------------top 5 질문&답변&코멘트---------------------------------")
    for i, (q, c, a, g, b) in enumerate(similar_comments, 1):
        print(f'질문 : {q}')
        print(f'답변 : {a}')
        print(f'코멘트 : {c}')
        print(f'긍정 코멘트 : {g}')
        print(f'부정 코멘트 : {b}')
        print()
        if i == 0:
            q1 = q
            a1 = a
            b1 = b
            g1 = g
        elif i == 1:
            q2 = q
            a2 = a
            b2 = b
            g2 = g
        elif i == 2:
            q3 = q
            a3 = a
            b3 = b
            g3 = g
        elif i == 3:
            q4 = q
            a4 = a
            b4 = b
            g4 = g
        elif i == 4:
            q5 = q
            a5 = a
            b5 = b
            g5 = g

    if similar_comments:

        prompt = f"""
        다음은 다양한 면접 자기소개서에서 추출한 데이터로, 현재 지원자가 면접에서 받은 질의응답과 가장 유사한 질문-답변-코멘트 세트 입니다:
        질문: {q1}
        답변: {a1}
        좋은점: {g1}
        아쉬운점: {b1}

        질문: {q2}
        답변: {a2}
        좋은점: {g2}
        아쉬운점: {b2}

        질문: {q3}
        답변: {a3}
        좋은점: {g3}
        아쉬운점: {b3}

        질문: {q4}
        답변: {a4}
        좋은점: {g4}
        아쉬운점: {b4}

        질문: {q5}
        답변: {a5}
        좋은점: {g5}
        아쉬운점: {b5}
        
        NaN은 좋은점 또는 아쉬운점이 없다는 뜻 입니다.
        생성될 코멘트들은 지원자의 답변에 대한 꼬리질문 생성을 위해 참고자료로 쓰일 코멘트이니, 코멘트를 통해 키워드가 아닌 의미상의 꼬리질문을 생성할 수 있도록
        샘플 5개를 Few shot learning 한 후, 지원자의 질의응답을 바탕으로 코멘트를 생성하세요.
        질문: {question}
        답변: {answer}
        
        답변에 대해 좋은점이 없다고 생각되면 NaN을 출력하세요.
        답변에 대해 아쉬운점이 없다고 생각되면 NaN을 출력하세요.

        좋은점:
        아쉬운점:
        """
        
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
        response = llm(prompt)
        generated_comment = response.content
        
        tail_prompt = f"""
        다음은 면접 질문과 지원자의 답변입니다:
        질문: {question}
        답변: {answer}
        
        그리고 이에 대한 코멘트입니다:
        {generated_comment}
        
        지원자의 질의응답에 대한  코멘트 내용을 기반으로, 지원자의 답변에 대해 꼬리 질문을 생성해 주세요.
        코멘트가 NaN이라면 꼬리질문을 생성하지 않아도 됩니다.
        
        추가 질문:
        """
        
        tail_questions_response = llm(tail_prompt)
        tail_questions = tail_questions_response.content
        # return '성공'
        return tail_questions, generated_comment
    else:
        prompt = f"""
        다음은 다양한 면접 자기소개서에서 추출한 데이터로, 현재 지원자가 면접에서 받은 질의응답과 가장 유사한 질문-답변-코멘트 세트 입니다:
        질문: {q1}
        답변: {a1}
        좋은점: {g1}
        아쉬운점: {b1}

        질문: {q2}
        답변: {a2}
        좋은점: {g2}
        아쉬운점: {b2}

        질문: {q3}
        답변: {a3}
        좋은점: {g3}
        아쉬운점: {b3}

        질문: {q4}
        답변: {a4}
        좋은점: {g4}
        아쉬운점: {b4}

        질문: {q5}
        답변: {a5}
        좋은점: {g5}
        아쉬운점: {b5}
        
        NaN은 좋은점 또는 아쉬운점이 없다는 뜻 입니다.
        생성될 코멘트들은 지원자의 답변에 대한 꼬리질문 생성을 위해 참고자료로 쓰일 코멘트이니, 코멘트를 통해 키워드가 아닌 의미상의 꼬리질문을 생성할 수 있도록
        위의 예시 5개를 Few shot Prompting 한 후, 지원자의 질의응답을 바탕으로 코멘트를 생성하세요.
        질문: {question}
        답변: {answer}
        
        답변에 대해 좋은점이 없다고 생각되면 NaN을 출력하세요.
        답변에 대해 아쉬운점이 없다고 생각되면 NaN을 출력하세요.

        좋은점:
        아쉬운점:
        """
        
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
        response = llm(prompt)
        generated_comment = response.content
        
        return "유사한 코멘트가 없어 꼬리질문을 찾을 수 없습니다.", generated_comment

# # 예시 질문과 답변
# question = '상사가 부당한 지시를 한다면 어떻게 대처할 것인가요?'
# answer = """
# 일단 상사의 지시가 제 개인적인 피해를 주는지 회사의 피해를 주는지 생각해 볼 것입니다.
# 제 개인적인 피해를 주는 지시라면 묵묵히 상사의 지시를 따라야 겠지만 회사에 피해를 주는 지시라면 주변 동료들과 상의하여 문제를 해결할 것 같습니다.
# """

# # 예시 질문과 답변
# question = '상사가 개인적인 업무나 부당한 지시를 한다면 어떻게 대처하시겠습니까?'
# answer = """
# 우선 제 상사이기 때문에, 할 수 있는 일이라면 진행을 하겠습니다.
# 다만 이 일이 '저'에게만 피해가 가는게 아니라
# '회사에' 피해가 간다면 혼자서 판단할 수 있는 문제가 아니기 때문에, 
# 다른 회사 동료분들이나 상사분께 여쭈어 본 다음에 일을 진행하도록 하겠습니다.
# """

# # 실행
# tail_questions, generated_comment = search_and_generate_comment(question, answer)
# print('------------------------------------------------')
# print("생성된 코멘트:\n", generated_comment)
# print()
# print("생성된 꼬리 질문:\n", tail_questions)
# print('------------------------------------------------')
