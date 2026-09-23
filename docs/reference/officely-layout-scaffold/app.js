const problems = [
  ["It can make work isolating", "▱"],
  ["It can create operational Chaos", "☁"],
  ["Mandates can create Resentment", "☹"],
  ["Decision making in the Dark", "⌕"],
];

const benefits = [
  ["Increases Visibility", "⌁"],
  ["Enables Smarter Coordination", "◉"],
  ["Optimises Office Utilisation", "◔"],
  ["Strengthens Work Culture", "☕"],
];

function renderCards(selector, cards, className) {
  document.querySelectorAll(selector).forEach((container) => {
    container.innerHTML = cards.map(([label, icon]) => `
      <article class="${className}">
        <h3>${label}</h3>
        <span aria-hidden="true">${icon}</span>
      </article>`).join("");
  });
}

renderCards("[data-problem-cards]", problems, "problem-card");
renderCards("[data-benefit-cards]", benefits, "benefit-card");
