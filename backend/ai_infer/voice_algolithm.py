import numpy as np
import librosa
import scipy.signal
from scipy.stats import entropy
import pandas as pd
import moviepy.editor as mvp
import os
import seaborn as sns
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

# 비디오 파일에서 wav 파일 추출
def extract_audio_from_video(video_file, output_folder):
    # 출력 폴더가 존재하지 않으면 생성
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # 비디오 파일 로드
    video = mvp.VideoFileClip(video_file)
    
    # 오디오 파일 이름 생성 (확장자 제거 후 .wav로 변경)
    wav_filename = os.path.splitext(os.path.basename(video_file))[0] + ".wav"
    wav_path = f'{output_folder}/{wav_filename}'
    
    # 오디오 추출 및 저장
    video.audio.write_audiofile(wav_path, codec='pcm_s16le')
    print(f"Extracted audio to {wav_path}")

class VocalTremorAnalyzer():
    def __init__(self, sample_rate=22050):
        self.sr = sample_rate

    def load_audio(self, wav_file):
        """WAV 파일을 로드하고 전처리"""
        y, sr = librosa.load(wav_file, sr=self.sr)
        return y
    def analyze_frequency_variation(self, y, frame_length=2048, hop_length=512):
        """주파수 변동 분석 (초 단위 결과 생성)"""
        f0, voiced_flag, voiced_probs = librosa.pyin(
            y,
            fmin=librosa.note_to_hz('C2'),
            fmax=librosa.note_to_hz('C7'),
            frame_length=frame_length,
            hop_length=hop_length
        )

        f0 = np.nan_to_num(f0, nan=0.0)
        results_per_sec = []

        for start in range(0, len(f0), int(self.sr / hop_length)):
            sec_f0 = f0[start:start + int(self.sr / hop_length)]
            if len(sec_f0) > 0:
                # nan 값을 포함하여 통계 계산
                freq_std = np.nanstd(sec_f0)  # nan-safe 표준 편차
                freq_variation = np.nanmean(np.abs(np.diff(sec_f0))) if len(sec_f0) > 1 else 0
                tremor_intensity = (np.nanmean(np.abs(np.diff(sec_f0))) / np.nanmean(sec_f0)
                                    if np.nanmean(sec_f0) > 0 else 0)

                results_per_sec.append({
                    'freq_std': freq_std,
                    'freq_variation': freq_variation,
                    'tremor_intensity': tremor_intensity
                })

        return results_per_sec

    # def analyze_frequency_variation(self, y, frame_length=2048, hop_length=512):
    #     """주파수 변동 분석 (초 단위 결과 생성)"""
    #     f0, voiced_flag, voiced_probs = librosa.pyin(y,
    #                                                  fmin=librosa.note_to_hz('C2'),
    #                                                  fmax=librosa.note_to_hz('C7'),
    #                                                  frame_length=frame_length,
    #                                                  hop_length=hop_length)
    #     # nan 제거 및 초당 결과 생성
    #     f0 = f0[~np.isnan(f0)]
    #     results_per_sec = []
        
    #     for start in range(0, len(f0), int(self.sr / hop_length)):
    #         sec_f0 = f0[start:start + int(self.sr / hop_length)]
    #         if len(sec_f0) > 0:
    #             results_per_sec.append({
    #                 'freq_std': np.std(sec_f0),
    #                 'freq_variation': np.abs(np.diff(sec_f0)).mean() if len(sec_f0) > 1 else 0,
    #                 'tremor_intensity': np.abs(np.diff(sec_f0)).mean() / np.mean(sec_f0) if np.mean(sec_f0) > 0 else 0
    #             })

    #     return results_per_sec

    def analyze_amplitude_modulation(self, y, frame_length=2048, hop_length=512):
        """진폭 변조 분석 (초 단위 결과 생성)"""
        envelope = np.abs(librosa.stft(y, n_fft=frame_length, hop_length=hop_length))
        envelope_mean = np.mean(envelope, axis=0)
        
        results_per_sec = []
        for start in range(0, len(envelope_mean), int(self.sr / hop_length)):
            sec_envelope = envelope_mean[start:start + int(self.sr / hop_length)]
            if len(sec_envelope) > 0:
                fft_envelope = np.abs(np.fft.fft(sec_envelope))
                freqs = np.fft.fftfreq(len(fft_envelope), 1 / self.sr)
                tremor_range = (freqs >= 4) & (freqs <= 12)
                tremor_energy = np.sum(fft_envelope[tremor_range])
                total_energy = np.sum(fft_envelope)
                modulation_index = tremor_energy / total_energy if total_energy > 0 else 0
                
                results_per_sec.append({
                    'modulation_index': modulation_index,
                    'tremor_energy': tremor_energy
                })

        return results_per_sec

    def analyze_spectral_entropy(self, y, frame_length=2048, hop_length=512):
        """스펙트럴 엔트로피 분석 (초 단위 결과 생성)"""
        D = librosa.stft(y, n_fft=frame_length, hop_length=hop_length)
        magnitude = np.abs(D)
        
        results_per_sec = []
        for start in range(0, magnitude.shape[1], int(self.sr / hop_length)):
            frame = magnitude[:, start:start + int(self.sr / hop_length)]
            spectral_entropy = [entropy(frame_col / np.sum(frame_col)) for frame_col in frame.T if np.sum(frame_col) > 0]
            
            if spectral_entropy:
                results_per_sec.append({
                    'entropy_std': np.std(spectral_entropy),
                    'entropy_rate': np.mean(np.abs(np.diff(spectral_entropy)))
                })

        return results_per_sec

    def analyze_wav_files(self, wav_files):
        """초 단위 분석 결과를 데이터프레임으로 반환"""
        all_results = []
        
        for wav_file in wav_files:
            y = self.load_audio(wav_file)
            freq_results = self.analyze_frequency_variation(y)
            amp_results = self.analyze_amplitude_modulation(y)
            entropy_results = self.analyze_spectral_entropy(y)

            # 각 분석 결과 합침
            for i in range(min(len(freq_results), len(amp_results), len(entropy_results))):
                result = {
                    'file_name': wav_file,
                    **freq_results[i],
                    **amp_results[i],
                    **entropy_results[i]
                }
                all_results.append(result)
        
        return pd.DataFrame(all_results)
    

