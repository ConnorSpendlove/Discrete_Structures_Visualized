export default function(container) {
  container.innerHTML = `
    <h2>Find the Largest Integer</h2>
    <p>Enter a list of integers separated by commas (max value 50):</p>
    <div class="input-row">
      <input id="largestInput" type="text" placeholder="e.g. 4, 7, 2, 9">
      <button id="findLargestBtn">Visualize</button>
    </div>
    <div id="arrayContainer" class="array-container"></div>
    <p id="largestResult"></p>
  `;

  const input = container.querySelector("#largestInput");
  const btn = container.querySelector("#findLargestBtn");
  const arrayContainer = container.querySelector("#arrayContainer");
  const result = container.querySelector("#largestResult");

  // Visualization function
  function visualizeArray(arr) {
    arrayContainer.innerHTML = "";

    // Determine scaling factor
    const maxVal = Math.max(...arr, 50); // ensure at least 50 for scaling
    const containerWidth = arrayContainer.clientWidth - 50; // padding for text

    arr.forEach(num => {
      const barWrapper = document.createElement("div");
      barWrapper.classList.add("array-bar-wrapper");

      const label = document.createElement("span");
      label.textContent = num;
      label.classList.add("bar-label");

      const bar = document.createElement("div");
      bar.classList.add("array-bar");

      // Scale bar width
      const width = Math.max((num / maxVal) * containerWidth, 10); // minimum width 10px
      bar.style.width = `${width}px`;

      barWrapper.appendChild(label);
      barWrapper.appendChild(bar);
      arrayContainer.appendChild(barWrapper);
    });
  }

  // Highlight the largest element
  async function highlightLargest(arr) {
    let maxIndex = 0;
    const wrappers = Array.from(arrayContainer.children);

    wrappers.forEach(w => w.querySelector(".array-bar").classList.remove("max", "current"));

    for (let i = 1; i < arr.length; i++) {
      const bar = wrappers[i].querySelector(".array-bar");
      bar.classList.add("current");
      await new Promise(res => setTimeout(res, 500));

      if (arr[i] > arr[maxIndex]) {
        wrappers[maxIndex].querySelector(".array-bar").classList.remove("max");
        maxIndex = i;
        wrappers[maxIndex].querySelector(".array-bar").classList.add("max");
      }

      bar.classList.remove("current");
    }

    result.textContent = `The largest number is: ${arr[maxIndex]}`;
  }

  btn.addEventListener("click", async () => {
    let arr = input.value
      .split(",")
      .map(x => parseInt(x.trim()))
      .filter(x => !isNaN(x))
      .map(x => Math.min(x, 50)); // clamp max value to 50

    if (!arr.length) {
      result.textContent = "Please enter valid numbers.";
      arrayContainer.innerHTML = "";
      return;
    }

    visualizeArray(arr);
    result.textContent = "Visualizing...";
    await highlightLargest(arr);
  });
}
