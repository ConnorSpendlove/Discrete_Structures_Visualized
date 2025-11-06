// --- Math Helpers (BigInt for exact counts) ---
function factorialBigInt(n) {
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) result *= i;
  return result;
}

function combinationsCountBigInt(n, r) {
  if (r > n) return 0n;
  return factorialBigInt(n) / (factorialBigInt(r) * factorialBigInt(n - r));
}

function combinationsWithRepetitionCountBigInt(n, r) {
  return combinationsCountBigInt(n + r - 1, r);
}

function permutationsCountBigInt(n, r) {
  if (r > n) return 0n;
  return factorialBigInt(n) / factorialBigInt(n - r);
}

function permutationsWithRepetitionCountBigInt(n, r) {
  return BigInt(n) ** BigInt(r);
}

// --- Generate actual sets (for visualization) ---
function combinations(arr, r) {
  if (r === 0) return [[]];
  if (arr.length < r) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, r - 1).map(c => [first, ...c]);
  const withoutFirst = combinations(rest, r);
  return [...withFirst, ...withoutFirst];
}

function combinationsWithRepetition(arr, r) {
  if (r === 0) return [[]];
  if (arr.length === 0) return [];
  const [first, ...rest] = arr;
  const withFirst = combinationsWithRepetition(arr, r - 1).map(c => [first, ...c]);
  const withoutFirst = combinationsWithRepetition(rest, r);
  return [...withFirst, ...withoutFirst];
}

function permutations(arr, r) {
  if (r === 0) return [[]];
  return arr.flatMap((val, i) =>
    permutations([...arr.slice(0, i), ...arr.slice(i + 1)], r - 1).map(p => [val, ...p])
  );
}

function permutationsWithRepetition(arr, r) {
  if (r === 0) return [[]];
  return arr.flatMap(val =>
    permutationsWithRepetition(arr, r - 1).map(p => [val, ...p])
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
let setType = "letters";

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
    elements = Array.from({ length: n }, (_, i) => customNames[i] || `X${i+1}`);
    customNames = [...elements];
  }

  const colorMap = generateColorMap(elements);

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
      input.maxLength = 8;

      const updateFontSize = () => {
        const len = input.value.length;
        if (len <= 4) input.style.fontSize = "1rem";
        else if (len <= 6) input.style.fontSize = "0.85rem";
        else input.style.fontSize = "0.7rem";
      };
      updateFontSize();

      input.addEventListener("input", (e) => {
        customNames[i] = e.target.value;
        updateFontSize();
        updateSetDisplayBallsOnly();
      });

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
  const repetition = document.getElementById("repetition")?.value || "no";
  const visual = document.getElementById("visual");

  if (isNaN(n) || isNaN(r) || r < 1 || n < 1 || (repetition === "no" && r > n)) {
    visual.innerHTML = "<p>Please enter valid numbers (r ≤ n).</p>";
    return;
  }

  currentGeneration++;
  const genID = currentGeneration;

  let elements;
  if (setType === "letters") elements = Array.from({ length: n }, (_, i) => i < 26 ? String.fromCharCode(65 + i) : `X${i+1}`);
  else if (setType === "numbers") elements = Array.from({ length: n }, (_, i) => (i + 1).toString());
  else elements = [...customNames];

  const colorMap = generateColorMap(elements);

  // --- Count using BigInt ---
  let count;
  if (mode === "combination") {
    count = repetition === "yes" ? combinationsWithRepetitionCountBigInt(n, r) : combinationsCountBigInt(n, r);
  } else {
    count = repetition === "yes" ? permutationsWithRepetitionCountBigInt(n, r) : permutationsCountBigInt(n, r);
  }

  document.getElementById("formula").textContent =
    mode === "combination"
      ? repetition === "yes"
        ? `C(${n}+${r}-1, ${r}) = (n+r-1)! / (r!(n-1)!)`
        : `C(${n}, ${r}) = n! / [r!(n - r)!]`
      : repetition === "yes"
        ? `P(${n}, ${r}) with repetition = n^r`
        : `P(${n}, ${r}) = n! / (n - r)!`;

  document.getElementById("count").textContent = `There are ${count.toString()} possible outcomes.`;

  // --- Alert for too many outcomes ---
  const setDisplay = document.getElementById("setDisplay");
  const existingAlert = document.getElementById("tooManyAlert");
  if (existingAlert) existingAlert.remove();

  if (count > 2000n) {
    const alertDiv = document.createElement("div");
    alertDiv.id = "tooManyAlert";
    alertDiv.textContent = "Too many outcomes to display (>2000). Only showing count and formula.";
    alertDiv.style.background = "#8b4dffff";
    alertDiv.style.color = "#fff";
    alertDiv.style.padding = "1rem";
    alertDiv.style.borderRadius = "0.5rem";
    alertDiv.style.fontWeight = "bold";
    alertDiv.style.marginBottom = "1rem";
    alertDiv.style.textAlign = "center";
    setDisplay.prepend(alertDiv);

    visual.innerHTML = "";
    return;
  }

  // --- Visualize results ---
  let sets = (mode === "combination")
    ? (repetition === "yes" ? combinationsWithRepetition(elements, r) : combinations(elements, r))
    : (repetition === "yes" ? permutationsWithRepetition(elements, r) : permutations(elements, r));

  visual.innerHTML = "";
  sets.forEach((set, i) => {
    const div = document.createElement("div");
    div.className = "combo-box";
    set.forEach((val) => {
      const ball = document.createElement("div");
      ball.className = "ball";
      ball.style.setProperty("--ball-color", colorMap[val]);
      ball.textContent = (setType === "custom" && val.length > 2) ? val.slice(0, 2) : val;
      if (setType === "custom") ball.title = val;
      div.appendChild(ball);
    });
    setTimeout(() => {
      if (genID === currentGeneration) visual.appendChild(div);
    }, i * 50);
  });
});

// --- Initialize display ---
window.addEventListener("DOMContentLoaded", updateSetDisplay);
