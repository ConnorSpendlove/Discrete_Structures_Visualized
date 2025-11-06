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
// Deterministic: given n elements, spread hues evenly around the color wheel
function generateColorMap(elements) {
  const colorMap = {};
  const total = elements.length;
  elements.forEach((el, i) => {
    const hue = Math.round((360 / total) * i);
    colorMap[el] = `hsl(${hue}, 80%, 60%)`;
  });
  return colorMap;
}

// --- UI Handler ---
document.getElementById("generateBtn").addEventListener("click", () => {
  const n = parseInt(document.getElementById("n").value);
  const r = parseInt(document.getElementById("r").value);
  const mode = document.getElementById("mode").value;
  const visual = document.getElementById("visual");

  if (isNaN(n) || isNaN(r) || r > n || n < 1 || r < 1) {
    visual.innerHTML = "<p>Please enter valid numbers (r ≤ n).</p>";
    return;
  }

  // Generate element names dynamically
  const elements = Array.from({ length: n }, (_, i) => {
    // Use letters first, then continue with indexed labels if > 26
    return i < 26
      ? String.fromCharCode(65 + i)
      : `X${i + 1}`; // e.g. X27, X28, etc.
  });

  // Generate deterministic color map
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

  // --- Display the full set at the top ---
  const results = document.getElementById("results");
  let setDisplay = document.getElementById("setDisplay");
  if (!setDisplay) {
    setDisplay = document.createElement("div");
    setDisplay.id = "setDisplay";
    setDisplay.style.marginBottom = "1rem";
    results.prepend(setDisplay);
  }

  setDisplay.innerHTML = `<h3>Current Set:</h3>`;
  const setContainer = document.createElement("div");
  setContainer.className = "combo-box";
  elements.forEach((el) => {
    const ball = document.createElement("div");
    ball.className = "ball";
    ball.style.setProperty("--ball-color", colorMap[el]);
    ball.textContent = el;
    setContainer.appendChild(ball);
  });
  setDisplay.appendChild(setContainer);

  // --- Visualize the combinations/permutations ---
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

    // Small delay for animation cascade
    setTimeout(() => visual.appendChild(div), i * 70);
  });
});
