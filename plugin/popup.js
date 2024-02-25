// popup.js

document.getElementById('disable-all-tex').addEventListener('click', () => {
  chrome.tabs.executeScript({
    code: `(${disableKatexRendering.toString()})(); (${observeDOMChanges.toString()})();`,
  });
  window.close(); // 关闭当前窗口
});

document.getElementById('restore-all-tex').addEventListener('click', () => {
  chrome.tabs.executeScript({
    code: `(${restoreKatexRendering.toString()})();`,
  });
  window.close(); // 关闭当前窗口
});

function disableKatexRendering(depth = 0) {
  const maxDepth = 5; // 设置最大递归深度，以避免无限循环
  const katexElements = document.getElementsByClassName('katex');
  if (katexElements.length === 0 || depth > maxDepth) {
    return; // 如果没有元素需要处理或达到递归深度，停止执行
  }

  let originalKatexHTML = [];

  for (let i = 0; i < katexElements.length; i++) {
    const katexElement = katexElements[i];
    const katexHTML = katexElement.outerHTML;
    originalKatexHTML.push(katexHTML);

    const katexMathmlElement = katexElement.querySelector('.katex-mathml');
    const annotationElement = katexMathmlElement ? katexMathmlElement.querySelector('annotation') : null;
    if (annotationElement) {
      const sourceCode = annotationElement.textContent;
      const formattedSourceCode = '$' + sourceCode + '$';
      katexElement.outerHTML = formattedSourceCode;
    }
  }

  chrome.storage.local.get('originalKatexHTML', function(data) {
    const storedHTML = data.originalKatexHTML || [];
    const updatedHTML = storedHTML.concat(originalKatexHTML);
    chrome.storage.local.set({'originalKatexHTML': updatedHTML}, function() {
      console.log('Katex HTML is saved.');
    });
  });

  // 递归调用自身，以尝试处理新的或遗漏的KaTeX元素
  if (depth < maxDepth) {
    disableKatexRendering(depth + 1);
  }
}

function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        disableKatexRendering(); // 不需要递归深度，observeDOMChanges保证在DOM变化时触发
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function restoreKatexRendering() {
  // 从chrome.storage中检索originalKatexHTML
  chrome.storage.local.get('originalKatexHTML', function(data) {
    const originalKatexHTML = data.originalKatexHTML || [];
    const sourceCodes = document.body.querySelectorAll(':contains("$"):not(script):not(noscript):not(style)');
    
    sourceCodes.forEach((node, index) => {
      if (originalKatexHTML[index]) {
        node.outerHTML = originalKatexHTML[index]; // 使用存储的HTML恢复元素
      }
    });
  });
}
