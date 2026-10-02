export function renderErrorPage(notFound = false): string {
  const title = notFound ? "Invitation not found" : "We couldn't load this invitation";
  const message = notFound
    ? "Please check your invitation link."
    : "Please refresh the page or try again in a moment.";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { box-sizing: border-box; font: 15px/1.5 Georgia, serif; background: #0b1412; color: #f4efe3; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 2.5rem; font-weight: 300; margin: 0 0 1rem; }
      p { color: #bcb5a3; font-style: italic; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: transparent; border-color: #c6a861; color: #c6a861; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      <p>${message}</p>
      <div class="actions">
        ${notFound ? "" : '<button class="primary" onclick="location.reload()">Try again</button>'}
      </div>
    </div>
  </body>
</html>`;
}
