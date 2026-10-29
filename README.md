# Human Bingo (Vercel)
- public/index.html -> the game page (registration, card, host login, host-only live board)
- api/*.js          -> serverless functions (timer, photos, progress, host actions)
Env var you add yourself: ADMIN_PASSWORD. Database: Upstash Redis (Vercel Storage); its variables are added automatically.
Host live board: open your site with /#live on the end, or Host login -> Open live board.
