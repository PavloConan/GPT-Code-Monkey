const apiKey = "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";

const spinnerContainer = document.getElementById("spinnerContainer");
const copyCodeBtn = document.getElementById("copyCodeBtn");
const problemInput = document.getElementById("problem");
const languageInput = document.getElementById("language");
async function generateCode() {
  const problem = problemInput.value;
  const language = languageInput.value;
  const answer = document.getElementById("answer");

  if (problem.trim() === "") {
    answer.textContent = "Please enter text to check.";
    return;
  }

  copyCodeBtn.classList.add("hidden")
  spinnerContainer.classList.remove("hidden");
  answer.textContent = "";

  try {
    saveData()
    let prompt = `I want you to generate code for the following problem. I don't need your explanation or description, or any preface, or usage details, just the bare code, not a word more than that, not even the confirmation. The problem is: ${problem}. The programming language is: ${language}.`;
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2000,
        n: 1,
        stop: null,
        temperature: 0.2
      })
    });

    const data = await response.json();
    const result = data.choices && data.choices.length > 0 ? data.choices[0].text.trim() : "Error: Unable to retrieve code";
    const formattedResult = `<pre><code>${result}</code></pre>`

    answer.innerHTML = formattedResult;
  } catch (error) {
    console.error("Error:", error);
    answer.textContent = "Error: Unable to fetch fact-checking answer.";
  } finally {
    saveData();
    copyCodeBtn.classList.remove("hidden");
    spinnerContainer.classList.add("hidden");
  }
}

document.getElementById("generateCode").addEventListener("click", generateCode);
document.getElementById('problem').addEventListener("change", saveData);
document.getElementById('language').addEventListener("change", saveData);

function saveData() {
  console.log("SAVING");
  const problem = document.getElementById("problem").value;
  const language = document.getElementById("language").value;
  const answer = document.getElementById("answer").innerHTML;

  localStorage.setItem("problem", problem);
  localStorage.setItem("language", language);
  localStorage.setItem("answer", answer);
}

function loadData() {
  const problem = localStorage.getItem("problem");
  const language = localStorage.getItem("language");
  const answer = localStorage.getItem("answer");

  if (problem) {
    document.getElementById("problem").value = problem;
  }

  if (language) {
    document.getElementById("language").value = language;
  }


  if (answer) {
    document.getElementById("answer").innerHTML = answer;
    copyCodeBtn.classList.remove("hidden");
  }
}

copyCodeBtn.addEventListener('click', async () => {
  const codeElement = document.querySelector('code');
  if (!codeElement) {
    alert('No code to copy');
    return;
  }

  const hiddenTextarea = document.getElementById('hiddenTextarea');
  hiddenTextarea.value = codeElement.textContent;

  hiddenTextarea.select();
  hiddenTextarea.setSelectionRange(0, 99999); // For mobile devices

  navigator.clipboard.writeText(hiddenTextarea.value);
});

problemInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    generateCode();
  }
});

languageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    generateCode();
  }
});

loadData();
