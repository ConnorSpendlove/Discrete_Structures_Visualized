export default function(container) {
  container.innerHTML = `
    <h2>Cashier's Algorithm (Coin Change)</h2>
    <p>Enter an amount in cents:</p>
    <div class="input-row">
      <input id="amountInput" type="number" placeholder="e.g. 87" min="1" max="999">
      <button id="changeBtn">Calculate Change</button>
    </div>
    <div id="coinVisualizer" class="coin-visualizer"></div>
    <p id="changeResult"></p>
    <p id="runningTotal">Running Total: 0¢</p>
  `;

  const input = container.querySelector("#amountInput");
  const btn = container.querySelector("#changeBtn");
  const visualizer = container.querySelector("#coinVisualizer");
  const result = container.querySelector("#changeResult");
  const runningTotal = container.querySelector("#runningTotal");

  const coins = [
    { name: 'Quarter', value: 25, color: '#72a1e5' },
    { name: 'Dime', value: 10, color: '#3c7cd6ff' },
    { name: 'Nickel', value: 5, color: '#7460b6ff' },
    { name: 'Penny', value: 1, color: '#58429fff' }
  ];

  function createCoinBars(changeCounts) {
    visualizer.innerHTML = "";
    const maxCount = Math.max(...changeCounts.map(c => c.count), 1);
    changeCounts.forEach(c => {
      const barContainer = document.createElement("div");
      barContainer.classList.add("coin-bar-container");

      const bar = document.createElement("div");
      bar.classList.add("coin-bar");
      bar.style.width = '0%';
      bar.style.backgroundColor = c.color;
      bar.style.color = c.textColor || '#000';
      bar.dataset.count = c.count;
      bar.dataset.value = c.value;
      bar.dataset.maxCount = maxCount;
      bar.textContent = `${c.name}: 0`;

      barContainer.appendChild(bar);
      visualizer.appendChild(barContainer);
    });
  }

  async function animateCoins() {
    let total = 0;
    const bars = visualizer.querySelectorAll(".coin-bar");

    for (const bar of bars) {
      const count = parseInt(bar.dataset.count);
      const coinValue = parseInt(bar.dataset.value);
      const maxCount = parseInt(bar.dataset.maxCount);

      for (let i = 1; i <= count; i++) {
        // Grow bar horizontally
        const widthPercent = ((i / maxCount) * 100).toFixed(2);
        bar.style.width = widthPercent + '%';
        bar.textContent = `${bar.textContent.split(':')[0]}: ${i}`;

        // Update running total
        total += coinValue;
        runningTotal.textContent = `Running Total: ${total}¢`;

        // Floating +N¢
        const floating = document.createElement("span");
        floating.textContent = `+${coinValue}¢`;
        floating.className = "floating-coin";
        bar.parentElement.appendChild(floating); 

        setTimeout(() => floating.remove(), 800);
        await new Promise(res => setTimeout(res, 200));
      }
    }
  }

  btn.addEventListener("click", async () => {
    let amount = parseInt(input.value);
    if (isNaN(amount) || amount < 1 || amount > 999) {
      result.textContent = "Please enter a valid amount (1-999 cents).";
      visualizer.innerHTML = "";
      runningTotal.textContent = "Running Total: 0¢";
      return;
    }

    const changeCounts = [];
    let remaining = amount;
    coins.forEach(coin => {
      const count = Math.floor(remaining / coin.value);
      remaining -= count * coin.value;
      changeCounts.push({ ...coin, count });
    });

    result.textContent = `Change for ${amount}¢:`;
    runningTotal.textContent = "Running Total: 0¢";
    createCoinBars(changeCounts);
    await animateCoins();
  });
};
