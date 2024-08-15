let utterance;
let isPaused = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'play') {
    if (isPaused) {
      // If paused, resume the speech
      speechSynthesis.resume();
      isPaused = false;
    } else {
      if (utterance) {
        speechSynthesis.cancel();
      }
    }

    // Use Readability to parse the document
    const docClone = document.cloneNode(true);
    const article = new Readability(docClone).parse();
    const content = article ? article.textContent : document.body.innerText;

    utterance = new SpeechSynthesisUtterance(content);
    switch (request.tone) {
      case 'happy':
        utterance.pitch = 2.7;  // Higher pitch
        utterance.rate = 1.5;   // Faster rate
        break;
      case 'sad':
        utterance.pitch = 0.5;  // Lower pitch
        utterance.rate = 0.5;   // Slightly slower rate
        break;
      case 'angry':
        utterance.pitch = 0.7;  // Slightly lower pitch
        utterance.rate = 2.8;   // Much faster rate
        break;
      default:
        utterance.pitch = 1;    // Neutral pitch
        utterance.rate = 1;     // Neutral rate
    }
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  } else if (request.action === 'pause') {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      // Pause the speech
      speechSynthesis.pause();
      isPaused = true;
    }
  } else if (request.action === 'stop') {
    if (speechSynthesis.speaking) {
      // Stop the speech completely
      speechSynthesis.cancel();
      isPaused = false;
      utterance = null;
    }
  }
});