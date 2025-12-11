document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".algo-card");
  const modal = document.getElementById("visualizerModal");
  const closeBtn = document.getElementById("closeVisualizer");
  const area = document.getElementById("visualizerArea");

  // Map each card index to its JS module
  const moduleMap = [
    "largestInteger.js",
    "firstLastLargest.js",
    "linearSearch.js",
    "binarySearch.js",
    "bubbleSort.js",
    "insertionSort.js",
    "naiveStringMatch.js",
    "cashier.js",
    "greedyScheduling.js",
    "searchComparison.js",
    "sortComparison.js"
  ];

  cards.forEach((card, i) => {
    card.addEventListener("click", async (e) => {
      e.preventDefault();
      modal.classList.add("active");
      area.innerHTML = `<p>Loading ${card.textContent}...</p>`;

      try {
        // Dynamically import the corresponding JS module
        const module = await import(`./simulations/${moduleMap[i]}`);
        module.default(area); // Each module exports a default function
      } catch (err) {
        area.innerHTML = `<p style="color:red;">Failed to load simulation: ${err}</p>`;
      }
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    area.innerHTML = "";
  });
});
