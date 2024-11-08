import numpy as np
import librosa
import scipy.signal
from scipy.stats import entropy
import pandas as pd
import moviepy.editor as mvp
import os
import seaborn as sns
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
        print(wav_file)
        y, sr = librosa.load(wav_file, sr=self.sr)
        return y
    
    def method1_frequency_variation(self, y, frame_length=2048, hop_length=512):
        """방법 1: 기본 주파수(F0) 변동 분석
        주파수 변화량을 측정하여 떨림 정도를 분석
        """
        # F0 추출
        f0, voiced_flag, voiced_probs = librosa.pyin(y,
                                                    fmin=librosa.note_to_hz('C2'),
                                                    fmax=librosa.note_to_hz('C7'),
                                                    frame_length=frame_length,
                                                    hop_length=hop_length)
        
        # nan 값 제거
        f0 = f0[~np.isnan(f0)]
        
        if len(f0) == 0:
            return {
                'freq_std': 0,
                'freq_variation': 0,
                'tremor_intensity': 0
            }
        
        # 주파수 변동 지표 계산
        freq_std = np.std(f0)  # 주파수 표준편차
        freq_variation = np.abs(np.diff(f0)).mean()  # 주파수 변화량
        tremor_intensity = freq_variation / np.mean(f0) if np.mean(f0) > 0 else 0
        
        return {
            'freq_std': freq_std,
            'freq_variation': freq_variation,
            'tremor_intensity': tremor_intensity
        }
    
    def method2_amplitude_modulation(self, y, frame_length=2048, hop_length=512):
        """방법 2: 진폭 변조 분석
        음성 신호의 포락선(envelope)을 추출하여 진폭 변화를 분석
        """
        # 신호의 포락선 추출
        envelope = np.abs(librosa.stft(y, n_fft=frame_length, hop_length=hop_length))
        envelope_mean = np.mean(envelope, axis=0)
        
        # 진폭 변조 주파수 분석 (4-12Hz 범위의 떨림)
        # fft_envelope 길이에 맞게 freqs 배열 생성
        fft_envelope = np.abs(np.fft.fft(envelope_mean))
        freqs = np.fft.fftfreq(len(fft_envelope), 1 / self.sr)
        
        # 4-12Hz 범위의 에너지 계산
        tremor_range = (freqs >= 4) & (freqs <= 12)
        tremor_energy = np.sum(fft_envelope[tremor_range])
        total_energy = np.sum(fft_envelope)
        
        modulation_index = tremor_energy / total_energy if total_energy > 0 else 0
        
        return {
            'modulation_index': modulation_index,
            'tremor_energy': tremor_energy
        }

    
    def method3_spectral_entropy(self, y, frame_length=2048, hop_length=512):
        """방법 3: 스펙트럴 엔트로피 분석
        주파수 도메인에서의 불규칙성을 측정
        """
        # STFT 계산
        D = librosa.stft(y, n_fft=frame_length, hop_length=hop_length)
        magnitude = np.abs(D)
        
        # 각 프레임별 스펙트럴 엔트로피 계산
        spectral_entropy = []
        for frame in magnitude.T:
            prob = frame / np.sum(frame)
            spectral_entropy.append(entropy(prob))
        
        # 엔트로피 변동성 계산
        entropy_std = np.std(spectral_entropy)
        entropy_rate = np.mean(np.abs(np.diff(spectral_entropy)))
        
        return {
            'entropy_std': entropy_std,
            'entropy_rate': entropy_rate
        }
    
    def analyze_wav_files(self, wav_files):
        """여러 WAV 파일의 떨림 분석"""
        results = []
        
        for wav_file in wav_files:
            y = self.load_audio(wav_file)
            
            # 각 방법으로 분석 수행
            freq_analysis = self.method1_frequency_variation(y)
            amp_analysis = self.method2_amplitude_modulation(y)
            entropy_analysis = self.method3_spectral_entropy(y)
            
            # 결과 통합
            result = {
                'file_name': wav_file,
                **freq_analysis,
                **amp_analysis,
                **entropy_analysis
            }
            results.append(result)
        
        return pd.DataFrame(results)
    


# def plot_custom_distribution(data, output_folder, video, title="Distribution Plot", color="#9137fc"):
#     video_name = video.split('.')[-2]
#     # 데이터 히스토그램 계산
#     counts, bins = np.histogram(data, bins=20)
    
#     # 그래프 설정
#     plt.figure(figsize=(8, 5))
#     ax = plt.gca()
    
#     # 각 빈의 막대 생성
#     for i in range(len(bins) - 1):
#         if counts[i] != 0:
#             x = bins[i]
#             width = bins[i + 1] - bins[i]
#             height = counts[i]
#             rounding_size = height * 0.000125
            
#             # 둥근 모서리를 가진 막대 생성
#             rect = FancyBboxPatch(
#                 (x, 0), width, height,
#                 boxstyle=f"round,pad=0,rounding_size={rounding_size}",
#                 edgecolor="white", facecolor=color, zorder=5
#             )
#             ax.add_patch(rect)

#     # 축 범위 설정
#     ax.set_xlim(bins[0], bins[-1])
#     ax.set_ylim(0, max(counts) + 2)

#     # y축 격자 표시
#     plt.grid(axis='y', linestyle='--', alpha=0.5)
#     plt.grid(False, axis='x')

#     # 그래프 제목 설정
#     plt.title(title)
    
#     # 그래프 저장 경로
#     if not os.path.exists(output_folder):
#         os.makedirs(output_folder)
#     output_path = os.path.join(output_folder, f"voice_{video_name}.png")
#     plt.savefig(output_path, bbox_inches='tight')
#     plt.close()
#     print(f"Graph saved to {output_path}")
def plot_tension_distribution(metrics, metric_names, output_folder, video, color="#9137fc"):
    video_name = video.split('.')[-2]
    
    # 개별 메트릭에 대해 히스토그램 생성
    for metric, name in zip(metrics, metric_names):
        counts, bins = np.histogram(metric, bins=20)
        
        # 그래프 설정
        plt.figure(figsize=(8, 5))
        ax = plt.gca()
        
        # 각 빈의 막대 생성
        for i in range(len(bins) - 1):
            if counts[i] != 0:
                x = bins[i]
                width = bins[i + 1] - bins[i]
                height = counts[i]
                rounding_size = height * 0.000125
                
                # 둥근 모서리를 가진 막대 생성
                rect = FancyBboxPatch(
                    (x, 0), width, height,
                    boxstyle=f"round,pad=0,rounding_size={rounding_size}",
                    edgecolor="white", facecolor=color, zorder=5
                )
                ax.add_patch(rect)

        # 축 범위 설정
        ax.set_xlim(bins[0], bins[-1])
        ax.set_ylim(0, max(counts) + 2)

        # y축 격자 표시
        plt.grid(axis='y', linestyle='--', alpha=0.5)
        plt.grid(False, axis='x')

        # 그래프 제목 설정
        plt.title(f"Distribution of {name}")
        
        # 그래프 저장 경로 설정 및 저장
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        output_path = f"{output_folder}/{name}_{video_name}.png"
        plt.savefig(output_path, bbox_inches='tight')
        plt.close()
        print(f"Graph saved to {output_path}")