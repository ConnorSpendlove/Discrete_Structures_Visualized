export default function(container) {
  container.innerHTML = `
    <h2>Binary Search (Ordered List)</h2>
    <p>Enter a sorted list of distinct integers separated by commas (max value 50):</p>
    <div class="binary-input-row">
      <input id="binaryInput" type="text" placeholder="e.g. 1, 3, 5, 7, 9">
      <input id="binaryTarget" type="number" placeholder="Value to search">
      <button id="binarySearchBtn">Visualize</button>
    </div>
    <div id="binaryArrayContainer" class="binary-array-container"></div>
    <p id="binaryResult"></p>
  `;

  const arrayInput = container.querySelector("#binaryInput");
  const targetInput = container.querySelector("#binaryTarget");
  const btn = container.querySelector("#binarySearchBtn");
  const arrayContainer = container.querySelector("#binaryArrayContainer");
  const result = container.querySelector("#binaryResult");

  function visualizeArray(arr) {
    arrayContainer.innerHTML = "";
    const maxVal = Math.max(...arr, 50);
    const containerWidth = arrayContainer.clientWidth - 50;

    arr.forEach(num => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("binary-bar-wrapper");

      const label = document.createElement("span");
      label.textContent = num;
      label.classList.add("binary-bar-label");

      const bar = document.createElement("div");
      bar.classList.add("binary-bar");

      const width = Math.max((num / maxVal) * containerWidth, 10);
      bar.style.width = `${width}px`;

      wrapper.appendChild(label);
      wrapper.appendChild(bar);
      arrayContainer.appendChild(wrapper);
    });
  }

  async function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    const wrappers = Array.from(arrayContainer.children);

    // Reset all bars
    wrappers.forEach(w => {
      const bar = w.querySelector(".binary-bar");
      bar.classList.remove("current", "found", "inactive", "active-range");
    });

    while (left <= right) {
      // Highlight current search range
      wrappers.forEach((w, idx) => {
        const bar = w.querySelector(".binary-bar");
        if (idx >= left && idx <= right) {
          bar.classList.add("active-range");
          bar.classList.remove("inactive");
        } else {
          bar.classList.add("inactive");
          bar.classList.remove("active-range", "current", "found");
        }
      });

      const mid = Math.floor((left + right) / 2);
      const midBar = wrappers[mid].querySelector(".binary-bar");
      midBar.classList.add("current");
      await new Promise(res => setTimeout(res, 700));

      if (arr[mid] === target) {
        midBar.classList.remove("current");
        midBar.classList.add("found");
        result.textContent = `Value ${target} found at index ${mid}`;
        return;
      } else if (arr[mid] < target) {
        midBar.classList.remove("current");
        left = mid + 1;
      } else {
        midBar.classList.remove("current");
        right = mid - 1;
      }
    }

    result.textContent = `Value ${target} not found in the array.`;
  }

  btn.addEventListener("click", async () => {
    let arr = arrayInput.value
      .split(",")
      .map(x => parseInt(x.trim()))
      .filter(x => !isNaN(x))
      .map(x => Math.min(x, 50));

    const target = parseInt(targetInput.value);

    if (!arr.length || isNaN(target)) {
      result.textContent = "Please enter valid numbers.";
      arrayContainer.innerHTML = "";
      return;
    }

    arr.sort((a,b) => a-b);
    visualizeArray(arr);
    result.textContent = "Visualizing...";
    await binarySearch(arr, target);
  });
};
