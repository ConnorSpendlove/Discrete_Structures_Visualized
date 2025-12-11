export default function(container) {
  container.innerHTML = `
    <h2>Linear Search (Distinct Integers)</h2>
    <p>Enter a list of distinct integers separated by commas (max value 50):</p>
    <div class="linear-input-row">
      <input id="linearInput" type="text" placeholder="e.g. 3, 7, 1, 9">
      <input id="searchValue" type="number" placeholder="Value to search">
      <button id="linearSearchBtn">Visualize</button>
    </div>
    <div id="linearArrayContainer" class="linear-array-container"></div>
    <p id="linearResult"></p>
  `;

  const arrayInput = container.querySelector("#linearInput");
  const valueInput = container.querySelector("#searchValue");
  const btn = container.querySelector("#linearSearchBtn");
  const arrayContainer = container.querySelector("#linearArrayContainer");
  const result = container.querySelector("#linearResult");

  // Visualize the array
  function visualizeArray(arr) {
    arrayContainer.innerHTML = "";
    const maxVal = Math.max(...arr, 50);
    const containerWidth = arrayContainer.clientWidth - 50;

    arr.forEach(num => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("linear-bar-wrapper");

      const label = document.createElement("span");
      label.textContent = num;
      label.classList.add("linear-bar-label");

      const bar = document.createElement("div");
      bar.classList.add("linear-bar");
      const width = Math.max((num / maxVal) * containerWidth, 10);
      bar.style.width = `${width}px`;

      wrapper.appendChild(label);
      wrapper.appendChild(bar);
      arrayContainer.appendChild(wrapper);
    });
  }

  // Step-by-step linear search visualization
  async function linearSearch(arr, target) {
    const wrappers = Array.from(arrayContainer.children);
    wrappers.forEach(w => w.querySelector(".linear-bar").classList.remove("current", "found"));

    for (let i = 0; i < arr.length; i++) {
      const bar = wrappers[i].querySelector(".linear-bar");
      bar.classList.add("current");
      await new Promise(res => setTimeout(res, 500));

      if (arr[i] === target) {
        bar.classList.remove("current");
        bar.classList.add("found");
        result.textContent = `Value ${target} found at index ${i}`;
        return;
      }
      bar.classList.remove("current");
    }

    result.textContent = `Value ${target} not found in the array.`;
  }

  btn.addEventListener("click", async () => {
    let arr = arrayInput.value
      .split(",")
      .map(x => parseInt(x.trim()))
      .filter(x => !isNaN(x))
      .map(x => Math.min(x, 50));

    const target = parseInt(valueInput.value);

    if (!arr.length || isNaN(target)) {
      result.textContent = "Please enter valid numbers.";
      arrayContainer.innerHTML = "";
      return;
    }

    visualizeArray(arr);
    result.textContent = "Visualizing...";
    await linearSearch(arr, target);
  });
};
