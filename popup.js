document.getElementById('read').addEventListener('click', () => {
    console.log('Read button clicked');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: analyzeAndReadText,
      }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log('Script executed successfully');
        }
      });
    });
  });
  
  function analyzeAndReadText() {
    console.log('Analyzing and reading text');
    fetch('https://cdn.jsdelivr.net/npm/sentiment@5.1.1/build/sentiment.min.js')
      .then(response => response.text())
      .then(scriptContent => {
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.head.appendChild(script);
        script.onload = () => {
          console.log('Sentiment.js loaded');
          const sentiment = new Sentiment();
          const text = document.body.innerText;
          const sentences = text.split('.');
          
          sentences.forEach(sentence => {
            const result = sentiment.analyze(sentence);
            console.log(`Sentence: "${sentence}", Score: ${result.score}`);
            const utterance = new SpeechSynthesisUtterance(sentence);
            
            if (result.score > 0) {
              utterance.pitch = 1.5; // Happy tone
            } else if (result.score < 0) {
              utterance.pitch = 0.5; // Sad tone
            } else {
              utterance.pitch = 1.0; // Neutral tone
            }
            
            speechSynthesis.speak(utterance);
          });
        };
      })
      .catch(error => console.error('Error loading Sentiment.js:', error));
  }