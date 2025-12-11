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

  function visualizeText(text, startIdx, patternLength, matches) {
    visualizer.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement("span");
      span.textContent = text[i];
      span.classList.add("text-char");

      // Highlight current window
      if (i >= startIdx && i < startIdx + patternLength) {
        span.classList.add("current-window");
      }

      // Highlight confirmed matches
      if (matches.includes(i)) {
        span.classList.add("match");
      }

      visualizer.appendChild(span);
    }
  }

  async function naiveSearch(text, pattern) {
    const matchStartIndices = [];

    for (let i = 0; i <= text.length - pattern.length; i++) {
      // Visualize current window and previous matches
      visualizeText(
        text,
        i,
        pattern.length,
        matchStartIndices.flatMap(start =>
          Array.from({ length: pattern.length }, (_, j) => start + j)
        )
      );

      await new Promise(res => setTimeout(res, 400));

      let match = true;
      for (let j = 0; j < pattern.length; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }

      if (match) {
        matchStartIndices.push(i); // store starting index only
      }
    }

    return matchStartIndices;
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
    const matchStartIndices = await naiveSearch(text, pattern);

    if (matchStartIndices.length > 0) {
      result.textContent = `Pattern found at positions: ${matchStartIndices
        .map(i => i + 1)
        .join(", ")}`;
    } else {
      result.textContent = "Pattern not found.";
    }
  });
}
