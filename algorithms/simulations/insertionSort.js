export default function(container) {
  container.innerHTML = `
    <h2>Insertion Sort</h2>
    <p>Enter a list of integers separated by commas (max value 50):</p>
    <div class="insertion-input-row">
      <input id="insertionInput" type="text" placeholder="e.g. 4, 7, 2, 9">
      <button id="insertionSortBtn">Visualize</button>
    </div>
    <div id="insertionArrayContainer" class="insertion-array-container"></div>
    <p id="insertionResult"></p>
  `;

  const arrayInput = container.querySelector("#insertionInput");
  const btn = container.querySelector("#insertionSortBtn");
  const arrayContainer = container.querySelector("#insertionArrayContainer");
  const result = container.querySelector("#insertionResult");

  function visualizeArray(arr) {
    arrayContainer.innerHTML = "";
    const maxVal = Math.max(...arr, 50);
    const containerWidth = arrayContainer.clientWidth - 50;

    arr.forEach(num => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("insertion-bar-wrapper");

      const label = document.createElement("span");
      label.textContent = num;
      label.classList.add("insertion-bar-label");

      const bar = document.createElement("div");
      bar.classList.add("insertion-bar");

      const width = Math.max((num / maxVal) * containerWidth, 10);
      bar.style.width = `${width}px`;

      wrapper.appendChild(label);
      wrapper.appendChild(bar);
      arrayContainer.appendChild(wrapper);
    });
  }

  async function insertionSort(arr) {
    const wrappers = Array.from(arrayContainer.children);

    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;

      const keyBar = wrappers[i].querySelector(".insertion-bar");
      keyBar.classList.add("current");
      await new Promise(res => setTimeout(res, 500));

      // Shift elements of the sorted portion to the right
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];

        const barJ = wrappers[j].querySelector(".insertion-bar");
        const labelJ = wrappers[j].querySelector(".insertion-bar-label");
        const labelNext = wrappers[j+1].querySelector(".insertion-bar-label");
        const barNext = wrappers[j+1].querySelector(".insertion-bar");

        barNext.style.width = barJ.style.width;
        labelNext.textContent = labelJ.textContent;

        barJ.classList.remove("current");
        barJ.classList.add("sorted");

        j--;
        await new Promise(res => setTimeout(res, 400));
      }

      arr[j + 1] = key;
      const barInsert = wrappers[j + 1].querySelector(".insertion-bar");
      const labelInsert = wrappers[j + 1].querySelector(".insertion-bar-label");
      barInsert.style.width = keyBar.style.width;
      labelInsert.textContent = key;
      barInsert.classList.remove("current");
      barInsert.classList.add("sorted");
      await new Promise(res => setTimeout(res, 300));
    }

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
    await insertionSort(arr);
  });
};
