# Human Bingo (Vercel)
Flow: loading animation -> enter name -> bingo card -> final card -> winners showcase (host controlled) -> host Reset -> back to enter name.
- public/index.html + favicons + site.webmanifest + hr_loader.webp (transparent loading animation) + hr_loader_still.png (reduced-motion)
- api/*.js          -> serverless functions
Env var you add yourself: ADMIN_PASSWORD. Database: Upstash Redis (Vercel Storage); its variables are added automatically.
