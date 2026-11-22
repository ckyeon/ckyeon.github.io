# ckyeon.github.io

blog.ckyeon.com의 소스다. AstroPaper 템플릿 v7.2.1에서 시작했다.

- **테마 문서**: 설정, 꾸미기, 기능 추가 방법은 AstroPaper wiki(https://github.com/satnaing/astro-paper/wiki)에서 찾는다. 템플릿 원본은 `satnaing/astro-paper`의 tag `v7.2.1`이다.
- **배포**: `master`에 push하면 `.github/workflows/deploy.yml`이 lint, format, build를 통과한 뒤 바로 배포한다.
- **결정 기록**: 주소 구성처럼 되돌리기 어려운 결정은 `docs/adr/`에 있다.
- **리뷰 기준**: 테마 파일을 언제, 어떻게 고치는지는 `CODING_STANDARDS.md`에 있다.
- **`public/sw.min.js`**: 옛 Chirpy 블로그의 service worker를 대체하는 파일이다. 옛 방문자의 브라우저가 옛 페이지를 다시 보여 주지 않도록 이 경로에 계속 둔다.
