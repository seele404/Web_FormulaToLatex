// 当点击"disable-all-tex"按钮时，执行禁用 Katex 渲染的函数，并关闭当前窗口
document.getElementById('disable-all-tex').addEventListener('click', () => {
  chrome.tabs.executeScript({
    // 执行禁用 Katex 渲染的函数五次，以确保覆盖所有 Katex 元素
    code: '(' + disableKatexRendering.toString() + ')();'+
    '(' + disableKatexRendering.toString() + ')();'+
    '(' + disableKatexRendering.toString() + ')();'+
    '(' + disableKatexRendering.toString() + ')();'+
    '(' + disableKatexRendering.toString() + ')();',
  });
  window.close(); // 关闭当前窗口
});

// 当点击"disable-katex-mathtype"按钮时，执行禁用 Katex 渲染（不包括分隔符）的函数，并关闭当前窗口
document.getElementById('disable-katex-mathtype').addEventListener('click', () => {
  chrome.tabs.executeScript({
    // 执行禁用 Katex 渲染（不包括分隔符）的函数五次，以确保覆盖所有 Katex 元素
    code: '(' + disableKatexRenderingWithoutDelimiters.toString() + ')();'+
    '(' + disableKatexRenderingWithoutDelimiters.toString() + ')();'+
    '(' + disableKatexRenderingWithoutDelimiters.toString() + ')();'+
    '(' + disableKatexRenderingWithoutDelimiters.toString() + ')();'+
    '(' + disableKatexRenderingWithoutDelimiters.toString() + ')();',
  });
  window.close(); // 关闭当前窗口
});

// 禁用 Katex 渲染并显示 LaTeX 公式的源代码
function disableKatexRendering() {
  const katexMathmlElements = document.getElementsByClassName('katex-mathml');
  for (let i = 0; i < katexMathmlElements.length; i++) {
    const katexMathmlElement = katexMathmlElements[i];
    const annotationElement = katexMathmlElement.querySelector('annotation');
    const sourceCode = annotationElement.textContent;

    // 构建带有$符的 LaTeX 公式源代码
    const formattedSourceCode = '$' + sourceCode + '$';
    const sourceCodeNode = document.createTextNode(formattedSourceCode);
    const katexHtmlElement = katexMathmlElement.nextElementSibling;
    const katexElement = katexHtmlElement.parentElement;

    // 将 Katex 元素替换为 LaTeX 公式的源代码节点
    katexElement.replaceWith(sourceCodeNode);
  }
}

// 禁用 Katex 渲染并显示 LaTeX 公式的源代码（不包括分隔符）
function disableKatexRenderingWithoutDelimiters() {
  const katexMathmlElements = document.getElementsByClassName('katex-mathml');
  for (let i = 0; i < katexMathmlElements.length; i++) {
    const katexMathmlElement = katexMathmlElements[i];
    const annotationElement = katexMathmlElement.querySelector('annotation');
    const sourceCode = annotationElement.textContent;

    // 构建不带分隔符的 LaTeX 公式源代码
    const sourceCodeNode = document.createTextNode(sourceCode);
    const katexHtmlElement = katexMathmlElement.nextElementSibling;
    const katexElement = katexHtmlElement.parentElement;

    // 将 Katex 元素替换为 LaTeX 公式的源代码节点
    katexElement.replaceWith(sourceCodeNode);
  }
}

