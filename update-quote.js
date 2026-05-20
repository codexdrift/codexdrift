const fs = require('fs');
const path = require('path');

// ── Load quotes ──────────────────────────────────────────────
const quotes = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'quotes.json'), 'utf-8')
);

// ── Pick a quote based on the day of the year (rotates daily) ──
const now = new Date();
const startOfYear = new Date(now.getFullYear(), 0, 0);
const diff = now - startOfYear;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay);
const todayQuote = quotes[dayOfYear % quotes.length];

// ── Build the "Thought of the Day" SVG-style block ──────────
const quoteBlock = `
<!-- THOUGHT-OF-THE-DAY:START -->
<div align="center">
<table>
<tr>
<td>

<div align="center">

### 🧠 Thought of the Day

</div>

<div align="center">
<img src="https://readme-typing-svg.herokuapp.com/?font=Georgia&size=18&duration=6000&pause=2000&color=58A6FF&center=true&vCenter=true&multiline=true&width=600&height=80&lines=${encodeURIComponent('"' + todayQuote.quote + '"')};—+${encodeURIComponent(todayQuote.author)}" alt="Quote" />
</div>

<div align="center">
<sub>🔄 This quote refreshes daily via GitHub Actions</sub>
</div>

</td>
</tr>
</table>
</div>
<!-- THOUGHT-OF-THE-DAY:END -->`;

// ── Read current README and replace the quote section ────────
const readmePath = path.join(__dirname, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf-8');

const startMarker = '<!-- THOUGHT-OF-THE-DAY:START -->';
const endMarker = '<!-- THOUGHT-OF-THE-DAY:END -->';

const startIdx = readme.indexOf(startMarker);
const endIdx = readme.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  readme =
    readme.substring(0, startIdx) +
    quoteBlock.trim() +
    readme.substring(endIdx + endMarker.length);
} else {
  // If markers not found, append before the footer
  const footerMarker = '<!-- FOOTER -->';
  const footerIdx = readme.indexOf(footerMarker);
  if (footerIdx !== -1) {
    readme =
      readme.substring(0, footerIdx) +
      quoteBlock.trim() +
      '\n\n' +
      readme.substring(footerIdx);
  } else {
    readme += '\n' + quoteBlock.trim();
  }
}

fs.writeFileSync(readmePath, readme, 'utf-8');

console.log(`✅ Quote updated: "${todayQuote.quote}" — ${todayQuote.author}`);
