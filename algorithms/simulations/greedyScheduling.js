export default function(container) {
  container.innerHTML = `
    <h2>Greedy Talk Scheduling</h2>
    <p>Enter talks with start and end times (comma-separated, format: start-end):</p>
    <div class="input-row">
      <input id="talksInput" type="text" placeholder="e.g. 1-3,2-5,4-6">
      <button id="scheduleBtn">Schedule Talks</button>
    </div>
    <div id="talkVisualizer" class="talk-visualizer"></div>
    <p id="scheduleResult"></p>
  `;

  const input = container.querySelector("#talksInput");
  const btn = container.querySelector("#scheduleBtn");
  const visualizer = container.querySelector("#talkVisualizer");
  const result = container.querySelector("#scheduleResult");

  function parseTalks(inputValue) {
    return inputValue.split(',').map(t => {
      const [start, end] = t.split('-').map(Number);
      return { start, end };
    }).filter(t => !isNaN(t.start) && !isNaN(t.end) && t.start < t.end);
  }

  function getMaxEnd(talks) {
    return Math.max(...talks.map(t => t.end));
  }

  function createTimeline(maxTime) {
    const timeline = document.createElement('div');
    timeline.classList.add('timeline');
    for (let i = 0; i <= maxTime; i++) {
      const tick = document.createElement('div');
      tick.classList.add('timeline-tick');
      tick.textContent = i;
      tick.style.left = `${i * 50}px`; // scale
      timeline.appendChild(tick);
    }
    visualizer.appendChild(timeline);
  }

  function createTalkBars(talks) {
    visualizer.innerHTML = '';
    const maxEnd = getMaxEnd(talks);
    createTimeline(maxEnd);

    talks.forEach((talk) => {
      const row = document.createElement('div');
      row.classList.add('talk-row');

      const bar = document.createElement('div');
      bar.classList.add('talk-bar');
      bar.style.left = `${talk.start * 50}px`;
      bar.style.width = `${(talk.end - talk.start) * 50}px`;
      bar.textContent = `${talk.start}-${talk.end}`;

      row.appendChild(bar);
      visualizer.appendChild(row);

      talk._bar = bar; // store reference for animation
    });
  }

  async function animateGreedy(talks) {
    talks.sort((a, b) => a.end - b.end);
    let lastEnd = -1;

    for (let talk of talks) {
      const bar = talk._bar;
      bar.classList.add('current');
      await new Promise(res => setTimeout(res, 600));

      if (talk.start >= lastEnd) {
        bar.classList.remove('current');
        bar.classList.add('selected');
        lastEnd = talk.end;
      } else {
        bar.classList.remove('current');
        bar.classList.add('rejected');
      }

      await new Promise(res => setTimeout(res, 400));
    }
  }

  btn.addEventListener('click', async () => {
    const talks = parseTalks(input.value);
    if (!talks.length) {
      result.textContent = 'Please enter valid talks.';
      visualizer.innerHTML = '';
      return;
    }
    result.textContent = '';
    createTalkBars(talks);
    await animateGreedy(talks);
    result.textContent = 'Talks scheduled successfully!';
  });
};
