---
layout: default
---

{% for post in site.posts %}
  <li>{{ post.date | date_to_string }} <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
  <p>{{ post.excerpt }}</p>
{% endfor %}