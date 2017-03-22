---
layout: tags
title: 标签
keywords: 标签Tags, github, Jekyll
description: Jekyll 中使用标签得到文章。
---

{% for tag in site.tags %}
<li class="tags" id ="tag_cloud">
	<a rel="{{ tag | last | size }}" href="#{{ tag.first }}">{{ tag.first }}<span class="tag-size">{{ tag | last | size }}</span></a>
</li>
{% endfor %}

<article class="tag-wrapper">
{% for tag in site.tags %}
	<div class="tags-title fa fa-tag" id="{{ tag.first }}"><span>{{ tag.first }}</span></div>
		{% for article in tag.last %}
		<article class="article">
			<a href="{{ site.url }}{{ article.url }}">{{ article.title }}
			<span class="article-excerpt">{{ article.excerpt }}</span></a>
		</article>
		<hr>
	{% endfor %}
{% endfor %}
</article>