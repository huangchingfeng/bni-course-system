# BNI Xinbei West B — Brand Guidelines
## 新北市西B區品牌識別規範

---

## Brand Philosophy 品牌理念

> **"Excellence Through Connection"**
>
> 「卓越源於連結」

我們相信，真正的商業成功來自於人與人之間的信任與連結。BNI 新北市西B區不僅是一個商業網絡，更是一個追求卓越的專業社群。

---

## Brand Values 品牌核心價值

| English | 繁體中文 | 日本語 | 한국어 | Latina |
|---------|----------|--------|--------|--------|
| Trust | 信任 | 信頼 | 신뢰 | Fides |
| Excellence | 卓越 | 卓越 | 탁월 | Excellentia |
| Connection | 連結 | 繋がり | 연결 | Nexus |
| Growth | 成長 | 成長 | 성장 | Crescentia |

---

## Color System 色彩系統

### Primary Palette 主色調

```
┌─────────────────────────────────────────────────────────┐
│  MIDNIGHT NAVY          深海藏青                        │
│  #0F172A                 信任・專業・深度               │
│  RGB: 15, 23, 42                                        │
│  「深邃如夜海，承載百年智慧」                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ROYAL GOLD             皇家金                          │
│  #D4AF37                 尊貴・成功・價值               │
│  RGB: 212, 175, 55                                      │
│  「金色光芒，照耀成功之路」                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  PEARL WHITE            珍珠白                          │
│  #FAFBFC                 純淨・透明・開放               │
│  RGB: 250, 251, 252                                     │
│  「如珍珠般溫潤，蘊含無限可能」                          │
└─────────────────────────────────────────────────────────┘
```

### Secondary Palette 輔助色調

| Color | Hex | Usage 用途 |
|-------|-----|------------|
| Sapphire Blue 藍寶石 | #1E40AF | Interactive elements 互動元素 |
| Emerald Green 翡翠綠 | #059669 | Success states 成功狀態 |
| Ruby Red 紅寶石 | #DC2626 | Alert/Important 警示/重要 |
| Amethyst Purple 紫水晶 | #7C3AED | Premium features 進階功能 |
| Obsidian Gray 黑曜石 | #374151 | Text/Content 文字/內容 |

### Gradient 漸層效果

```css
/* Premium Gradient 尊榮漸層 */
background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%);

/* Gold Shimmer 金光閃耀 */
background: linear-gradient(90deg, #B8860B 0%, #D4AF37 50%, #B8860B 100%);
```

---

## Typography 字體系統

### Primary Typeface 主要字體

**English/Latin:** Inter (Headings) + Source Sans Pro (Body)
**中文/日本語/한국어:** Noto Sans CJK

### Type Scale 字級規範

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 48px / 3rem | 700 | Hero sections |
| H1 | 36px / 2.25rem | 700 | Page titles |
| H2 | 30px / 1.875rem | 600 | Section headers |
| H3 | 24px / 1.5rem | 600 | Card titles |
| H4 | 20px / 1.25rem | 500 | Subsections |
| Body | 16px / 1rem | 400 | Main content |
| Small | 14px / 0.875rem | 400 | Secondary text |
| Caption | 12px / 0.75rem | 400 | Labels, hints |

---

## Logo Usage 標誌使用

### Tagline 品牌標語

| Language | Tagline |
|----------|---------|
| 繁體中文 | 卓越源於連結 |
| English | Excellence Through Connection |
| 日本語 | つながりから卓越へ |
| 한국어 | 연결에서 탁월함으로 |
| Latina | Per Nexum ad Excellentiam |

---

## Voice & Tone 語調風格

### Brand Voice 品牌聲音

- **Professional** 專業的 — 展現深厚的商業智慧
- **Warm** 溫暖的 — 建立真誠的人際連結
- **Confident** 自信的 — 傳遞成功的信念
- **Inclusive** 包容的 — 歡迎每一位追求成長的夥伴

### Writing Guidelines 文案準則

| Do ✓ | Don't ✗ |
|------|---------|
| 使用正面、鼓勵的語氣 | 避免負面或批評的措辭 |
| 簡潔有力的表達 | 冗長複雜的句子 |
| 以用戶為中心 | 自我中心的敘述 |
| 專業但易懂 | 過度使用術語 |

---

## UI Components 介面元素

### Buttons 按鈕

```
┌──────────────────────────────────────┐
│  PRIMARY BUTTON                      │
│  Background: #0F172A                 │
│  Text: #FFFFFF                       │
│  Hover: #1E3A5F                      │
│  Border-radius: 8px                  │
│  Padding: 12px 24px                  │
│  Shadow: 0 4px 14px rgba(0,0,0,0.1) │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  GOLD ACCENT BUTTON                  │
│  Background: transparent             │
│  Border: 2px solid #D4AF37           │
│  Text: #D4AF37                       │
│  Hover: Background #D4AF37, Text #FFF│
└──────────────────────────────────────┘
```

### Cards 卡片

- Background: #FFFFFF
- Border: 1px solid rgba(15, 23, 42, 0.08)
- Border-radius: 16px
- Shadow: 0 4px 24px rgba(15, 23, 42, 0.06)
- Padding: 24px

### Form Elements 表單元素

- Border: 1px solid #E2E8F0
- Border-radius: 8px
- Focus: Border 2px solid #1E40AF
- Background: #FFFFFF

---

## Spacing System 間距系統

Based on 4px grid system:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Related elements |
| md | 16px | Standard spacing |
| lg | 24px | Section padding |
| xl | 32px | Large gaps |
| 2xl | 48px | Section margins |
| 3xl | 64px | Page sections |

---

## Iconography 圖標風格

- Style: Outlined, 1.5px stroke
- Size: 24px (default), 20px (small), 32px (large)
- Color: Inherits from text color
- Library: Lucide Icons

---

## Motion & Animation 動態效果

### Principles 原則

1. **Purposeful** — 動畫必須有意義
2. **Subtle** — 優雅而不張揚
3. **Fast** — 快速回應，不造成等待感

### Timing 時間

| Type | Duration | Easing |
|------|----------|--------|
| Micro-interactions | 150ms | ease-out |
| Transitions | 250ms | ease-in-out |
| Page transitions | 350ms | ease-in-out |
| Complex animations | 500ms | cubic-bezier(0.4, 0, 0.2, 1) |

---

## Multilingual Support 多語系支援

### Language Codes 語言代碼

| Language | Code | Direction |
|----------|------|-----------|
| 繁體中文 | zh-TW | LTR |
| English | en | LTR |
| 日本語 | ja | LTR |
| 한국어 | ko | LTR |
| Latina | la | LTR |

### Font Fallback Stack 字體備援

```css
font-family: 'Inter', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR',
             -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

---

## Application Examples 應用範例

### Website Header
- Height: 72px
- Background: #FFFFFF with subtle shadow
- Logo: Left aligned
- Navigation: Center
- CTA: Right aligned

### Course Cards
- Aspect ratio: 4:3 for images
- Title: H3 size, weight 600
- Meta info: Caption size, muted color
- CTA: Primary button, full width on mobile

### Dashboard
- Sidebar: 280px width, #0F172A background
- Content area: #FAFBFC background
- Cards: White with subtle shadow
- Charts: Brand color palette

---

*Version 1.0 | January 2026*
*Created by Brand Strategy Team*
