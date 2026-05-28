import { describe, it, expect } from "vitest";
import {
  msToComponents,
  calcProgress,
  CONFIG,
} from "../challenge";

describe("msToComponents", () => {
  it("ms <= 0 → 전부 0", () => {
    expect(msToComponents(0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(msToComponents(-1)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it("정확히 1일 (86400000ms) → { days: 1, hours: 0, minutes: 0, seconds: 0 }", () => {
    expect(msToComponents(86400000)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0 });
  });

  it("1일 직전 (86399999ms) → { days: 0, hours: 23, minutes: 59, seconds: 59 }", () => {
    expect(msToComponents(86399999)).toEqual({ days: 0, hours: 23, minutes: 59, seconds: 59 });
  });

  it("복합값: 1일 2시간 3분 4초", () => {
    const ms = (1 * 86400 + 2 * 3600 + 3 * 60 + 4) * 1000;
    expect(msToComponents(ms)).toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4 });
  });

  it("초 단위만 있는 경우", () => {
    expect(msToComponents(5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 5 });
  });
});

describe("calcProgress", () => {
  it("0 미만 → 0 클램핑", () => {
    expect(calcProgress(-1)).toBe(0);
    expect(calcProgress(0)).toBe(0);
  });

  it("1일차 진행률", () => {
    expect(calcProgress(1)).toBe(3); // Math.round(1/31 * 100)
  });

  it("마지막 기준일(31일) → 100", () => {
    expect(calcProgress(CONFIG.TOTAL_DAYS)).toBe(100);
  });

  it("TOTAL_DAYS 초과 → 100으로 클램핑 (무한정 카운트)", () => {
    expect(calcProgress(CONFIG.TOTAL_DAYS + 1)).toBe(100);
    expect(calcProgress(100)).toBe(100);
  });
});
