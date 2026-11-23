---
title: "PROTOTYPE 견본 글: 색 구성 비교용"
description: "색 구성 prototype에서 글 페이지의 밀도를 보려고 만든 임시 글이다. commit하지 않는다."
pubDatetime: 2026-11-23T09:00:00+09:00
featured: true
tags: ["graphics", "math", "prototype"]
---

이 글은 색 구성 후보를 실제 글 화면에서 비교하려고 만든 **임시 견본**이다. 본문, [링크](https://example.com), `inline code`, 표, 인용, code block이 각 palette에서 어떻게 보이는지 확인한다.

## 벡터와 내적

두 벡터 `a`와 `b`의 내적은 두 벡터가 이루는 각의 cosine에 길이를 곱한 값이다. 그래픽스에서는 빛의 방향과 표면 법선의 내적으로 밝기를 정한다.

> [!NOTE]
> 정규화한 벡터끼리의 내적은 곧 cosine 값이다.

### 코드로 보기

```ts
type Vec3 = [number, number, number];

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

const lambert = Math.max(0, dot(normal, lightDir));
```

## 공부 기록

- 선형대수: 기저와 좌표 변환
- 렌더링: Lambert 반사와 Phong 반사
- 영어: 기술 문서를 소리 내어 읽기

| 주제 | 자료 | 진행 |
| --- | --- | --- |
| 선형대수 | 강의 노트 | 3장 |
| 렌더링 | 책 한 권 | 2장 |

### 마무리

긴 문단이 어떻게 읽히는지도 본다. 배경과 본문 색의 대비가 너무 강하면 오래 읽기 피곤하고, 너무 약하면 글자가 흐려 보인다. 링크 색은 본문 안에서 눈에 띄면서도 문단 흐름을 끊지 않아야 한다.
