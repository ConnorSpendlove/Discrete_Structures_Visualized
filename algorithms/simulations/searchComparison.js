export default function(container) {
  container.innerHTML = `
    <h2>Linear vs Binary Search Comparison</h2>
    <p>Enter a sorted list of integers and a target number:</p>
    <div class="input-row-lvb">
      <input id="lvbInput" type="text" placeholder="e.g. 1,2,3,4,5">
      <input id="lvbTarget" type="number" placeholder="Target">
      <button id="lvbStartBtn">Start Search</button>
    </div>

    <div class="search-comparison">
      <div class="search-container-lvb">
        <h3>Linear Search</h3>
        <div id="linearContainer" class="array-container-lvb"></div>
        <p>Comparisons: <span id="linearCount">0</span></p>
        <p>Time: <span id="linearTime">0</span> ms</p>
      </div>
      <div class="search-container-lvb">
        <h3>Binary Search</h3>
        <div id="binaryContainer" class="array-container-lvb"></div>
        <p>Comparisons: <span id="binaryCount">0</span></p>
        <p>Time: <span id="binaryTime">0</span> ms</p>
      </div>
    </div>
  `;

  const input = container.querySelector("#lvbInput");
  const targetInput = container.querySelector("#lvbTarget");
  const startBtn = container.querySelector("#lvbStartBtn");

  const linearContainer = container.querySelector("#linearContainer");
  const binaryContainer = container.querySelector("#binaryContainer");
  const linearCount = container.querySelector("#linearCount");
  const binaryCount = container.querySelector("#binaryCount");
  const linearTime = container.querySelector("#linearTime");
  const binaryTime = container.querySelector("#binaryTime");

  function renderArray(containerEl, arr) {
    containerEl.innerHTML = "";
    arr.forEach(num => {
      const bar = document.createElement("div");
      bar.className = "array-bar-lvb";
      bar.textContent = num;
      containerEl.appendChild(bar);
    });
  }

  function linearSearch(arr, target, callback) {
    let i = 0;
    let comparisons = 0;
    const start = performance.now();

    const interval = setInterval(() => {
      if (i > 0) {
        arrBars[i - 1].classList.remove("current");
      }
      if (i >= arr.length) {
        clearInterval(interval);
        linearTime.textContent = Math.round(performance.now() - start);
        callback(comparisons);
        return;
      }

      arrBars[i].classList.add("current");
      comparisons++;
      linearCount.textContent = comparisons;

      if (arr[i] === target) {
        arrBars[i].classList.add("found");
        clearInterval(interval);
        linearTime.textContent = Math.round(performance.now() - start);
        callback(comparisons);
        return;
      }

      i++;
    }, 300);

    const arrBars = Array.from(linearContainer.children);
  }

  function binarySearch(arr, target, callback) {
    let left = 0, right = arr.length - 1;
    let comparisons = 0;
    const start = performance.now();

    const interval = setInterval(() => {
      // Remove previous highlights
      arrBars.forEach(bar => bar.classList.remove("current"));

      if (left > right) {
        clearInterval(interval);
        binaryTime.textContent = Math.round(performance.now() - start);
        callback(comparisons);
        return;
      }

      const mid = Math.floor((left + right) / 2);
      arrBars[mid].classList.add("current");
      comparisons++;
      binaryCount.textContent = comparisons;

      if (arr[mid] === target) {
        arrBars[mid].classList.add("found");
        clearInterval(interval);
        binaryTime.textContent = Math.round(performance.now() - start);
        callback(comparisons);
        return;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }, 400);

    const arrBars = Array.from(binaryContainer.children);
  }

  startBtn.addEventListener("click", () => {
    const arr = input.value.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    const target = parseInt(targetInput.value);

    if (!arr.length || isNaN(target)) return;

    renderArray(linearContainer, arr);
    renderArray(binaryContainer, arr);

    linearCount.textContent = 0;
    binaryCount.textContent = 0;
    linearTime.textContent = 0;
    binaryTime.textContent = 0;

    linearSearch(arr, target, () => {});
    binarySearch(arr, target, () => {});
  });
}
