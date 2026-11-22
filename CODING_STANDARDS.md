# Coding standards

리뷰할 때 적용하는 판단 기준이다. lint, format, 타입 검사는 CI가 맡으므로 여기서 다루지 않는다.

## 테마 파일보다 설정과 slot을 먼저 쓴다

AstroPaper wiki는 사용자 코드를 테마 파일 대신 `src/custom/`에 두라고 안내한다(Customization 문서의 "Custom Slots"). 템플릿 업데이트는 손으로 옮기므로, 고친 테마 파일이 늘수록 업데이트가 어려워진다.

- 설정으로 바꿀 수 있는 것은 `astro-paper.config.ts`에서 바꾼다.
- 직접 만든 코드는 `src/custom/`의 `Head.astro`, `BodyEnd.astro`, `PostEnd.astro`에 넣는다.
- 이 두 곳으로 해결되지 않을 때만 테마 파일을 고친다.

## 테마 파일을 고친 곳에는 이유를 남긴다

테마 파일(`astro.config.ts`, `src/custom/` 밖의 `src/` 파일)을 고친 hunk에는 이유와 근거 문서를 주석으로 적는다. 문서와 다르게 했다면 문서대로 했을 때 무엇이 동작하지 않았는지도 적는다. `astro.config.ts`의 `i18n` 주석이 그 예다.
