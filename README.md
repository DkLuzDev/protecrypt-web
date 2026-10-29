# ProteCrypt System – portfolio by Mariana Gomes

Static site (HTML, CSS and vanilla JavaScript, no build step) presenting **ProteCrypt System**, a concept platform that uses machine learning to detect fraud in cryptocurrency transactions.

Site estático (HTML, CSS e JavaScript puro, sem build) que apresenta o **ProteCrypt System**, uma plataforma conceitual de detecção de fraudes em transações de criptomoedas com machine learning.

## Highlights
- Live simulated transaction stream with risk scores
- Interactive risk scorer (sliders → score, reasons, recommended action)
- 9-stage system pipeline, features, market data, roadmap, financial chart, hiring plan and SWOT
- English / Português toggle (remembers the choice)
- Responsive, keyboard accessible, respects `prefers-reduced-motion`

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Publish on GitHub Pages
1. Create a repository, for example `protecrypt-system`.
2. Upload every file in this folder to the `main` branch (keep the `assets/` folder structure).
3. In the repository go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
5. After a minute the site is live at `https://YOUR-USERNAME.github.io/protecrypt-system/`.

Command line version:

```bash
git init
git add .
git commit -m "Add ProteCrypt System portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/protecrypt-system.git
git push -u origin main
```

## Before you publish
- In `index.html`, replace `YOUR-USERNAME` in the footer link with your GitHub username.
- The only personal detail on the site is the author name. Add links or contact details only if you want them.

## Notes
The risk scorer is an educational simulation with fixed weights. Market and financial figures come from the project documentation and are projections, not financial advice.
