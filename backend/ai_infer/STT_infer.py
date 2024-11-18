import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
import os


# 모델과 프로세서를 로컬에 저장할 경로 설정
MODEL_DIR = r"C:\Users\USER\Desktop\pjt\API\backend\ai_infer\ai_models\stt_model"  # 원하는 로컬 저장 경로로 변경하세요

def load_model():
    # 로컬에 저장된 모델이 있는지 확인
    if not os.path.exists(MODEL_DIR):
        print("모델을 다운로드 중입니다...")
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            "openai/whisper-large-v3-turbo",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            low_cpu_mem_usage=True,
            use_safetensors=True
        )
        model.save_pretrained(MODEL_DIR)
        processor = AutoProcessor.from_pretrained("openai/whisper-large-v3-turbo")
        processor.save_pretrained(MODEL_DIR)
    else:
        print("로컬 모델을 로드 중입니다...")
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            MODEL_DIR,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        processor = AutoProcessor.from_pretrained(MODEL_DIR)

    return model, processor

def stt_result(wav_file):
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    model, processor = load_model()
    model.to(device)

    # 파이프라인 생성
    pipe = pipeline(
        "automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        device=device,
    )

    result = pipe(wav_file, return_timestamps=True)
    re_text = [chunk['text'] for chunk in result['chunks']]
    return re_text