# 선 그래프 그리기
def plot_tension_distribution_line(metrics, metric_names, output_folder, video, emo_label, colors="#9137fc"):
    video_name = video.split('.')[-2]  # 비디오 이름 추출
    top_indices = []

    for i, (metric, name) in enumerate(zip(metrics, metric_names)):
        
        # 모든 metrics에 scaled_metric 적용
        scaled_metric = [
            val * 1.2 if label == "bad" else val
            for val, label in zip(metric, emo_label)
        ]

        if name == "Entropy Std":
            top_indices = [idx for idx, _ in sorted(enumerate(scaled_metric), key=lambda x: x[1], reverse=True)[:2]]

        if name == 'Entropy Std':
            plt.figure(figsize=(15, 6))
        if name == "Frequency Variation":
            plt.figure(figsize=(10, 6))
        plt.plot(scaled_metric, label=name, color=colors, marker='o', linestyle='-')
        
        # 특정 지표(`entropy_std`)에만 일반적인 감정 상태 범위를 시각화
        if name == "Entropy Std":
            plt.axhspan(0.2, 0.5, color="green", alpha=0.1, label="Calm/Neutral (0.2 ~ 0.5)")
            # plt.axhspan(0.1, 0.2, color="green", alpha=0.1, label="Calm/Neutral (0.2 or below)")
            # plt.axhspan(0.5, 1.0, color="red", alpha=0.1, label="Strong Emotion (0.5 or above)")

        if name == "Frequency Variation":
            plt.axhspan(2, 5, color="green", alpha=0.1, label="Calm/Neutral (2 ~ 5)")
            
        # 축 및 제목 설정
        plt.grid(True, linestyle="--", alpha=0.5)
        # plt.legend(loc="upper left")

        # ent_output_path = ''
        # ent_output_db_path = ''
        if name == "Entropy Std":
            print('엔트로피요~~~~~~~~~~~')
            output_path_ent = f'C:/Users/USER/Desktop/pjt/API/backend/media/graph/anxiety'
            os.makedirs(output_path_ent, exist_ok=True)
            ent_output_graph_path = f'{output_path_ent}/{name}_{video_name}'
            ent_output_path = ent_output_graph_path
            ent_output_db_path = f'graph/anxiety/{name}_{video_name}.png'
            plt.savefig(ent_output_graph_path, bbox_inches='tight')
            plt.close()
            # print(f"Graph saved to {output_path}")
        # fre_output_path = ''
        # fre_output_db_path = ''
        if name == "Frequency Variation":
            print('프리퀀시요~~~~~~~~~~')
            output_path_fre = f"C:/Users/USER/Desktop/pjt/API/backend/media/graph/voice"
            os.makedirs(output_path_fre, exist_ok=True)
            fre_output_graph_path = f'{output_path_fre}/{name}_{video_name}'
            fre_output_path = fre_output_graph_path
            fre_output_db_path = f'graph/voice/{name}_{video_name}.png'
            plt.savefig(fre_output_graph_path, bbox_inches='tight')
            plt.close()
            # print(f"Graph saved to {output_path}")
    
    # print('아웃풋 패쓰 리스트', output_path_list)
    # print('아웃풋 패쓰 디비리스트', output_path_db_list)
    return ent_output_path + '.png', fre_output_path + '.png', ent_output_db_path, fre_output_db_path, top_indices