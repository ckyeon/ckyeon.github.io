# ckyeon's tech

<https://blog.ckyeon.com>의 소스다. [AstroPaper](https://github.com/satnaing/astro-paper) v7.2.1 템플릿으로 시작했다.

## 로컬에서 실행

```sh
pnpm install
pnpm dev      # 개발 서버
pnpm build    # astro check, 빌드, Pagefind 색인
pnpm preview  # 빌드 결과 미리보기
```

## 글 쓰기

글은 `src/content/posts/`에 Markdown이나 MDX로 쓴다. frontmatter에는 `title`, `description`, `pubDatetime`이 반드시 있어야 한다. 자세한 내용은 [AstroPaper wiki의 Writing Posts](https://github.com/satnaing/astro-paper/wiki/Writing-Posts)를 본다.

## 배포

`master`에 push하면 `.github/workflows/deploy.yml`이 GitHub Pages로 배포한다. 주소 구성을 이렇게 정한 이유는 [ADR 0001](docs/adr/0001-serve-blog-from-user-site-repo.md)에 있다.
