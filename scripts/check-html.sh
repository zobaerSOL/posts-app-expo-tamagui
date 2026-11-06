#!/usr/bin/env bash
# Usage: scripts/check-html.sh [base-url]
# Prints HTTP status, <title>, meta description and whether key content is in the raw HTML.
BASE="${1:-http://localhost:8081}"
check() { # path, needle
  local out status
  out=$(curl -s -w '\n%{http_code}' "$BASE$1")
  status=${out##*$'\n'}
  body=${out%$'\n'*}
  title=$(printf '%s' "$body" | grep -o '<title>[^<]*</title>' | head -1)
  desc=$(printf '%s' "$body" | tr '\n' ' ' | grep -o '<meta name="description" content="[^"]*"' | head -1 | cut -c1-120)
  if printf '%s' "$body" | grep -qF -- "$2"; then found=yes; else found=NO; fi
  printf '%-16s status=%s content_in_html=%s %s %s\n' "$1" "$status" "$found" "$title" "$desc"
}
check / "Featured products"
check /posts "sunt aut facere"
check /posts/1 "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
check /posts/9999 "Something went wrong"
check /products "All products"
check /products/1 "Essence Mascara Lash Princess"
check /products/9999 "Something went wrong"
check /user/3 "User ID: 3"
check /nope "Page not found"
