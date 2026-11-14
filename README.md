# Human Bingo (Vercel)
Flow: loading animation -> enter name -> bingo card -> final card -> winners showcase (host controlled) -> host Reset -> back to enter name.
- public/index.html + favicons + site.webmanifest + hr_loader.webp (transparent loading animation) + hr_loader_still.png (reduced-motion)
- api/*.js          -> serverless functions
Env var you add yourself: ADMIN_PASSWORD. Database: Upstash Redis (Vercel Storage); its variables are added automatically.
Deploying new code does NOT touch the database. Game data is only cleared by the host's Reset game / Start timer / Delete all photos buttons.
Host: Results -> Download all cards (zip of every player's finished card), Download all photos, or tap a card on the live board -> Download card.
