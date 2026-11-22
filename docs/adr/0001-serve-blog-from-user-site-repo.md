# 블로그는 ckyeon.github.io repo에서 배포하고 대표 주소는 blog.ckyeon.com으로 둔다

blog.ckyeon.com과 ckyeon.github.io 두 주소로 모두 블로그에 들어올 수 있어야 했다. ckyeon.github.io 주소로 사이트를 배포할 수 있는 repo는 이름이 같은 repo뿐이므로, 블로그를 이 repo에 두고 custom domain을 blog.ckyeon.com으로 설정했다. 그러면 GitHub이 ckyeon.github.io로 들어온 요청을 blog.ckyeon.com의 같은 경로로 301 redirect한다. 이 동작은 GitHub 문서에는 없고, 다른 user site들에서 관측한 것이다. 블로그를 blog.ckyeon.com repo에 두고 ckyeon.github.io repo에 redirect 페이지만 두는 안은 고르지 않았다. GitHub Pages에는 서버 쪽 redirect 규칙이 없어서 301 대신 meta refresh를 써야 하기 때문이다.

## Consequences

- 같은 계정의 project site는 custom domain을 따로 주지 않으면 blog.ckyeon.com/<repo>/ 아래로 옮겨진다. 그래서 nwitter와 styleguide는 unpublish했다.
