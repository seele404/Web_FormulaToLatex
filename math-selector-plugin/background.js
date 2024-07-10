let prefix = '$';
let suffix = '$';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getPrefixSuffix') {
    sendResponse({ prefix, suffix });
  } else if (message.action === 'setPrefixSuffix') {
    prefix = message.prefix;
    suffix = message.suffix;
    sendResponse({ status: 'success' });
  }
});
