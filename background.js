chrome.runtime.onMessageExternal.addListener( (request, sender, sendResponse) => {
  if (request.action === 'play' || request.action === 'pause') {
    sendResponse({ status: 'success' });
  }
});