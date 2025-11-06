// --- Next Lexicographical Permutation ---
function nextPermutation(arr) {
  let i = arr.length - 2;
  while (i >= 0 && arr[i] >= arr[i + 1]) i--;
  if (i < 0) return null;

  let j = arr.length - 1;
  while (arr[j] <= arr[i]) j--;
  [arr[i], arr[j]] = [arr[j], arr[i]];

  let left = i + 1, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++; right--;
  }
  return arr;
}

// --- Render Sets ---
function renderSets(sets) {
  const results = document.getElementById('results');
  results.innerHTML = '';
  sets.forEach((s) => {
    const row = document.createElement('div');
    row.className = 'set-row';

    const text = document.createElement('div');
    text.className = 'set-text';
    text.textContent = s.join('');

    const btn = document.createElement('button');
    btn.textContent = 'Tutorial';
    btn.addEventListener('click', () => showTutorialModal(s));

    row.appendChild(text);
    row.appendChild(btn);
    results.appendChild(row);
  });
}

// --- Modal Setup ---
const modal = document.getElementById('tutorialModal');
const closeBtn = modal.querySelector('.close');
const tutorialVisual = document.getElementById('tutorialVisual');

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

function showTutorialModal(setArr) {
  modal.style.display = 'block';
  tutorialVisual.innerHTML = '';

  const arr = [...setArr];
  const divs = arr.map(num => {
    const div = document.createElement('div');
    div.className = 'tut-number';
    div.textContent = num;
    tutorialVisual.appendChild(div);
    return div;
  });

  const stepText = document.createElement('div');
  stepText.className = 'step-text';
  tutorialVisual.appendChild(stepText);

  const timeline = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.inOut" } });

  // Step 0: Find pivot
  let i = arr.length - 2;
  while (i >= 0 && arr[i] >= arr[i + 1]) i--;
  if (i < 0) {
    stepText.textContent = "No next permutation exists (already largest).";
    gsap.to(stepText, { opacity: 1 });
    return;
  }

  let j = arr.length - 1;
  while (arr[j] <= arr[i]) j--;

  // Step 1: Highlight pivot pair
  timeline.add(() => { stepText.textContent = 'Step 1: Highlight pivot pair.'; })
          .to(stepText, { opacity: 1 })
          .to([divs[i], divs[i + 1]], { scale: 1.3, backgroundColor: "#9b59b6" })
          .to(stepText, { opacity: 0, delay: 1 });

  // Step 2: Swap pivot and next larger number
  timeline.add(() => { stepText.textContent = `Step 2: Swap pivot (${arr[i]}) with next larger (${arr[j]}).`; })
          .to(stepText, { opacity: 1 })
          .to([divs[i], divs[j]], { scale: 1.3, backgroundColor: "#e74c3c" })
          .add(() => {
            // Swap array
            [arr[i], arr[j]] = [arr[j], arr[i]];
            // Swap div text
            [divs[i].textContent, divs[j].textContent] = [arr[i], arr[j]];
          })
          .to(stepText, { opacity: 0, delay: 1 })
          .to([divs[i], divs[j]], { scale: 1 });

  // Step 3: Sort suffix in ascending order
  timeline.add(() => { stepText.textContent = 'Step 3: Sort the suffix in ascending order.'; })
          .to(stepText, { opacity: 1 })
          .add(() => {
            const suffixStart = i + 1;
            const suffix = arr.slice(suffixStart).sort((a, b) => a - b);
            arr.splice(suffixStart, suffix.length, ...suffix);

            // Animate suffix sorting
            suffix.forEach((num, k) => {
              const div = divs[suffixStart + k];
              div.textContent = num;
              div.style.backgroundColor = "#3498db";
              gsap.fromTo(div, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: k * 0.1 });
            });
          })
          .to(stepText, { opacity: 0, delay: 1 });

  // Step 4: Finish
  timeline.add(() => {
    stepText.textContent = '✅ Next permutation created!';
    divs.forEach(d => {
      d.style.backgroundColor = "#72a1e5";
      gsap.to(d, { scale: 1, duration: 0.5 });
    });
  })
  .to(stepText, { opacity: 1 })
  .to(stepText, { opacity: 0, delay: 2 });
}



// --- Generate Button ---
document.getElementById('generateBtn').addEventListener('click', () => {
  const numInput = document.getElementById('numberInput').value.trim();
  const countInput = parseInt(document.getElementById('setsInput').value);

  if (!/^\d{1,10}$/.test(numInput)) {
    alert('Please enter a number up to 10 digits.');
    return;
  }
  if (isNaN(countInput) || countInput < 1) {
    alert('Please enter a valid number of sets to display.');
    return;
  }

  const arr = numInput.split('').map(Number);
  const sets = [];
  let tempArr = [...arr];

  for (let k = 0; k < countInput; k++) {
    tempArr = nextPermutation([...tempArr]);
    if (!tempArr) break;
    sets.push([...tempArr]);
  }

  if (sets.length === 0) {
    alert('No next permutation exists.');
    document.getElementById('results').innerHTML = '';
    return;
  }

  renderSets(sets);
});
