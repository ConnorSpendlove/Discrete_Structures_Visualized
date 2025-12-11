export default function(container) {
  container.innerHTML = `
    <h2>Bubble Sort vs Insertion Sort Comparison</h2>
    <p>Enter a list of integers to sort:</p>
    <div class="input-row-bvi">
      <input id="bviInput" type="text" placeholder="e.g. 5,3,8,1,2">
      <button id="bviStartBtn">Start Sorting</button>
    </div>

    <div class="sort-comparison">
      <div class="sort-container-bvi">
        <h3>Bubble Sort</h3>
        <div id="bubbleContainer" class="array-container-bvi"></div>
        <p>Comparisons: <span id="bubbleCount">0</span></p>
        <p>Time: <span id="bubbleTime">0</span> ms</p>
      </div>

      <div class="sort-container-bvi">
        <h3>Insertion Sort</h3>
        <div id="insertionContainer" class="array-container-bvi"></div>
        <p>Comparisons: <span id="insertionCount">0</span></p>
        <p>Time: <span id="insertionTime">0</span> ms</p>
      </div>
    </div>
  `;

  const input = container.querySelector("#bviInput");
  const startBtn = container.querySelector("#bviStartBtn");

  const bubbleContainer = container.querySelector("#bubbleContainer");
  const insertionContainer = container.querySelector("#insertionContainer");

  const bubbleCountEl = container.querySelector("#bubbleCount");
  const insertionCountEl = container.querySelector("#insertionCount");

  const bubbleTimeEl = container.querySelector("#bubbleTime");
  const insertionTimeEl = container.querySelector("#insertionTime");

  function renderArray(containerEl, arr) {
    containerEl.innerHTML = "";
    arr.forEach(num => {
      const bar = document.createElement("div");
      bar.className = "array-bar-bvi";
      bar.textContent = num;
      containerEl.appendChild(bar);
    });
  }

  async function bubbleSort(arr) {
    const bars = Array.from(bubbleContainer.children);
    let comparisons = 0;
    const start = performance.now();

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        bars[j].classList.add("current");
        bars[j+1].classList.add("current");
        comparisons++;
        bubbleCountEl.textContent = comparisons;

        await new Promise(r => setTimeout(r, 300));

        if (arr[j] > arr[j+1]) {
          [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
          bars[j].textContent = arr[j];
          bars[j+1].textContent = arr[j+1];
          bars[j].classList.add("swapping");
          bars[j+1].classList.add("swapping");

          await new Promise(r => setTimeout(r, 300));

          bars[j].classList.remove("swapping");
          bars[j+1].classList.remove("swapping");
        }

        bars[j].classList.remove("current");
        bars[j+1].classList.remove("current");
      }
      bars[arr.length - i - 1].classList.add("sorted");
    }

    bubbleTimeEl.textContent = Math.round(performance.now() - start);
  }

  async function insertionSort(arr) {
    const bars = Array.from(insertionContainer.children);
    let comparisons = 0;
    const start = performance.now();

    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;

      bars[i].classList.add("current");
      await new Promise(r => setTimeout(r, 300));

      while (j >= 0 && arr[j] > key) {
        comparisons++;
        insertionCountEl.textContent = comparisons;

        arr[j+1] = arr[j];
        bars[j+1].textContent = arr[j+1];

        bars[j].classList.add("swapping");
        bars[j+1].classList.add("swapping");
        await new Promise(r => setTimeout(r, 300));
        bars[j].classList.remove("swapping");
        bars[j+1].classList.remove("swapping");

        bars[j].classList.remove("current");
        j--;
      }
      arr[j+1] = key;
      bars[j+1].textContent = key;

      for (let k = 0; k <= i; k++) bars[k].classList.add("sorted");

      bars[i].classList.remove("current");
      await new Promise(r => setTimeout(r, 200));
    }

    insertionTimeEl.textContent = Math.round(performance.now() - start);
  }

  startBtn.addEventListener("click", () => {
    const arr = input.value.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (!arr.length) return;

    renderArray(bubbleContainer, [...arr]);
    renderArray(insertionContainer, [...arr]);

    bubbleCountEl.textContent = 0;
    insertionCountEl.textContent = 0;
    bubbleTimeEl.textContent = 0;
    insertionTimeEl.textContent = 0;

    bubbleSort([...arr]);
    insertionSort([...arr]);
  });
}
