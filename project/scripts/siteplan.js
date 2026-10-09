
const menuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

function toggleNavigation() {
  if (!menuButton || !primaryNav) return;

  const isOpen = primaryNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", `${isOpen}`);
  menuButton.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} navigation menu`);
}

function updateFooter() {
  const yearElement = document.querySelector("#current-year");
  const modifiedElement = document.querySelector("#last-modified");

  if (yearElement) {
    yearElement.textContent = `${new Date().getFullYear()}`;
  }

  if (modifiedElement) {
    modifiedElement.textContent = `Last modified: ${document.lastModified}`;
  }
}

if (menuButton) {
  menuButton.addEventListener("click", toggleNavigation);
}

updateFooter();

const moodData = {
  joy: {
    title: "Joy in bright colors",
    description: "Joy can feel open, bright, and full of movement. Imagine a painting that seems to dance.",
    colors: "Sunlit yellow, coral, and warm gold",
    art: "Loose brushstrokes, bright light, and energetic shapes",
    music: "Try a lively, upbeat instrumental piece and notice how its tempo changes your mood."
  },
  calm: {
    title: "Calm in gentle tones",
    description: "Calm may feel spacious and balanced, like a quiet landscape or a slow, flowing melody.",
    colors: "Soft blue, sage green, and cream",
    art: "Wide spaces, gentle curves, and soft transitions",
    music: "Try a slow piano piece and listen for pauses, sustained notes, and a gentle pace."
  },
  melancholy: {
    title: "Melancholy in deep shades",
    description: "Melancholy can hold sadness, tenderness, and memory at the same time.",
    colors: "Deep blue, muted violet, and charcoal",
    art: "Contrasting shadows, expressive lines, and a quiet focal point",
    music: "Try a reflective piano melody, such as Beethoven's Für Elise, and notice what feelings arise for you."
  },
  energy: {
    title: "Energy in bold movement",
    description: "Energy can feel intense and restless, as if the artwork and music are moving together.",
    colors: "Burgundy, orange, and vivid gold",
    art: "Strong diagonals, repeated shapes, and high contrast",
    music: "Try a piece with a strong pulse and changing dynamics; notice where the music seems to accelerate."
  }
};

const moodButtons = document.querySelectorAll(".mood-button");
const resultTitle = document.querySelector("#result-title");
const resultDescription = document.querySelector("#result-description");
const resultColors = document.querySelector("#result-colors");
const resultArt = document.querySelector("#result-art");
const resultMusic = document.querySelector("#result-music");
const reflectionMood = document.querySelector("#reflection-mood");

function showMood(moodKey) {
  const mood = moodData[moodKey];

  if (!mood) return;

  if (resultTitle) resultTitle.textContent = `${mood.title}`;
  if (resultDescription) resultDescription.textContent = `${mood.description}`;
  if (resultColors) resultColors.textContent = `${mood.colors}`;
  if (resultArt) resultArt.textContent = `${mood.art}`;
  if (resultMusic) resultMusic.textContent = `${mood.music}`;
  if (reflectionMood) reflectionMood.value = `${moodKey}`;

  moodButtons.forEach((button) => {
    button.setAttribute("aria-pressed", `${button.dataset.mood === moodKey}`);
  });
}

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showMood(button.dataset.mood);
  });
});

const reflectionForm = document.querySelector("#reflection-form");
const savedReflectionsContainer = document.querySelector("#saved-reflections");
const formMessage = document.querySelector("#form-message");
const clearButton = document.querySelector("#clear-reflections");
const storageKey = "artInMotionReflections";

function getSavedReflections() {
  try {
    const storedReflections = localStorage.getItem(storageKey);
    return storedReflections ? JSON.parse(storedReflections) : [];
  } catch (error) {
    return [];
  }
}

function saveReflections(reflections) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(reflections));
    return true;
  } catch (error) {
    if (formMessage) {
      formMessage.textContent = "Your browser could not save this reflection. Check your browser storage settings.";
    }
    return false;
  }
}

function renderReflections() {
  if (!savedReflectionsContainer) return;

  const reflections = getSavedReflections();
  savedReflectionsContainer.replaceChildren();

  if (reflections.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "Your saved reflections will appear here.";
    savedReflectionsContainer.append(emptyMessage);
    return;
  }

  reflections.slice().reverse().forEach((reflection) => {
    const card = document.createElement("article");
    card.className = "reflection-card";

    const heading = document.createElement("h3");
    heading.textContent = `${reflection.name} explored ${reflection.mood}`;

    const body = document.createElement("p");
    body.textContent = `${reflection.text}`;

    const date = document.createElement("p");
    date.className = "reflection-date";
    date.textContent = `Saved on ${reflection.date}`;

    card.append(heading, body, date);
    savedReflectionsContainer.append(card);
  });
}

function handleReflectionSubmit(event) {
  event.preventDefault();

  const nameInput = document.querySelector("#visitor-name");
  const moodInput = document.querySelector("#reflection-mood");
  const textInput = document.querySelector("#reflection-text");

  if (!nameInput || !moodInput || !textInput || !reflectionForm) return;

  const name = nameInput.value.trim();
  const mood = moodInput.value;
  const reflectionText = textInput.value.trim();

  if (!name || !mood || !reflectionText) {
    if (formMessage) {
      formMessage.textContent = "Please complete every field before saving.";
    }
    return;
  }

  if (!moodData[mood]) {
    if (formMessage) {
      formMessage.textContent = "Please select a valid mood.";
    }
    return;
  }

  const reflections = getSavedReflections();

  const newReflection = {
    name: name,
    mood: moodData[mood].title,
    text: reflectionText,
    date: new Date().toLocaleDateString()
  };

  reflections.push(newReflection);

  if (saveReflections(reflections)) {
    if (formMessage) {
      formMessage.textContent = "Your reflection has been saved on this device.";
    }

    reflectionForm.reset();
    moodButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
    });

    renderReflections();
  }
}

if (reflectionForm) {
  reflectionForm.addEventListener("submit", handleReflectionSubmit);
}

function clearReflections() {
  const reflections = getSavedReflections();

  if (reflections.length === 0) {
    if (formMessage) {
      formMessage.textContent = "There are no saved reflections to clear.";
    }
    return;
  }

  const confirmed = window.confirm("Delete all saved reflections from this browser?");

  if (confirmed) {
    localStorage.removeItem(storageKey);
    renderReflections();

    if (formMessage) {
      formMessage.textContent = "All reflections have been removed.";
    }
  }
}

if (clearButton) {
  clearButton.addEventListener("click", clearReflections);
}

renderReflections();