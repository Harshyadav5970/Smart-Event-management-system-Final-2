// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Clean Pass Print Helper: Prints ONLY the Pass Card, zero extra pages/sidebar

export function printPassCard(element) {
  if (!element) return;

  // Clone element to avoid modifying the active DOM
  const clone = element.cloneNode(true);

  // Strip out buttons, action controls, and unnecessary UI elements
  clone.querySelectorAll('.no-print-area, button, .action-strip').forEach((el) => el.remove());

  // Create temporary isolated hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();

  // Collect all link and style tags from host document
  let styleTags = '';
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    styleTags += node.outerHTML;
  });

  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>College Fest Entry Pass - ${clone.querySelector('h3')?.innerText || 'Pass'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        ${styleTags}
        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background: #ffffff !important;
            margin: 0;
            padding: 24px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
          }
          @page {
            size: portrait;
            margin: 8mm;
          }
          .pass-print-container {
            width: 440px;
            max-width: 100%;
            margin: 0 auto;
          }
          .pass-print-container > div {
            box-shadow: none !important;
            border: 1.5px solid #cbd5e1 !important;
          }
        </style>
      </head>
      <body>
        <div class="pass-print-container">
          ${clone.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Trigger print cleanly after styles load
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Clean up iframe after printing
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch (e) {}
    }, 1500);
  }, 400);
}
