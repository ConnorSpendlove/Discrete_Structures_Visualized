// Factorial helper
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

// Generate combinations (nCr)
function combinations(arr, r) {
  if (r === 0) return [[]];
  if (arr.length < r) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, r - 1).map(c => [first, ...c]);
  const withoutFirst = combinations(rest, r);
  return [...withFirst, ...withoutFirst];
}

// Generate permutations (nPr)
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

  const elements = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i)); // A, B, C, D...
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

  document.getElementById("count").textContent = `Count: ${count}`;

  const visual = document.getElementById("visual");
  visual.innerHTML = "";
  sets.forEach(set => {
    const div = document.createElement("div");
    div.className = "combo-box";
    div.textContent = `{ ${set.join(", ")} }`;
    visual.appendChild(div);
  });
});
