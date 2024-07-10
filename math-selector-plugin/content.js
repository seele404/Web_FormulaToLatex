// content.js
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
document.head.appendChild(script);

script.onload = () => {
  console.log("MathJax library loaded.");
};