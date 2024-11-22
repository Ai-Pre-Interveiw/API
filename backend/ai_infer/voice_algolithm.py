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
import parselmouth
from parselmouth.praat import call

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

# class VocalTremorAnalyzer():
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
    
def analyze_wav_1s(file_path):
    try:
        # Sound 객체 생성
        sound = parselmouth.Sound(file_path)
        duration = sound.get_total_duration()  # 음성 파일 길이 (초)

        # 음성 파일 확인 (에너지가 매우 낮은 경우 스킵)
        if sound.get_energy() < 1e-6:
            print(f"No valid audio in file: {file_path}")
            return None

        # 1초 간격으로 데이터 나누기
        time_intervals = np.arange(0, duration, 1)  # 1초 단위 구간

        # 결과 저장 리스트
        results = []

        for start_time in time_intervals:
            end_time = min(start_time + 1, duration)  # 1초 구간 또는 마지막 구간

            # 현재 구간의 소리 추출
            segment = sound.extract_part(from_time=start_time, to_time=end_time, preserve_times=True)

            # Pitch, Jitter, Shimmer 계산
            pitch = segment.to_pitch_ac(time_step=0.01, pitch_floor=75, pitch_ceiling=600)
            frequencies = pitch.selected_array["frequency"]
            frequencies = frequencies[frequencies > 0]  # 0Hz 제거 (무음 처리)

            # 평균 F0 계산
            mean_pitch = np.mean(frequencies) if len(frequencies) > 0 else np.nan

            # Jitter 및 Shimmer 계산
            point_process = call(segment, "To PointProcess (periodic, cc)", 75, 600)
            try:
                jitter = call(point_process, "Get jitter (local)", 0, 0, 0.0001, 0.02, 1.3)
            except Exception:
                jitter = np.nan
            try:
                shimmer = call([segment, point_process], "Get shimmer (local)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
            except Exception:
                shimmer = np.nan

            # 성별 구분
            gender = "female" if mean_pitch >= 165 else "male"

            # 결과 저장
            results.append({
                "Start Time (s)": start_time,
                "End Time (s)": end_time,
                "F0 (Hz)": mean_pitch,
                "Jitter": jitter,
                "Shimmer": shimmer,
                "Gender": gender
            })

        # 데이터프레임 생성
        result_df = pd.DataFrame(results)
        result_df = result_df.fillna(0)
        return result_df

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None
    
def process_single_file(file_path):
    # 1초 단위 분석
    result_df = analyze_wav_1s(file_path)

    if result_df is None:
        print(f"Could not process the file: {file_path}")

    return result_df
    
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

        if name == "jitter":
            # Top 2 인덱스 추출
            top_indices = [idx for idx, _ in sorted(enumerate(scaled_metric), key=lambda x: x[1], reverse=True)[:2]]

            # 기준값 및 ±25% 범위 계산
            reference_value = 0.024370
            lower_bound = reference_value * (1 - 0.25)  # 기준값의 -25%
            upper_bound = reference_value * (1 + 0.25)  # 기준값의 +25%

            # 기본 jitter 값으로 그래프 생성
            plt.figure(figsize=(15, 6))
            plt.plot(metric, label=f"{name} (Original)", color=colors, marker='o', linestyle='-')
            # ±25% 영역을 흐리게 표시
            plt.axhspan(lower_bound, upper_bound, color='green', alpha=0.15, label='±25% Range')
            plt.grid(True, linestyle="--", alpha=0.5)
            # plt.legend(loc="upper left")
            output_path_ent = f'media/graph/anxiety'
            os.makedirs(output_path_ent, exist_ok=True)
            ent_output_graph_path = f'{output_path_ent}/{name}_{video_name}'
            ent_output_path = ent_output_graph_path
            ent_output_db_path = f'graph/anxiety/{name}_{video_name}.png'
            plt.savefig(ent_output_graph_path, bbox_inches='tight')
            plt.close()

            # scaled jitter 값으로 그래프 생성
            plt.figure(figsize=(15, 6))
            plt.plot(scaled_metric, label=f"{name} (Scaled)", color=colors, marker='o', linestyle='-')
            # ±25% 영역을 흐리게 표시
            plt.axhspan(lower_bound, upper_bound, color='green', alpha=0.15, label='±25% Range')
            plt.grid(True, linestyle="--", alpha=0.5)
            # plt.legend(loc="upper left")
            output_path_fre = f"media/graph/voice"
            os.makedirs(output_path_fre, exist_ok=True)
            fre_output_graph_path = f'{output_path_fre}/{name}_{video_name}'
            fre_output_path = fre_output_graph_path
            fre_output_db_path = f'graph/voice/{name}_{video_name}.png'
            plt.savefig(fre_output_graph_path, bbox_inches='tight')
            plt.close()

    return ent_output_path + '.png', fre_output_path + '.png', ent_output_db_path, fre_output_db_path, top_indices

