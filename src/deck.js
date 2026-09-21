// Each visible position keeps its card and orientation for the whole reading.
export function shuffleDeck(cards, random = Math.random) {
  const deck = cards.map(card => ({ card, reversed: random() < 0.34 }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function pickCard(drawn, item, limit) {
  if (!item || drawn.length >= limit || drawn.some(entry => entry.card.id === item.card.id)) return drawn;
  return [...drawn, item];
}
