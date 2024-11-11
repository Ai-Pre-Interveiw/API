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
        f0, voiced_flag, voiced_probs = librosa.pyin(y,
                                                     fmin=librosa.note_to_hz('C2'),
                                                     fmax=librosa.note_to_hz('C7'),
                                                     frame_length=frame_length,
                                                     hop_length=hop_length)
        # nan 제거 및 초당 결과 생성
        f0 = f0[~np.isnan(f0)]
        results_per_sec = []
        
        for start in range(0, len(f0), int(self.sr / hop_length)):
            sec_f0 = f0[start:start + int(self.sr / hop_length)]
            if len(sec_f0) > 0:
                results_per_sec.append({
                    'freq_std': np.std(sec_f0),
                    'freq_variation': np.abs(np.diff(sec_f0)).mean() if len(sec_f0) > 1 else 0,
                    'tremor_intensity': np.abs(np.diff(sec_f0)).mean() / np.mean(sec_f0) if np.mean(sec_f0) > 0 else 0
                })

        return results_per_sec

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


def plot_tension_distribution_dual_line(metrics, metric_names, output_folder, video, colors=["#9137fc", "#37fc91"]):
    video_name = video.split('.')[-2]
    
    # 그래프 설정
    plt.figure(figsize=(10, 6))

    # 각 메트릭에 대해 히스토그램 생성 후 선 그래프 그리기
    for metric, name, color in zip(metrics, metric_names, colors):
        counts, bins = np.histogram(metric, bins=20)
        bin_centers = 0.5 * (bins[1:] + bins[:-1])  # bin 중심값 계산

        # 선 그래프 추가
        plt.plot(bin_centers, counts, label=name, color=color, marker='o', linestyle='-', linewidth=2, markersize=5)

    # 축 및 제목 설정
    plt.xlabel("Value")
    plt.ylabel("Frequency")
    plt.title(f"Distribution of {metric_names[0]} and {metric_names[1]}")
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)

    # 그래프 저장 경로 설정 및 저장
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    output_path = f"{output_folder}/{metric_names[0]}_{metric_names[1]}_{video_name}.png"
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Graph saved to {output_path}")

# 선 그래프 그리기
def plot_tension_distribution_line(metrics, metric_names, output_folder, video, colors="#9137fc"):
    video_name = video.split('.')[-2]  # 비디오 이름 추출

    # 그래프 설정
    plt.figure(figsize=(15, 6))

    # 각 메트릭에 대해 선 그래프 생성
    for i, (metric, name) in enumerate(zip(metrics, metric_names)):
        plt.plot(metric, label=name, color=colors, marker='o', linestyle='-')

    # 축 및 제목 설정
    # plt.xlabel("Sample Index")
    # plt.ylabel("Value")
    # plt.title(f"{metric_names[0]} Comparison")
    # plt.legend()
    plt.grid(True, linestyle="--", alpha=0.5)

    # 그래프 저장 경로 생성 및 저장
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    output_path = f"{output_folder}/{metric_names[0]}_{video_name}.png"
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Graph saved to {output_path}")

    return output_path, f'graph/anxiety/{metric_names[0]}_{video_name}.png'


def plot_tension_distribution_entropy(metric, metric_names, output_folder, video, color="#9137fc"):
    video_name = video.split('.')[-2]
    
    # 개별 메트릭에 대해 히스토그램 생성

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
    # plt.title(f"Distribution of {metric_names}")
    
    # 그래프 저장 경로 설정 및 저장
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    output_path = f"{output_folder}/{metric_names[0]}_{video_name}.png"
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Graph saved to {output_path}")
    return output_path, f'graph/voice/{metric_names[0]}_{video_name}.png'