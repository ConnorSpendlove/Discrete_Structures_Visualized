// --- Math Helpers ---
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function combinations(arr, r) {
  if (r === 0) return [[]];
  if (arr.length < r) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, r - 1).map(c => [first, ...c]);
  const withoutFirst = combinations(rest, r);
  return [...withFirst, ...withoutFirst];
}

function permutations(arr, r) {
  if (r === 0) return [[]];
  return arr.flatMap((val, i) =>
    permutations([...arr.slice(0, i), ...arr.slice(i + 1)], r - 1).map(p => [val, ...p])
  );
}

// --- Dynamic Color Generator ---
function generateColorMap(elements) {
  const colorMap = {};
  const total = elements.length;
  elements.forEach((el, i) => {
    const hue = Math.round((360 / total) * i);
    colorMap[el] = `hsl(${hue}, 80%, 60%)`;
  });
  return colorMap;
}

// --- Global State ---
let currentGeneration = 0;
let customNames = [];
let setType = "letters"; // default

// --- Update Set Display ---
function updateSetDisplay() {
  const n = parseInt(document.getElementById("n").value);
  if (!n || n < 1) return;

  let elements;
  if (setType === "letters") {
    elements = Array.from({ length: n }, (_, i) => i < 26 ? String.fromCharCode(65 + i) : `X${i+1}`);
    customNames = [];
  } else if (setType === "numbers") {
    elements = Array.from({ length: n }, (_, i) => (i + 1).toString());
    customNames = [];
  } else {
    // For custom, fill any missing values
    elements = Array.from({ length: n }, (_, i) => customNames[i] || `X${i+1}`);
    customNames = [...elements];
  }

  const colorMap = generateColorMap(elements);

  // --- Clear and redraw the setDisplay ---
  const setDisplay = document.getElementById("setDisplay");
  setDisplay.innerHTML = `<h3>Current Set:</h3>`;
  const container = document.createElement("div");
  container.className = "combo-box";

  if (setType === "custom") {
    elements.forEach((el, i) => {
      const input = document.createElement("input");
      input.value = el;
      input.className = "name-input";
      input.style.setProperty("--ball-color", colorMap[el]);

      // Update customNames on input without rebuilding the inputs
      input.addEventListener("input", (e) => {
        customNames[i] = e.target.value;
        // live-update display balls above (optional)
        updateSetDisplayBallsOnly();
      });

      // Arrow key navigation
      input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" && i < elements.length - 1) {
          e.preventDefault();
          container.children[i + 1].focus();
        } else if (e.key === "ArrowLeft" && i > 0) {
          e.preventDefault();
          container.children[i - 1].focus();
        }
      });

      container.appendChild(input);
    });
  } else {
    elements.forEach(el => {
      const ball = document.createElement("div");
      ball.className = "ball";
      ball.style.setProperty("--ball-color", colorMap[el]);
      ball.textContent = el;
      container.appendChild(ball);
    });
  }

  setDisplay.appendChild(container);
  return elements;
}

// --- Update only the display balls above the editor (custom live update) ---
function updateSetDisplayBallsOnly() {
  if (setType !== "custom") return;
  const setDisplay = document.getElementById("setDisplay");
  const container = setDisplay.querySelector(".combo-box");
  if (!container) return;
  const colorMap = generateColorMap(customNames);
  container.querySelectorAll(".name-input").forEach((input, i) => {
    input.style.setProperty("--ball-color", colorMap[customNames[i]]);
  });
}

// --- Event Listeners ---
document.getElementById("n").addEventListener("input", updateSetDisplay);
document.getElementById("setType").addEventListener("change", (e) => {
  setType = e.target.value;
  updateSetDisplay();
});

// --- Generate Combinations / Permutations ---
document.getElementById("generateBtn").addEventListener("click", () => {
  const n = parseInt(document.getElementById("n").value);
  const r = parseInt(document.getElementById("r").value);
  const mode = document.getElementById("mode").value;
  const visual = document.getElementById("visual");

  if (isNaN(n) || isNaN(r) || r > n || n < 1 || r < 1) {
    visual.innerHTML = "<p>Please enter valid numbers (r ≤ n).</p>";
    return;
  }

  currentGeneration++;
  const genID = currentGeneration;

  let elements;
  if (setType === "letters") {
    elements = Array.from({ length: n }, (_, i) => i < 26 ? String.fromCharCode(65 + i) : `X${i+1}`);
  } else if (setType === "numbers") {
    elements = Array.from({ length: n }, (_, i) => (i + 1).toString());
  } else {
    elements = [...customNames];
  }

  const colorMap = generateColorMap(elements);

  let sets = [];
  let count = 0;
  if (mode === "combination") {
    sets = combinations(elements, r);
    count = factorial(n) / (factorial(r) * factorial(n - r));
  } else {
    sets = permutations(elements, r);
    count = factorial(n) / factorial(n - r);
  }

  document.getElementById("formula").textContent =
    mode === "combination"
      ? `C(${n}, ${r}) = n! / [r!(n - r)!]`
      : `P(${n}, ${r}) = n! / (n - r)!`;
  document.getElementById("count").textContent = `There are ${count} possible outcomes.`;

  // Visualize results
  visual.innerHTML = "";
  sets.forEach((set, i) => {
    const div = document.createElement("div");
    div.className = "combo-box";
    set.forEach((val) => {
      const ball = document.createElement("div");
      ball.className = "ball";
      ball.style.setProperty("--ball-color", colorMap[val]);
      ball.textContent = val;
      div.appendChild(ball);
    });

    setTimeout(() => {
      if (genID === currentGeneration) visual.appendChild(div);
    }, i * 50);
  });
});

// --- Initialize display on page load ---
window.addEventListener("DOMContentLoaded", () => {
  updateSetDisplay();
});
