---
title: 게시물 작성법
date: 2021-02-01 21:52:40 +0900
categories: [Blogging]
tags: [how, posting]
---

## Naming and Path

`YYYY-MM-DD-TITLE.EXTENSION` 형식의 이름을 가진 파일을 만든 후 `_posts/` 폴더에 넣는다.

파일의 확장자는 `.md` 또는 `.markdown`이어야 한다.

## Front Matter

기본적으로  파일의 상단에 **`Front Matter`**를 작성해야 한다.

```yaml
---
title: TITLE
date: YYYY-MM-DD HH:MM:SS +/-TTTT
categories: [TOP_CATEGORIE, SUB_CATEGORIE]
tags: [TAG]     # TAG names should always be lowercase
---
```

> **Note**: 게시물의 ***layout*** 은 `post`에 기본적으로 추가되어 있으므로, Front Matter 블록에 변수 ***layout***을 추가할 필요가 없다. 

### Timezone of date

게시물의 업로드 날짜를 정확하게 기록하기 위해 `_config.yml`파일에서 `timezone`을 설정하고, Front Matter 블록의 `date`에 UTC/GMT 시간을 지정해야 한다(대한민국 +0900).

양식: `+/-TTTT`, 예: `+0800`.

### Categories and Tags

`categories`는 최대 두 개까지 설정 가능하며, `tags`는 갯수의 제한 없이 설정이 가능하다.

```yaml
categories: [Animal, Insect]
tags: [bee]
```

## Table of Contents

기본적으로, **T**able **o**f **C**ontents (TOC)는 게시물의 오른쪽 패널에 표시된다. TOC를 끄려면 `_config.yml` 파일에서 `toc`를 `false`로 설정하면 된다. 만약 특정 게시물에 대한 TOC를 끄려면 **`Front Matter`**에 다음을 추가하면 된다.

```yaml
---
toc: false
---
```

## Comments

TOC와 비슷하게 [Disqus](https://disqus.com/) 댓글은 기본적으로 각 게시물에 로드된다. 댓글의 전역 스위치는 `_config.yml`파일의 `comments`변수로 정의된다. 만약 특정 게시물에 대한 댓글을 닫으려면 **`Front Matter`**에 다음을 추가하면 된다.

```yaml
---
comments: false
---
```

## Mathematics

웹사이트의 성능상 이유로, 수학 기능은 기본적으로 로드되지 않는다. 게시물에서 **`Mathematics`** 기능을 활성화 하려면 게시물의 **`Front Matter`**에 다음을 추가하면 된다.

```yaml
---
math: true
---
```

## Mermaid

[**Mermaid**](https://github.com/mermaid-js/mermaid)는 훌륭한 다이어그램 생성 도구다. 게시물에서 **`Mermaid`** 기능을 활성화하려면 YAML 블록에 다음을 추가하면 된다.

```yml
---
mermaid: true
---
```

그런 다음 다른 마크 다운 언어처럼 사용할 수 있다. 그래프 코드를 ```` ```mermaid ```` 및 ```` ``` ````로 묶으면 된다.

## Images

### Preview image

게시물 상단에 이미지를 추가하려면 이미지의 `url` 및 `alt` 속성을 지정해야 한다.

```yaml
---
image:
  src: /path/to/image/file
  alt: image alternative text
---
```

### Image caption

이미지의 다음 줄에 기울임 글꼴을 추가하면 캡션이되어 이미지 하단에 나타난다.

```markdown
![img-description](/path/to/image)
_Image Caption_
```

![img-description](/assets/img/profile-cat.jpg){: width="200"}
_Image Caption Example_

### Image size

`width`를 사용하여 이미지의 너비 (및 높이)를 지정할 수 있다.

```markdown
![Desktop View](/assets/img/sample/mockup.png){: width="200"}
```

![Desktop View](/assets/img/profile-cat.jpg){: width="200"}

### Image position

기본적으로 이미지는 중앙에 있지만 `normal`, `left` 및 `right` 중 하나를 사용하여 위치를 지정할 수 있다.

예를 들면:

- **Normal position**

  `Normal position`은 기본적으로 왼쪽에 정렬되어 생성된다.

  ```markdown
  ![Desktop View](/assets/img/sample/mockup.png){: .normal}
  ```

  ![Desktop View](/assets/img/profile-cat.jpg){: .normal, width="200"}

- **Float to the left**

  ```markdown
  ![Desktop View](/assets/img/sample/mockup.png){: .left}
  ```

- **Float to the right**

  ```markdown
  ![Desktop View](/assets/img/sample/mockup.png){: .right}
  ```

**제한 사항**: 이미지의 위치를 지정하면 **``Image caption``** 기능을 쓰지 못한다.

### CDN URL

CDN에서 이미지를 호스팅하는 경우 `_config.yml` 파일의 변수 `img_cdn`를 할당하여 CDN URL을 반복적으로 작성하는 시간을 절약할 수 있다.

```yaml
img_cdn: https://cdn.com
```

`img_cdn`이 할당되면, /로 시작하는 모든 이미지(사이트 아바타 및 게시물 이미지)의 경로에 CDN URL이 추가된다. 

이미지를 사용하는 경우 :

```markdown
![The flower](/path/to/flower.png)
```

구문 분석 결과:

```html
<img src="https://cdn.com/path/to/flower.png" alt="The flower">
```

이미지 경로 앞에 CDN 접두사(`https://cdn.com`) 를 자동으로 추가한다.

## Pinned Posts

하나 이상의 게시물을 홈페이지 상단에 고정할 수 있으며, 고정 게시물은 포스팅 날짜에 따라 역순으로 정렬된다.
게시물에서 **`Pinned Posts`** 기능을 활성화 하려면 **`Front Matter`**에 다음을 추가하면 된다.
```yaml
---
pin: true
---
```

## Code Block

마크 다운 기호 ```` ``` ````를 이용해 다음 예제와 같이 코드 블록을 쉽게 만들 수 있다.

```
This is a common code snippet, without syntax highlight and line number.
```

## Specific Language

```` ```language ````를 사용하면 줄 번호와 구문 강조 표시가 있는 코드 블록을 만들 수 있다.

> **Note**: 지킬 스타일의 `{% raw %}{%{% endraw %} highlight LANGUAGE {% raw %}%}{% endraw %}` 또는 `{% raw %}{%{% endraw %} highlight LANGUAGE linenos {% raw %}%}{% endraw %}`은 이 테마(chirpy)에서는 사용할 수 없다.

```yaml
# Yaml code snippet
items:
    - part_no:   A4786
      descrip:   Water Bucket (Filled)
      price:     1.47
      quantity:  4
```

### Liquid Codes

**`Liquid`**를 코드 블럭에 표시 하려면, 코드를 `{% raw %}{%{% endraw %} raw {%raw%}%}{%endraw%}` 및 `{% raw %}{%{% endraw %} endraw {%raw%}%}{%endraw%}`으로 묶으면 된다.

{% raw %}
```liquid
{% if product.title contains 'Pack' %}
  This product's title contains the word Pack.
{% endif %}
```
{% endraw %}

## Learn More

지킬 포스팅에 대해 더 많이 알고 싶으면 [Jekyll Docs: Posts](https://jekyllrb.com/docs/posts/)를 방문하면 된다.