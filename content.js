
let utterance;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'play') {
    if (utterance) {
      speechSynthesis.cancel();
    }

    // Use Readability to parse the document
    const docClone = document.cloneNode(true);
    const article = new Readability(docClone).parse();
    const content = article ? article.textContent : document.body.innerText;

    utterance = new SpeechSynthesisUtterance(content);
    utterance.pitch = request.tone === 'happy' ? 2 : request.tone === 'sad' ? 0.5 : 1;
    utterance.rate = request.tone === 'suggestive' ? 0.8 : 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  } else if (request.action === 'pause') {
    speechSynthesis.pause();
  }
});