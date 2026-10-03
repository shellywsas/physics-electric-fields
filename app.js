// Interactive Physics Learning Web App
document.addEventListener('DOMContentLoaded', () => {

  // 1. Render KaTeX formulas automatically
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }

  // 2. Navigation smooth scrolling and active state
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        // Update active class
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Smooth scroll with offset for sticky nav
        const navHeight = document.querySelector('.nav-bar').offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 15;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. Scroll spy to automatically highlight current section in navigation
  const sections = document.querySelectorAll('.content-section');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navBtns.forEach(b => {
          if (b.getAttribute('data-target') === id) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
      }
    });
  });

  // 4. Interactive Sandbox Calculator
  const qInput = document.getElementById('sandbox-q');
  const rInput = document.getElementById('sandbox-r');
  const runBtn = document.getElementById('run-sandbox-btn');
  const resultDiv = document.getElementById('sandbox-result');

  function calculateSandbox() {
    const qMicro = parseFloat(qInput.value);
    const rCm = parseFloat(rInput.value);

    if (isNaN(qMicro) || isNaN(rCm) || rCm <= 0) {
      resultDiv.innerHTML = '<span style="color:#ef4444;">נא להזין ערכים חוקיים (מרחק חייב להיות גדול מ-0)</span>';
      return;
    }

    const qC = Math.abs(qMicro) * 1e-6;
    const rM = rCm / 100;
    const k = 9e9;
    const E = (k * qC) / (rM * rM);

    // Format in scientific notation
    const exp = Math.floor(Math.log10(E));
    const mantissa = (E / Math.pow(10, exp)).toFixed(3);

    const signText = qMicro >= 0 ? 'חיובי (+)' : 'שלילי (-)';
    const dirText = qMicro >= 0 ? 'החוצה (מתרחק מהמטען)' : 'פנימה (לכיוון המטען)';

    resultDiv.innerHTML = `
      <div style="line-height:1.8;">
        <div><strong>תוצאת החישוב:</strong></div>
        <div>1. המרת נתונים: $|Q| = ${Math.abs(qMicro)}\cdot 10^{-6}\,\text{C}$, מרחק: $r = ${rM}\,\text{m}$.</div>
        <div>2. גודל השדה החשמלי: <strong>$E = ${mantissa} \cdot 10^{${exp}}\,\frac{\text{N}}{\text{C}}$</strong> (${Math.round(E).toLocaleString()} N/C).</div>
        <div>3. כיוון השדה: המטען ${signText}, לכן כיוון השדה הוא <strong>${dirText}</strong>.</div>
      </div>
    `;

    // Re-render KaTeX in result box
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(resultDiv, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  if (runBtn) {
    runBtn.addEventListener('click', calculateSandbox);
    calculateSandbox(); // Initial calculation on load
  }

  // 5. SVG Hover Enhancements
  const svgLines = document.querySelectorAll('.physics-svg line[stroke]');
  svgLines.forEach(line => {
    line.style.transition = 'stroke-width 0.2s, stroke 0.2s';
    line.addEventListener('mouseenter', () => {
      line.setAttribute('data-orig-width', line.getAttribute('stroke-width'));
      line.setAttribute('stroke-width', parseFloat(line.getAttribute('stroke-width') || 2) + 2);
    });
    line.addEventListener('mouseleave', () => {
      const orig = line.getAttribute('data-orig-width');
      if (orig) line.setAttribute('stroke-width', orig);
    });
  });

});
