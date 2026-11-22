# 블로그는 ckyeon.github.io repo에서 배포하고 대표 주소는 blog.ckyeon.com으로 둔다

blog.ckyeon.com과 ckyeon.github.io 두 주소로 모두 블로그에 들어올 수 있어야 했다. ckyeon.github.io 주소는 이름이 같은 repo만 서비스할 수 있으므로, 블로그를 이 repo에 두고 custom domain을 blog.ckyeon.com으로 설정했다. 그러면 GitHub이 ckyeon.github.io 주소를 경로를 유지한 채 301로 넘긴다. 이 동작은 GitHub 문서에는 없고, 다른 user site들에서 관측한 것이다. 블로그를 blog.ckyeon.com repo에 두고 ckyeon.github.io repo에 redirect 페이지를 두는 안은 GitHub Pages에 서버 쪽 redirect 규칙이 없어 meta refresh밖에 쓸 수 없어서 고르지 않았다.

## Consequences

- 같은 계정의 project site는 custom domain을 따로 주지 않으면 blog.ckyeon.com/<repo>/ 아래로 옮겨진다. 그래서 nwitter와 styleguide는 unpublish했다.
