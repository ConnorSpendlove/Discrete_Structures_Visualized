export default function(container) {
  container.innerHTML = `
    <h2>Naive String Matching</h2>
    <p>Enter the text and the pattern to search for:</p>
    <div class="string-input-row">
      <input id="textInput" type="text" placeholder="Text e.g. ababcabc">
      <input id="patternInput" type="text" placeholder="Pattern e.g. abc">
      <button id="searchBtn">Visualize</button>
    </div>
    <div id="textVisualizer" class="text-visualizer"></div>
    <p id="matchResult"></p>
  `;

  const textInput = container.querySelector("#textInput");
  const patternInput = container.querySelector("#patternInput");
  const btn = container.querySelector("#searchBtn");
  const visualizer = container.querySelector("#textVisualizer");
  const result = container.querySelector("#matchResult");

  function visualizeText(text, pattern, currentIndex, matchIndex) {
    visualizer.innerHTML = "";
    text.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("text-char");

      if (i >= currentIndex && i < currentIndex + pattern.length) {
        span.classList.add("current-window");
      }
      if (matchIndex.includes(i)) {
        span.classList.add("match");
      }

      visualizer.appendChild(span);
    });
  }

  async function naiveSearch(text, pattern) {
    const matches = [];
    for (let i = 0; i <= text.length - pattern.length; i++) {
      visualizeText(text, pattern, i, matches);
      await new Promise(res => setTimeout(res, 400));

      let match = true;
      for (let j = 0; j < pattern.length; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }

      if (match) {
        for (let k = i; k < i + pattern.length; k++) {
          matches.push(k);
        }
        visualizeText(text, pattern, i, matches);
        await new Promise(res => setTimeout(res, 400));
      }
    }

    return matches;
  }

  btn.addEventListener("click", async () => {
    const text = textInput.value;
    const pattern = patternInput.value;

    if (!text || !pattern) {
      result.textContent = "Please enter both text and pattern.";
      visualizer.innerHTML = "";
      return;
    }

    result.textContent = "Visualizing...";
    const matchIndices = await naiveSearch(text, pattern);

    if (matchIndices.length > 0) {
      result.textContent = `Pattern found at positions: ${matchIndices.map((_, idx) => idx + 1).join(", ")}`;
    } else {
      result.textContent = "Pattern not found.";
    }
  });
};
