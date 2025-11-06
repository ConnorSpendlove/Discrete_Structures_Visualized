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

document.getElementById("generateBtn").addEventListener("click", () => {
  const n = parseInt(document.getElementById("n").value);
  const r = parseInt(document.getElementById("r").value);
  const mode = document.getElementById("mode").value;
  const visual = document.getElementById("visual");

  if (isNaN(n) || isNaN(r) || r > n || n < 1 || r < 1) {
    visual.innerHTML = "<p>Please enter valid numbers (r ≤ n).</p>";
    return;
  }

  const elements = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
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

  visual.innerHTML = "";

  sets.forEach((set, i) => {
    const div = document.createElement("div");
    div.className = "combo-box";
    set.forEach((val) => {
      const ball = document.createElement("div");
      ball.className = "ball";
      ball.style.setProperty("--ball-color", getRandomColor());
      ball.textContent = val;
      div.appendChild(ball);
    });

    // Small delay for animation effect
    setTimeout(() => visual.appendChild(div), i * 100);
  });
});

function getRandomColor() {
  const colors = ["#72a1e5", "#54428e", "#ff7eb9", "#ff65a3", "#7afcff", "#f0bb0cff"];
  return colors[Math.floor(Math.random() * colors.length)];
}
