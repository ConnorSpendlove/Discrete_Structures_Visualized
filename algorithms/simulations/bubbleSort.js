export default function(container) {
  container.innerHTML = `
    <h2>Bubble Sort</h2>
    <p>Enter a list of integers separated by commas (max value 50):</p>
    <div class="bubble-input-row">
      <input id="bubbleInput" type="text" placeholder="e.g. 4, 7, 2, 9">
      <button id="bubbleSortBtn">Visualize</button>
    </div>
    <div id="bubbleArrayContainer" class="bubble-array-container"></div>
    <p id="bubbleResult"></p>
  `;

  const arrayInput = container.querySelector("#bubbleInput");
  const btn = container.querySelector("#bubbleSortBtn");
  const arrayContainer = container.querySelector("#bubbleArrayContainer");
  const result = container.querySelector("#bubbleResult");

  function visualizeArray(arr) {
    arrayContainer.innerHTML = "";
    const maxVal = Math.max(...arr, 50);
    const containerWidth = arrayContainer.clientWidth - 50;

    arr.forEach(num => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("bubble-bar-wrapper");

      const label = document.createElement("span");
      label.textContent = num;
      label.classList.add("bubble-bar-label");

      const bar = document.createElement("div");
      bar.classList.add("bubble-bar");

      const width = Math.max((num / maxVal) * containerWidth, 10);
      bar.style.width = `${width}px`;

      wrapper.appendChild(label);
      wrapper.appendChild(bar);
      arrayContainer.appendChild(wrapper);
    });
  }

  async function bubbleSort(arr) {
    const wrappers = Array.from(arrayContainer.children);
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const barA = wrappers[j].querySelector(".bubble-bar");
        const barB = wrappers[j+1].querySelector(".bubble-bar");

        barA.classList.add("current");
        barB.classList.add("current");
        await new Promise(res => setTimeout(res, 400));

        if (arr[j] > arr[j+1]) {
          // Swap values in array
          [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
          // Swap widths visually
          const tempWidth = barA.style.width;
          barA.style.width = barB.style.width;
          barB.style.width = tempWidth;

          // Swap labels
          wrappers[j].querySelector(".bubble-bar-label").textContent = arr[j];
          wrappers[j+1].querySelector(".bubble-bar-label").textContent = arr[j+1];
        }

        barA.classList.remove("current");
        barB.classList.remove("current");
      }
      // Mark last sorted element
      wrappers[n - i - 1].querySelector(".bubble-bar").classList.add("sorted");
    }
    // Mark first element as sorted
    wrappers[0].querySelector(".bubble-bar").classList.add("sorted");
    result.textContent = "Array sorted!";
  }

  btn.addEventListener("click", async () => {
    let arr = arrayInput.value
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
    await bubbleSort(arr);
  });
};
