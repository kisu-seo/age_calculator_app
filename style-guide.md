# Front-end Style Guide

## Layout

The designs were created to the following widths:

- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px

---

## Colors (색상 팔레트)

### White & Black

| 이름  | HEX       | RGB              | HSL             |
|-------|-----------|------------------|-----------------|
| White | `#FFFFFF` | 255, 255, 255    | 0°, 100%, 100%  |
| Black | `#000000` | 0, 0, 0          | 0°, 0%, 0%      |

### Grey (회색 계열)

| 이름      | HEX       | RGB              | HSL            |
|-----------|-----------|------------------|----------------|
| Grey 500  | `#716F6F` | 113, 111, 111    | 0°, 1%, 44%    |
| Grey 200  | `#DCDCDC` | 220, 220, 220    | 0°, 0%, 86%    |
| Grey 100  | `#F0F0F0` | 240, 240, 240    | 0°, 0%, 94%    |

### Red (빨간색 계열)

| 이름      | HEX       | RGB           | HSL             |
|-----------|-----------|---------------|-----------------|
| Red 400   | `#FF5959` | 255, 89, 89   | 0°, 100%, 67%   |

### Purple (보라색 계열) — Primary

| 이름        | HEX       | RGB             | HSL              |
|-------------|-----------|-----------------|------------------|
| Purple 500  | `#854DFF` | 133, 77, 255    | 259°, 100%, 65%  |

---

## Typography (타이포그래피)

### Font Family

- **Family**: [Poppins](https://fonts.google.com/specimen/Poppins)
- **Weights & Styles**: 400 (Regular), 400i (Italic), 700 (Bold), 700i (Bold Italic), 800i (ExtraBold Italic)

---

### Text Presets (텍스트 스타일 규격표)

| 프리셋 이름          | 폰트 스타일           | 크기  | Line Height | Letter Spacing |
|----------------------|-----------------------|-------|-------------|----------------|
| Text Preset 1        | Poppins ExtraBold Italic | 104px | 110%        | -2px           |
| Text Preset 2        | Poppins ExtraBold Italic | 56px  | 110%        | -2px           |
| Text Preset 3        | Poppins Bold          | 32px  | 150%        | 0px            |
| Text Preset 4        | Poppins Bold          | 20px  | 160%        | 0px            |
| Text Preset 5 (Bold) | Poppins Bold          | 14px  | 150%        | 5px            |
| Text Preset 5 (Italic)| Poppins Italic       | 14px  | 150%        | 0px            |
| Text Preset 6 (Bold) | Poppins Bold          | 12px  | 150%        | 4px            |
| Text Preset 6 (Italic)| Poppins Italic       | 12px  | 150%        | 0px            |

> **💡 설계 힌트**: Text Preset 1은 결과값(나이: 연/월/일)의 숫자 표시에, Text Preset 5 (Bold)는 입력 라벨(DAY, MONTH, YEAR)에 활용하세요.

---

## Spacing (간격 시스템)

| 이름         | Pixels |
|--------------|--------|
| spacing-0    | 0px    |
| spacing-100  | 8px    |
| spacing-200  | 16px   |
| spacing-300  | 24px   |
| spacing-400  | 32px   |
| spacing-600  | 48px   |
| spacing-700  | 56px   |

---

## CSS Variables 참고 (권장 변수명)

아래는 이 스타일 가이드를 CSS에서 편리하게 쓸 수 있도록 정리한 권장 변수명입니다.

```css
:root {
  /* ===== 색상 변수 ===== */
  --color-white:      #FFFFFF;  /* 흰색 */
  --color-black:      #000000;  /* 검정 */
  --color-grey-100:   #F0F0F0;  /* 아주 연한 회색 — 배경 등 */
  --color-grey-200:   #DCDCDC;  /* 연한 회색 — 테두리 등 */
  --color-grey-500:   #716F6F;  /* 중간 회색 — 보조 텍스트 */
  --color-red-400:    #FF5959;  /* 에러 색상 */
  --color-purple-500: #854DFF;  /* 주요 색상 — 버튼, 강조 */

  /* ===== 폰트 변수 ===== */
  --font-family: 'Poppins', sans-serif;

  /* ===== 간격 변수 ===== */
  --spacing-0:   0px;
  --spacing-100: 8px;
  --spacing-200: 16px;
  --spacing-300: 24px;
  --spacing-400: 32px;
  --spacing-600: 48px;
  --spacing-700: 56px;
}
```
