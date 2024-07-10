document.addEventListener('DOMContentLoaded', () => {
  let isHighlighted = false;
  // 在页面加载时检索存储的前缀和后缀
  chrome.runtime.sendMessage({ action: 'getPrefixSuffix' }, (response) => {
    document.getElementById('prefix').value = response.prefix;
    document.getElementById('suffix').value = response.suffix;
  });

  document.getElementById('highlightFormulaBtn').addEventListener('click', () => {
    console.log("Highlight Formula button clicked.");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Active tab:", tabs[0]);

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: highlightFormulas,
	args: [isHighlighted]
      }).then(() => {
        console.log("Highlight script executed successfully.");
	isHighlighted = !isHighlighted;
      }).catch((error) => {
        console.error("Error executing highlight script:", error);
      });
    });
  });

  document.getElementById('convertFormulaBtn').addEventListener('click', () => {
    const prefix = document.getElementById('prefix').value || '';
    const suffix = document.getElementById('suffix').value || '';

    // 存储前缀和后缀到背景脚本
    chrome.runtime.sendMessage({ action: 'setPrefixSuffix', prefix, suffix }, (response) => {
      if (response.status === 'success') {
        console.log('Prefix and Suffix stored:', { prefix, suffix });

        console.log("Convert Formula button clicked.");

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          console.log("Active tab:", tabs[0]);

          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: convertFormulasToLatex,
            args: [prefix, suffix]
          }).then(() => {
            console.log("Convert script executed successfully.");
          }).catch((error) => {
            console.error("Error executing convert script:", error);
          });
        });
      }
    });
  });
});

function highlightFormulas(isHighlighted) {
  console.log("highlightFormulas function called.");
  const formulas = document.querySelectorAll("math, .math, .math-rendered, .MathJax, .katex");
  console.log("Found formulas:", formulas);

  formulas.forEach((formula, index) => {
    if (isHighlighted) {
      console.log(`Removing highlight from formula ${index + 1}`);
      formula.style.backgroundColor = "";
      formula.style.padding = "";
      formula.style.borderRadius = "";
      formula.style.border = "";
    } else {
      console.log(`Highlighting formula ${index + 1}`);
      formula.style.backgroundColor = "lightgoldenrodyellow";
      formula.style.padding = "10px";
      formula.style.borderRadius = "5px";
      formula.style.border = "2px solid lightcoral";
    }
  });
}

function convertFormulasToLatex(prefix, suffix) {
  console.log("convertFormulasToLatex function called with prefix:", prefix, "and suffix:", suffix);
  const formulas = document.querySelectorAll("math, .math, .math-rendered, .MathJax, .katex");
  console.log("Found formulas:", formulas);

  formulas.forEach((formula, index) => {
    console.log(`Converting formula ${index + 1}`);
    let latexCode = '';

    if (formula.tagName.toLowerCase() === 'math') {
      latexCode = formula.textContent || formula.innerHTML;
    } else if (formula.classList.contains('MathJax')) {
      latexCode = formula.getAttribute('data-tex') || formula.querySelector('.MathJax_SVG').getAttribute('aria-label');
    } else if (formula.classList.contains('katex')) {
      latexCode = formula.getAttribute('data-tex') || formula.querySelector('.katex-mathml annotation').textContent;
    } else {
      latexCode = formula.textContent;
    }

    latexCode = prefix + latexCode + suffix;
    console.log(`Extracted LaTeX code: ${latexCode}`);
    formula.textContent = latexCode;
  });
}
