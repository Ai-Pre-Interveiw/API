from pathlib import Path
import os
from openai import OpenAI
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

def tts_infer(text, id):

    # 환경 변수에서 API 키 가져오기
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key)
    
    speech_path = 'C:/Users/USER/Desktop/pjt/API/backend/media/questions/audio'
    os.makedirs(speech_path, exist_ok=True)
    tts_name = f'{id}.mp3'
    speech_file_path = speech_path + '/' + tts_name
    response = client.audio.speech.create(
        model="tts-1-hd",
        voice="onyx",
        input=text
    )

    response.stream_to_file(speech_file_path)

    tts_file_path = f'questions/audio/{id}.mp3'

    return speech_file_path, tts_file_path