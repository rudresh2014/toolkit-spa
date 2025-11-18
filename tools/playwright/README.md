Playwright cross-browser visual checks

Install and run (PowerShell):

```powershell
cd tools/playwright
npm install
npx playwright install
npm run test:screenshots
```

What this does:
- Installs Playwright and browser engines (Chromium, Firefox, WebKit)
- Runs the `selects.spec.js` test which loads local `index.html` pages and saves screenshots for each browser

Notes:
- The test uses `file:///` paths to open local HTML files. If your app runs on a dev server (e.g. `http://localhost:5173`), update the URLs in `tests/selects.spec.js`.
- Native dropdowns are rendered by the browser/OS; Playwright screenshots will capture the closed select. For open-dropdown captures or pixel-perfect comparisons, consider implementing a custom dropdown component or using a headful (non-headless) run and manual inspection.
