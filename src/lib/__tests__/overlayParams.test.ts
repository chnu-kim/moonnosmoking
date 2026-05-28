import { describe, it, expect } from "vitest";
import {
  parseOverlayParams,
  OVERLAY_DEFAULTS,
  resolveBg,
  buildOverlayUrl,
} from "../overlayParams";

describe("parseOverlayParams", () => {
  it("null → 기본값 반환", () => {
    expect(parseOverlayParams(null)).toEqual(OVERLAY_DEFAULTS);
  });

  it("유효한 template 파싱", () => {
    const sp = new URLSearchParams("template=big-number");
    expect(parseOverlayParams(sp).template).toBe("big-number");
  });

  it("유효하지 않은 template → 기본값", () => {
    const sp = new URLSearchParams("template=unknown");
    expect(parseOverlayParams(sp).template).toBe(OVERLAY_DEFAULTS.template);
  });

  it("유효한 hex fg 파싱", () => {
    const sp = new URLSearchParams("fg=%23f472b6");
    expect(parseOverlayParams(sp).fg).toBe("#f472b6");
  });

  it("유효하지 않은 fg → 기본값", () => {
    const sp = new URLSearchParams("fg=pink");
    expect(parseOverlayParams(sp).fg).toBe(OVERLAY_DEFAULTS.fg);
  });

  it("opacity 범위 클램핑 (0~1)", () => {
    const sp1 = new URLSearchParams("opacity=1.5");
    expect(parseOverlayParams(sp1).opacity).toBe(1);
    const sp2 = new URLSearchParams("opacity=-0.5");
    expect(parseOverlayParams(sp2).opacity).toBe(0);
  });

  it("bg=transparent 허용", () => {
    const sp = new URLSearchParams("bg=transparent");
    expect(parseOverlayParams(sp).bg).toBe("transparent");
  });
});

describe("resolveBg", () => {
  it("transparent → 그대로 반환", () => {
    expect(resolveBg("transparent", 0.5)).toBe("transparent");
  });

  it("hex → rgba 변환", () => {
    expect(resolveBg("#0f0a1e", 0.85)).toBe("rgba(15,10,30,0.85)");
  });
});

describe("buildOverlayUrl", () => {
  it("기본값이면 쿼리 없이 base URL만", () => {
    expect(buildOverlayUrl(OVERLAY_DEFAULTS)).toBe("/moonnosmoking/overlay/");
  });

  it("기본값과 다른 파라미터만 쿼리에 포함", () => {
    const url = buildOverlayUrl({ ...OVERLAY_DEFAULTS, template: "one-line" });
    expect(url).toContain("template=one-line");
    expect(url).not.toContain("fg=");
  });
});
