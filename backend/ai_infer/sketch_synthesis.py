import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import os

def sketch_synthesis(value_list, interview_id, type):
    # 데이터 및 범주 설정
    categories = ['Q7', 'Q6', 'Q5', 'Q4', 'Q3', 'Q2', 'Q1']

    # figure와 axes 객체 생성
    fig, ax = plt.subplots(figsize=(18, 6))

    # 막대를 둥근 모서리로 가로로 그리기
    y_positions = []
    for i, (category, value) in enumerate(zip(categories, value_list)):
        y = i - 0.4  # 막대의 세로 위치 (중앙 정렬)
        y_positions.append(y + 0.25)  # y 위치에 막대 중심값 추가
        width = value  # 막대의 길이 (비율 값)

        # 둥근 모서리 설정
        rounding_size = width * 0.000125  # rounding 크기 조절

        # 막대 그리기
        color = '#9137fc' if category == 'Good' else '#9137fc'
        rect = FancyBboxPatch(
            (0, y), width, 0.5,
            boxstyle=f"round,pad=0,rounding_size={rounding_size}",
            edgecolor="white", facecolor=color, zorder=3
        )
        ax.add_patch(rect)

    # y축 레이블을 막대 중앙에 설정
    ax.set_yticks(y_positions)
    ax.set_yticklabels(categories)

    # x축 최대값 설정
    max_value = max(value_list)  # value_list의 최대값
    ax.set_xlim(0, max_value + (max_value * 0.1))  # x축 범위 설정: 최대값 + 2

    # 좌우 여백 추가
    ax.margins(y=0.1)  # y축에 여백 추가

    if sum(value_list) > 0 :
        # 가장 큰 값과 두 번째로 큰 값의 인덱스를 찾기
        top_indices = [7 - idx for idx, _ in sorted(enumerate(value_list), key=lambda x: x[1], reverse=True)[:2]]
    else:
        top_indices = [0, 0]
        
    # 저장 경로 설정 및 저장
    synthesis_path = 'C:/Users/USER/Desktop/pjt/API/backend/media/graph/synthesis'
    os.makedirs(synthesis_path, exist_ok=True)
    synthesis_graph_path = f'{synthesis_path}/{interview_id}_{type}.png'
    synthesis_graph_image_path = f'graph/synthesis/{interview_id}_{type}.png'
    plt.savefig(synthesis_graph_path, bbox_inches='tight')
    plt.close()


    return synthesis_graph_path, synthesis_graph_image_path, top_indices

# 테스트 실행
# a, b, c = sketch_synthesis([5, 2, 3, 4, 5, 6, 7][::-1], 1, 'eye')
# print(c)