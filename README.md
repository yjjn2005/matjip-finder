# 전국 맛집 기행 배포 가이드

## 1. GitHub Pages
```
cd matjip-finder
git init && git add . && git commit -m "맛집 노트 첫 배포"
gh repo create yjjn2005/matjip-finder --public --source=. --push
```
(gh가 없으면 GitHub에서 새 저장소 matjip-finder를 만들고 파일을 올려도 됩니다.)
저장소 Settings → Pages → Branch: main / (root) → Save.
주소: https://yjjn2005.github.io/matjip-finder/

## 2. Cloudflare Worker (동기화)
```
cd worker
npx wrangler login
npx wrangler kv namespace create MATJIP_SYNC     # 출력된 id를 wrangler.toml의 REPLACE_WITH_KV_ID에 붙여넣기
npx wrangler deploy                              # 출력된 https://matjip-finder-api.xxx.workers.dev 복사
```

## 3. 연결
index.html에서 아래 줄의 주소를 위 Worker 주소로 바꾸고 커밋·푸시합니다.
```
const API = "https://matjip-finder-api.YOUR-SUBDOMAIN.workers.dev";
```
앱의 "내 노트" 탭 → 기기 간 동기화에서 PIN(숫자 6자리 이상 권장)을 넣고 동기화를 누르면 됩니다.
