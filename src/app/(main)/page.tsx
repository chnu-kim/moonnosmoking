"use client";

import { useState, useEffect } from "react";
import {
  CONFIG,
  getChallengeStatus,
  getCurrentDay,
  getProgress,
  getTimeUntilStart,
  msToComponents,
  pad2,
} from "@/lib/challenge";

const PRESETS = [
  { name: "다크 위젯", bg: "#0f0a1e", fg: "#ffffff", gradient: "linear-gradient(135deg, #ec4899, #c084fc)" },
  { name: "클린 세리프", bg: "transparent", fg: "#f9a8d4", gradient: "linear-gradient(135deg, #f9a8d4, #e879f9)" },
  { name: "네온 핑크", bg: "#0f0a1e", fg: "#f472b6", gradient: "linear-gradient(135deg, #f472b6, #a855f7)" },
  { name: "방송 바", bg: "#000000", fg: "#ffffff", gradient: "linear-gradient(135deg, #ec4899, #c084fc)" },
];

export default function HomePage() {
  const [status, setStatus] = useState(getChallengeStatus());
  const [currentDay, setCurrentDay] = useState(getCurrentDay());
  const [progress, setProgress] = useState(getProgress());
  const [countdown, setCountdown] = useState(msToComponents(getTimeUntilStart()));
  const [activePreset, setActivePreset] = useState(0);

  useEffect(() => {
    function tick() {
      setStatus(getChallengeStatus());
      setCurrentDay(getCurrentDay());
      setProgress(getProgress());
      setCountdown(msToComponents(getTimeUntilStart()));
    }
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const days = Array.from({ length: Math.max(CONFIG.TOTAL_DAYS, currentDay) }, (_, i) => i + 1);
  const preset = PRESETS[activePreset];

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <span className="hero__badge">금연 챌린지</span>
          <h1 className="hero__title">
            <em>{CONFIG.PARTICIPANT}</em>의<br />금연 도전기
          </h1>
          <p className="hero__subtitle">
            {status === "before"
              ? "곧 시작됩니다. 응원해주세요!"
              : "매일 한 걸음씩, 함께 응원해요"}
          </p>

          {/* 진행 중 일차 표시 */}
          {status === "ongoing" && (
            <div className="day-counter">
              <div className="day-counter__number">{currentDay}</div>
              <div className="day-counter__label">일차 금연 중</div>
            </div>
          )}

          {/* 시작 전 카운트다운 */}
          {status === "before" && (
            <div className="countdown" style={{ marginTop: 24 }}>
              <p className="countdown__title">챌린지 시작까지</p>
              <div className="countdown__grid">
                <div className="countdown__item">
                  <div className="countdown__value">{pad2(countdown.days)}</div>
                  <div className="countdown__unit">일</div>
                </div>
                <div className="countdown__item">
                  <div className="countdown__value">{pad2(countdown.hours)}</div>
                  <div className="countdown__unit">시간</div>
                </div>
                <div className="countdown__item">
                  <div className="countdown__value">{pad2(countdown.minutes)}</div>
                  <div className="countdown__unit">분</div>
                </div>
                <div className="countdown__item">
                  <div className="countdown__value">{pad2(countdown.seconds)}</div>
                  <div className="countdown__unit">초</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 진행률 */}
      {status === "ongoing" && (
        <section className="progress-section">
          <div className="container">
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">
              <strong>{currentDay}일</strong> / {CONFIG.TOTAL_DAYS}일 기준 — {progress}%
              {currentDay > CONFIG.TOTAL_DAYS && " (도전 계속 중!)"}
            </p>
          </div>
        </section>
      )}

      {/* 타임라인 */}
      {status === "ongoing" && (
        <section className="timeline">
          <div className="container">
            <h2 className="timeline__title">금연 기록</h2>
            <div className="timeline__grid">
              {days.map((d) => (
                <div
                  key={d}
                  className={`timeline__day ${
                    d < currentDay
                      ? "timeline__day--past"
                      : d === currentDay
                        ? "timeline__day--today"
                        : "timeline__day--future"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OBS 오버레이 프리뷰 카드 */}
      <section className="overlay-preview-section">
        <div className="container">
          <div className="overlay-preview-card">
            <div className="overlay-preview-card__header">
              <span className="overlay-preview-card__label">OBS 오버레이</span>
              <p className="overlay-preview-card__desc">방송에 금연 현황을 표시하세요</p>
            </div>

            {/* 미니 프리뷰 */}
            <div className="overlay-preview-card__stage">
              <div className="overlay-preview-card__dots">
                <span />
                <span />
                <span />
              </div>
              <div
                className="overlay-preview-card__mini"
                style={{ background: preset.bg === "transparent" ? "rgba(15,10,30,0.6)" : preset.bg }}
              >
                <span className="overlay-mini__title">
                  {status === "before" ? "금연 챌린지" : `${CONFIG.PARTICIPANT} 금연`}
                </span>
                <span className="overlay-mini__day" style={{ color: preset.fg }}>
                  {status === "before" ? `D-${Math.ceil(getTimeUntilStart() / 86400000)}` : `${currentDay}일차`}
                </span>
                <div className="overlay-mini__bar">
                  <div className="overlay-mini__bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="overlay-mini__progress">
                  {status === "before" ? "시작 대기중" : `${currentDay} / ${CONFIG.TOTAL_DAYS}일`}
                </span>
              </div>
            </div>

            {/* 프리셋 선택 */}
            <div className="overlay-preview-card__presets">
              {PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  className={`preset-chip ${activePreset === i ? "preset-chip--active" : ""}`}
                  onClick={() => setActivePreset(i)}
                >
                  <span
                    className="preset-chip__dot"
                    style={{ background: p.gradient }}
                  />
                  {p.name}
                </button>
              ))}
            </div>

            <a href="/moonnosmoking/overlay/customize/" className="overlay-preview-card__cta">
              커스터마이즈 열기
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer__cheer">{CONFIG.PARTICIPANT} 파이팅! 할 수 있어!</p>
          <div className="footer__rules">
            <span>시작일: {CONFIG.START_DATE.slice(0, 10)}</span>
            <span>기준 기간: {CONFIG.TOTAL_DAYS}일 (이후에도 계속 도전!)</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
