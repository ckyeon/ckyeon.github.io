---
title: 새 게시물 작성법
date: 2021-02-01 21:52:40 +0900
categories: [Blogging, Tutorial]
tags: [writing]
---

## Naming and Path

`YYYY-MM-DD-TITLE.EXTENSION` 형식의 이름을 가진 파일을 만든 후 `_posts/` 폴더에 넣습니다.

파일의 확장자는 `.md` 또는 `.markdown`이어야 합니다.

## Front Matter

기본적으로  파일의 상단에 [Front Matter](https://jekyllrb.com/docs/front-matter/)를 작성해야 합니다.

```yaml
---
title: TITLE
date: YYYY-MM-DD HH:MM:SS +/-TTTT
categories: [TOP_CATEGORIE, SUB_CATEGORIE]
tags: [TAG]     # TAG names should always be lowercase
---
```

> **Note**: 게시물의 ***layout*** 은 `post`에 기본적으로 추가되어 있으므로, Front Matter 블록에 변수 ***layout***을 추가할 필요가 없습니다. 

### Timezone of date

게시물의 업로드 날짜를 정확하게 기록하기 위해 `_config.yml`파일에서 `timezone`을 설정하고, Front Matter 블록의 `date`에 UTC/GMT 시간을 지정해야 합니다. 

양식: `+/-TTTT`, 예: `+0800`.

### Categories and Tags

`categories`는 최대 두 개까지 설정 가능하며, `tags`는 갯수의 제한 없이 설정이 가능합니다.

```yaml
categories: [Animal, Insect]
tags: [bee]
```

## Table of Contents

By default, the **T**able **o**f **C**ontents (TOC) is displayed on the right panel of the post. If you want to turn it off globally, go to `_config.yml` and set the value of variable `toc` to `false`. If you want to turn off TOC for specific post, add the following to post's [Front Matter](https://jekyllrb.com/docs/front-matter/):

```yaml
---
toc: false
---
```

## Comments

Similar to TOC, the [Disqus](https://disqus.com/) comments is loaded by default in each post, and the global switch is defined by variable `comments` in file `_config.yml` . If you want to close the comment for specific post, add the following to the **Front Matter** of the post:

```yaml
---
comments: false
---
```

## Mathematics

For website performance reasons, the mathematical feature won't be loaded by default. But it can be enabled by:

```yaml
---
math: true
---
```

## Mermaid

[**Mermaid**](https://github.com/mermaid-js/mermaid) is a great diagrams generation tool. To enable it on your post, add the following to the YAML block:

```yml
---
mermaid: true
---
```

Then you can use it like other markdown language: surround the graph code with ```` ```mermaid ```` and ```` ``` ````.

## Images

### Preview image

If you want to add an image to the top of the post contents, specify the url and alt attribute for the image:

```yaml
---
image:
  src: /path/to/image/file
  alt: image alternative text
---
```

### Image caption

Add italics to the next line of an image，then it will become the caption and appear at the bottom of the image:

```markdown
![img-description](/path/to/image)
_Image Caption_
```

### Image size

You can specify the width (and height) of a image with `width`:

```markdown
![Desktop View](/assets/img/sample/mockup.png){: width="400"}
```

### Image position

By default, the image is centered, but you can specify the position by using one of class `normal` , `left` and `right`. For example:

- **Normal position**

  Image will be left aligned in below sample:

  ```markdown
  ![Desktop View](/assets/img/sample/mockup.png){: .normal}
  ```

- **Float to the left**

  ```markdown
  ![Desktop View](/assets/img/sample/mockup.png){: .left}
  ```

- **Float to the right**

  ```markdown
  ![Desktop View](/assets/img/sample/mockup.png){: .right}
  ```

**Limitation**: Once you specify the position of an image, it is forbidden to add the image caption.

### CDN URL

If you host the images on the CDN, you can save the time of repeatedly writing the CDN url by assigning the variable `img_cdn` of `_config.yml` file:

```yaml
img_cdn: https://cdn.com
```

Once `img_cdn` is assigned, the CDN url will be added to the path of all images (images of site avatar and posts) starting with `/`.

For instance, when using images:

```markdown
![The flower](/path/to/flower.png)
```

The parsing result will automatically add the CDN prefix `https://cdn.com` before the image path:

```html
<img src="https://cdn.com/path/to/flower.png" alt="The flower">
```

## Pinned Posts

You can pin one or more posts to the top of the home page, and the fixed posts are sorted in reverse order according to their release date. Enable by:

```yaml
---
pin: true
---
```

## Code Block

Markdown symbols ```` ``` ```` can easily create a code block as following examples.

```
This is a common code snippet, without syntax highlight and line number.
```

## Specific Language

Using ```` ```language ```` you will get code snippets with line numbers and syntax highlight.

> **Note**: The Jekyll style `{% raw %}{%{% endraw %} highlight LANGUAGE {% raw %}%}{% endraw %}` or `{% raw %}{%{% endraw %} highlight LANGUAGE linenos {% raw %}%}{% endraw %}` are not allowed to be used in this theme !

```yaml
# Yaml code snippet
items:
    - part_no:   A4786
      descrip:   Water Bucket (Filled)
      price:     1.47
      quantity:  4
```

### Liquid Codes

If you want to display the **Liquid** snippet, surround the liquid code with `{% raw %}{%{% endraw %} raw {%raw%}%}{%endraw%}` and `{% raw %}{%{% endraw %} endraw {%raw%}%}{%endraw%}` .

{% raw %}
```liquid
{% if product.title contains 'Pack' %}
  This product's title contains the word Pack.
{% endif %}
```
{% endraw %}

## Learn More

For more knowledge about Jekyll posts, visit the [Jekyll Docs: Posts](https://jekyllrb.com/docs/posts/).

