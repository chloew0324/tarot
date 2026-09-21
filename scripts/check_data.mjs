import fs from "node:fs";
import { cards, cardBack, spreads } from "../src/cards.js";
import { shuffleDeck, pickCard } from "../src/deck.js";
import { resultLayouts } from "../src/result.js";
import { cardLore } from "../src/card-lore.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(cards.length === 78, `Expected 78 cards, found ${cards.length}`);
assert(new Set(cards.map((card) => card.id)).size === 78, "Card IDs must be unique");
assert(new Set(cards.map((card) => card.image)).size === 78, "Card images must be unique");
for (const card of cards) {
  assert(card.en && card.cn, `${card.id}: missing bilingual name`);
  assert(card.upZh && card.revZh && card.upEn && card.revEn, `${card.id}: missing upright or reversed meaning`);
  assert(fs.existsSync(`public${card.image}`), `${card.id}: missing image ${card.image}`);
  for (const lang of ["zh", "en"]) {
    const lore = cardLore[card.id]?.[lang];
    assert(lore?.story.length > 30 && lore?.general.length > 20, `${card.id}: missing ${lang} story or general meaning`);
  }
}
assert(Object.keys(cardLore).length === 78, "Stories must cover exactly the 78 cards");
for (const lang of ["zh", "en"]) {
  assert(new Set(cards.map(card => cardLore[card.id][lang].story)).size === 78, `${lang}: each card must have its own story`);
}
assert(fs.existsSync(`public${cardBack}`), "Missing card back image");
for (const [id, spread] of Object.entries(spreads)) {
  assert(spread.positions.length === spread.count, `${id}: spread count does not match positions`);
  const layout = resultLayouts[id];
  assert(layout.points.length === spread.count, `${id}: result image must include the whole spread`);
  for (const [x, y] of layout.points) {
    assert(x - layout.cardWidth / 2 > 32 && x + layout.cardWidth / 2 < layout.width - 32, `${id}: exported card exceeds canvas`);
    assert(y + layout.cardWidth * 1642 / 958 + 88 < layout.notes - 22, `${id}: exported card overlaps notes`);
  }
  for (let i = 0; i < layout.points.length; i++) for (let j = i + 1; j < layout.points.length; j++) {
    const [x, y] = layout.points[i], [otherX, otherY] = layout.points[j];
    assert(Math.abs(x - otherX) > layout.cardWidth || Math.abs(y - otherY) > layout.cardWidth * 1642 / 958 + 96, `${id}: exported cards or labels overlap`);
  }
  assert(layout.notes + (spread.count - 1) * layout.row + 75 < layout.height - 110, `${id}: notes overlap footer`);
}

const originalOrder = cards.map(card => card.id).join();
const deck = shuffleDeck(cards, () => 0.2);
assert(deck.length === 78 && new Set(deck.map(item => item.card.id)).size === 78, "Shuffle must retain all 78 unique cards");
assert(cards.map(card => card.id).join() === originalOrder, "Shuffle must not mutate source cards");
assert(deck.every(item => item.reversed === true), "Orientation must be fixed when shuffling");
assert(deck.map(item => item.card.id).join() !== originalOrder, "Shuffle must reorder the deck");
for (const limit of [3, 4, 5]) {
  let drawn = pickCard([], deck[77], limit);
  assert(drawn[0] === deck[77], "Picking must preserve the chosen card and orientation");
  assert(pickCard(drawn, deck[77], limit) === drawn, "Repeated picks must be ignored");
  for (const item of deck) drawn = pickCard(drawn, item, limit);
  assert(drawn.length === limit, "Picking must stop at the spread limit");
  assert(new Set(drawn.map(item => item.card.id)).size === limit, "A spread cannot contain duplicate cards");
}
console.log("Tarot checks passed: 78 unique cards, assets, bilingual meanings, spreads, shuffle and selection limits.");
