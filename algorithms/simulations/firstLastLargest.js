export default function(container) {
  container.innerHTML = `
    <h2>First + Last Occurrence of Largest Integer</h2>
    <p>Enter a list of integers separated by commas (max value 50):</p>
    <div class="input-row">
      <input id="occurrenceInput" type="text" placeholder="e.g. 4, 7, 2, 9, 7">
      <button id="findOccurrenceBtn">Visualize</button>
    </div>
    <div id="arrayContainer" class="array-container"></div>
    <p id="occurrenceResult"></p>
  `;

  const input = container.querySelector("#occurrenceInput");
  const btn = container.querySelector("#findOccurrenceBtn");
  const arrayContainer = container.querySelector("#arrayContainer");
  const result = container.querySelector("#occurrenceResult");

  // Visualize the array horizontally
  function visualizeArray(arr) {
    arrayContainer.innerHTML = "";

    const maxVal = Math.max(...arr, 50);
    const containerWidth = arrayContainer.clientWidth - 50;

    arr.forEach(num => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("array-bar-wrapper");

      const label = document.createElement("span");
      label.textContent = num;
      label.classList.add("bar-label");

      const bar = document.createElement("div");
      bar.classList.add("array-bar");

      const width = Math.max((num / maxVal) * containerWidth, 10);
      bar.style.width = `${width}px`;

      wrapper.appendChild(label);
      wrapper.appendChild(bar);
      arrayContainer.appendChild(wrapper);
    });
  }

  // Highlight first and last occurrence
  async function highlightOccurrences(arr) {
    let maxVal = Math.max(...arr);
    let firstIndex = -1;
    let lastIndex = -1;

    const wrappers = Array.from(arrayContainer.children);
    wrappers.forEach(w => w.querySelector(".array-bar").classList.remove("current", "max", "first", "last"));

    for (let i = 0; i < arr.length; i++) {
      const bar = wrappers[i].querySelector(".array-bar");
      bar.classList.add("current");
      await new Promise(res => setTimeout(res, 500));

      if (arr[i] === maxVal) {
        if (firstIndex === -1) firstIndex = i;
        lastIndex = i;
      }

      bar.classList.remove("current");
    }

    // Highlight first and last
    if (firstIndex !== -1) wrappers[firstIndex].querySelector(".array-bar").classList.add("first");
    if (lastIndex !== -1) wrappers[lastIndex].querySelector(".array-bar").classList.add("last");

    result.textContent = `Largest number is ${maxVal}. First occurrence at index ${firstIndex}, last occurrence at index ${lastIndex}.`;
  }

  btn.addEventListener("click", async () => {
    let arr = input.value
      .split(",")
      .map(x => parseInt(x.trim()))
      .filter(x => !isNaN(x))
      .map(x => Math.min(x, 50));

    if (!arr.length) {
      result.textContent = "Please enter valid numbers.";
      arrayContainer.innerHTML = "";
      return;
    }

    visualizeArray(arr);
    result.textContent = "Visualizing...";
    await highlightOccurrences(arr);
  });
}
