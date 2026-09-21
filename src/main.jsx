import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { cardBack, cards, meaningFor, spreads } from "./cards";
import { shuffleDeck, pickCard } from "./deck";
import { createResultImage } from "./result";
import { cardLore } from "./card-lore";
import "./styles.css";

const copy = {
  zh: {
    begin: "开始占卜", all: "查看全部牌", explore: "今天，你想探索什么？",
    love: "爱情", career: "事业", wealth: "财富", self: "自我",
    shuffleTitle: "让牌回应你的此刻", shuffleHint: "慢慢呼吸，把注意力放回心里。准备好后，轻触牌阵开始洗牌。",
    shuffle: "洗牌", shuffling: "正在洗牌…", draw: "开始抽牌", drawNext: "抽取下一张",
    drawn: "已抽取", reveal: "查看完整解读 →", reading: "你的牌阵", upright: "正位", reversed: "逆位",
    save: "保存结果", saved: "已保存", restart: "重新开始", home: "返回首页", history: "历史",
    historyTitle: "你的探索记录", historyEmpty: "还没有保存的结果。", close: "关闭",
    deckTitle: "78 张牌", deckIntro: "一套完整的牌组，每张牌都可以从正位与逆位两面被看见。",
    reflection: "这不是一个确定的预言，而是一面供你观察当下的镜子。留意哪一句最有共鸣，也允许没有答案。",
    disclaimer: "塔罗仅供娱乐与自我探索，不替代医疗、法律、财务或心理专业建议。",
    back: "返回", language: "EN", select: "选择这个主题", cardOf: "牌位",
    summary: "整体讯息", summaryLead: "这组牌邀请你同时留意",
    themeNames: { love:"爱情", career:"事业", wealth:"财富", self:"自我" }
  },
  en: {
    begin: "Begin a reading", all: "See all cards", explore: "What would you like to explore today?",
    love: "Love", career: "Career", wealth: "Wealth", self: "Self",
    shuffleTitle: "Let the cards meet this moment", shuffleHint: "Breathe slowly and return your attention inward. When you are ready, touch the deck to shuffle.",
    shuffle: "Shuffle", shuffling: "Shuffling…", draw: "Begin drawing", drawNext: "Draw next card",
    drawn: "Drawn", reveal: "Explore your reading →", reading: "Your reading", upright: "Upright", reversed: "Reversed",
    save: "Save result", saved: "Saved", restart: "Start again", home: "Back home", history: "History",
    historyTitle: "Your reflections", historyEmpty: "No saved readings yet.", close: "Close",
    deckTitle: "The 78 Cards", deckIntro: "A complete deck, with every card held in both its upright and reversed expression.",
    reflection: "This is not a fixed prediction. Treat it as a mirror for the present: notice what resonates, and allow space for uncertainty.",
    disclaimer: "Tarot is for entertainment and self-reflection. It is not medical, legal, financial, or mental-health advice.",
    back: "Back", language: "中", select: "Choose this theme", cardOf: "Position",
    summary: "Overall message", summaryLead: "Together, these cards ask you to notice",
    themeNames: { love:"Love", career:"Career", wealth:"Wealth", self:"Self" }
  }
};

const topicGlyph = { love: "○", career: "△", wealth: "◇", self: "☾" };
const topicOrder = ["love", "career", "wealth", "self"];

function Header({ lang, setLang, setView, setHistoryOpen, home }) {
  const t = copy[lang];
  return (
    <header className={`site-header ${home ? "home-header" : ""}`}>
      <button className="wordmark" onClick={() => setView("home")}>LUMEN ARCANA</button>
      <nav aria-label={lang === "zh" ? "主要导航" : "Main navigation"}>
        <button className="text-button" onClick={() => setHistoryOpen(true)}>{t.history}</button>
        <button className="language-button" onClick={() => setLang(lang === "zh" ? "en" : "zh")} aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}>{t.language}</button>
      </nav>
    </header>
  );
}

function Home({ lang, setView }) {
  const t = copy[lang];
  const decor = [5, 2, 3, 1, 34, 7, 9, 17, 12, 34, 0].map(index => cards[index]);
  const followPointer = event => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const offset = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    event.currentTarget.style.setProperty("--pointer-y", offset);
  };
  return (
    <main className="home-screen screen-enter" onPointerMove={followPointer} onPointerLeave={event => event.currentTarget.style.setProperty("--pointer-y", 0)}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="orbit-cards">
        {decor.map((card, index) => <button key={index} className={`orbit-card orbit-${index + 1}`} style={{ "--drift": `${6 + index % 3 * 3}px` }} aria-label={`${card[lang === "zh" ? "cn" : "en"]} · ${lang === "zh" ? "翻看卡背" : "Turn the card"}`} onClick={event => event.currentTarget.classList.toggle("turned")}><span className="orbit-inner"><img className="orbit-front" src={card.image} alt="" /><img className="orbit-back" src={cardBack} alt="" /></span></button>)}
      </div>
      <section className="hero-copy">
        <h1><img src="/wordmark.png" alt="Lumen Arcana" /></h1>
        <i className="logo-star four-point-star" aria-hidden="true" />
        <div className="hero-actions">
          <button className="line-action" onClick={() => setView("themes")}>{lang === "zh" ? t.begin : "Draw a card"}<span>→</span></button>
          <button className="line-action" onClick={() => setView("gallery")}>{t.all}<span>→</span></button>
        </div>
      </section>
      <div className="bottom-star" aria-hidden="true"><span /><i className="four-point-star" /><span /></div>
    </main>
  );
}

function Themes({ lang, onSelect }) {
  const t = copy[lang];
  return (
    <main className="theme-screen screen-enter">
      <div className="aurora theme-glow-one" />
      <div className="aurora theme-glow-two" />
      <section className="theme-panel">
        <p className="eyebrow">{lang === "zh" ? "选择一条路径" : "Choose a path"}</p>
        <h1>{t.explore}</h1>
        <div className="topic-grid">
          {topicOrder.map((key) => (
            <button key={key} className="topic-button" onClick={() => onSelect(key)}>
              <span className="topic-glyph" aria-hidden="true">{topicGlyph[key]}</span>
              <span>
                <strong>{t[key]}</strong>
                <small>{lang === "zh" ? spreads[key].cn.split(" · ")[1] : spreads[key].en.split(" · ")[1]}</small>
              </span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function Shuffle({ lang, theme, shuffling, shuffleRound, onShuffle, onDraw }) {
  const t = copy[lang];
  const spread = spreads[theme];
  return (
    <main className="shuffle-screen screen-enter">
      <section className="shuffle-copy">
        <p className="eyebrow">{lang === "zh" ? spread.cn : spread.en}</p>
        <h1>{t.shuffle}</h1>
        <p>{lang === "zh" ? "轻触牌堆，让思绪慢慢沉淀。想洗几次，都由你决定。" : "Touch the cards. Settle into the moment. Shuffle as often as you like."}</p>
      </section>
      <button className={`shuffle-pile ${shuffling ? "is-shuffling" : ""}`} onClick={onShuffle} aria-label={lang === "zh" ? "点击牌堆洗牌，可重复" : "Shuffle the pile again"}>
        {Array.from({ length: 24 }, (_, i) => <img key={`${shuffleRound}-${i}`} src={cardBack} alt="" draggable="false" style={{ "--x": `${Math.sin(i * 2.4) * (65 + i * 3.4)}px`, "--y": `${Math.cos(i * 2.4) * (32 + i * 2.4)}px`, "--rotation": `${(i * 137.5) % 160 - 80}deg`, "--i": i }} />)}
      </button>
      <div className="shuffle-action">
        <p role="status">{shuffling ? t.shuffling : shuffleRound ? (lang === "zh" ? `已洗牌 ${shuffleRound} 次 · 随心继续` : `Shuffled ${shuffleRound} times · Follow your intuition`) : "\u00a0"}</p>
        <button className="next-link" onClick={onDraw}>NEXT <span>→</span></button>
      </div>
    </main>
  );
}

function TarotCard({ item, revealed, label, delay = 0, onClick, compact = false }) {
  return (
    <button className={`tarot-card ${revealed ? "is-revealed" : ""} ${compact ? "compact" : ""}`} style={{ "--delay": `${delay}ms` }} onClick={onClick} aria-label={label} disabled={!onClick}>
      <span className="card-inner">
        <span className="card-face card-back"><img src={cardBack} alt="" /></span>
        <span className="card-face card-front" aria-hidden={!revealed}><img className={item?.reversed ? "reversed-image" : ""} src={item?.card.image} alt={item?.card.en || ""} /></span>
      </span>
    </button>
  );
}

function DeckRail({ lang, deck, drawn, limit, onPick, busy }) {
  const rail = useRef(null);
  const [position, setPosition] = useState({ left: 0, width: 1000, max: 0, step: 70 });
  const complete = drawn.length >= limit;

  useEffect(() => {
    const element = rail.current;
    let frame;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPosition({
        left: element.scrollLeft, width: element.clientWidth,
        max: element.scrollWidth - element.clientWidth,
        step: parseFloat(getComputedStyle(element).getPropertyValue("--deck-step"))
      }));
    };
    const wheel = event => {
      // Keep trackpad horizontal gestures native; map a vertical mouse wheel to the deck.
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const scale = event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? element.clientWidth : 1;
      const next = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, element.scrollLeft + event.deltaY * scale));
      if (next !== element.scrollLeft) {
        event.preventDefault();
        element.scrollLeft = next;
      }
    };
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("scroll", measure, { passive: true });
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("scroll", measure);
    };
  }, []);

  const move = direction => rail.current.scrollBy({ left: direction * position.width * 0.7, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  const keydown = (event, index) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const buttons = [...rail.current.querySelectorAll(".deck-choice")];
    const direction = event.key === "ArrowLeft" || event.key === "End" ? -1 : 1;
    let next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : index + direction;
    while (next >= 0 && next < buttons.length && buttons[next].disabled) next += direction;
    buttons[next]?.focus();
  };
  return (
    <section className="deck-browser" aria-label={lang === "zh" ? "完整的 78 张塔罗牌" : "All 78 tarot cards"}>
      <div className="deck-instruction">
        <span>{lang === "zh" ? "滚动鼠标滚轮浏览 · 点击你想选择的牌" : "Scroll to explore · Choose a card that draws you in"}</span>
        <span>{lang === "zh" ? "78 张完整牌组" : "Full deck · 78 cards"}</span>
      </div>
      <div className="deck-rail" ref={rail}>
        <div className="deck-track">
          {deck.map((item, index) => {
            const selectedIndex = drawn.findIndex(entry => entry.card.id === item.card.id);
            const offset = (index * position.step + 104 - position.left - position.width / 2) / (position.width / 2);
            const curve = Math.max(-1.5, Math.min(1.5, offset));
            const label = lang === "zh" ? `第 ${index + 1} 张牌${selectedIndex >= 0 ? "，已选择" : ""}` : `Card ${index + 1}${selectedIndex >= 0 ? ", selected" : ""}`;
            return (
              <div className="deck-place" key={item.card.id} style={{ "--tilt": `${curve * 12}deg`, "--arc-y": `${Math.min(90, curve * curve * 38)}px` }}>
                <button className={`deck-choice ${selectedIndex >= 0 ? "chosen" : ""}`} aria-label={label} aria-pressed={selectedIndex >= 0} disabled={complete || busy || selectedIndex >= 0} onClick={event => onPick(index, event.currentTarget.getBoundingClientRect())} onKeyDown={event => keydown(event, index)}>
                  <img src={cardBack} alt="" draggable="false" />
                  <span className="deck-number">{String(index + 1).padStart(2, "0")}</span>
                  {selectedIndex >= 0 && <span className="chosen-stamp">✓<small>{selectedIndex + 1}</small></span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="deck-navigation">
        <button type="button" onClick={() => move(-1)} disabled={position.left <= 1} aria-label={lang === "zh" ? "向左浏览牌组" : "Browse cards to the left"}>←</button>
        <span>{lang === "zh" ? "左右滑动 · 方向键也可选牌" : "Swipe or use the arrow keys"}</span>
        <button type="button" onClick={() => move(1)} disabled={position.left >= position.max - 1} aria-label={lang === "zh" ? "向右浏览牌组" : "Browse cards to the right"}>→</button>
      </div>
    </section>
  );
}

function FlyingCard({ flight, lang, onLand }) {
  const element = useRef(null);
  useEffect(() => {
    const outer = element.current;
    const inner = outer.querySelector(".card-inner");
    const width = Math.min(190, window.innerWidth * .45);
    const height = width * 1642 / 958;
    const center = { x: (window.innerWidth - width) / 2, y: (window.innerHeight - height) / 2 - 30 };
    const transform = rect => `translate(${rect.left + rect.width / 2 - width / 2}px, ${rect.top + rect.height / 2 - height / 2}px) scale(${rect.width / width})`;
    let cancelled = false;
    let animations = [];
    const run = async () => {
      try { await outer.querySelector(".card-front img").decode(); } catch { /* The image still has its accessible label. */ }
      if (cancelled) return;
      const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 1900;
      const centered = `translate(${center.x}px, ${center.y}px) scale(1)`;
      animations = [outer.animate([
        { transform: transform(flight.source), opacity: 1, offset: 0 },
        { transform: centered, opacity: 1, offset: .2 },
        { transform: centered, opacity: 1, offset: .73 },
        { transform: transform(flight.destination), opacity: 1, offset: 1 }
      ], { duration, easing: "ease-in-out", fill: "forwards" }),
      inner.animate([{ transform: "rotateY(0deg)", offset: 0 }, { transform: "rotateY(0deg)", offset: .15 }, { transform: "rotateY(180deg)", offset: .4 }, { transform: "rotateY(180deg)", offset: 1 }], { duration, fill: "forwards" })];
      animations[0].finished.then(() => { if (!cancelled) onLand(); }).catch(() => {});
    };
    run();
    return () => { cancelled = true; animations.forEach(animation => animation.cancel()); };
  }, [flight]);
  return <div className="flying-card" ref={element}>
    <TarotCard item={flight.item} revealed={false} label={flight.item.card[lang === "zh" ? "cn" : "en"]} />
    <span className="flying-caption">{flight.item.card[lang === "zh" ? "cn" : "en"]} · {flight.item.reversed ? copy[lang].reversed : copy[lang].upright}</span>
  </div>;
}

function Draw({ lang, theme, deck, drawn, onDraw, onReveal }) {
  const t = copy[lang];
  const spread = spreads[theme];
  const [flight, setFlight] = useState(null);
  const picking = useRef(false);
  const slots = useRef([]);
  const pick = (index, source) => {
    if (picking.current || drawn.length >= spread.count || drawn.some(item => item.card.id === deck[index].card.id)) return;
    picking.current = true;
    const destination = slots.current[drawn.length].querySelector(".empty-slot").getBoundingClientRect();
    setFlight({ index, item: deck[index], source, destination });
  };
  const latest = drawn.at(-1);
  return (
    <main className="draw-screen selection-screen screen-enter">
      <div className="selection-table">
      <section className="draw-heading">
        <p className="eyebrow">{lang === "zh" ? spread.cn : spread.en}</p>
        <h1>{lang === "zh" ? spread.promptCn : spread.promptEn}</h1>
        <p role="status" aria-live="polite">{t.drawn} {drawn.length} / {spread.count}{drawn.length < spread.count ? ` · ${spread.positions[drawn.length][lang === "zh" ? 0 : 1]}` : ""}</p>
        {latest && <div className="latest-card" aria-live="polite"><strong>{latest.card[lang === "zh" ? "cn" : "en"]} · {latest.reversed ? t.reversed : t.upright}</strong><p>{meaningFor(latest.card, latest.reversed, lang)}</p></div>}
      </section>
      <div className={`spread-grid ${theme}`}>
        {spread.positions.map((position, index) => (
          <div className={`spread-slot slot-${index + 1}`} key={position[0]} ref={element => { slots.current[index] = element; }}>
            {drawn[index] ? <TarotCard item={drawn[index]} revealed label={`${drawn[index].card[lang === "zh" ? "cn" : "en"]} · ${drawn[index].reversed ? t.reversed : t.upright}`} /> : <span className="empty-slot"><b>{index + 1}</b></span>}
            <small>{position[lang === "zh" ? 0 : 1]}</small>
          </div>
        ))}
      </div>
      </div>
      <DeckRail lang={lang} deck={deck} drawn={drawn} limit={spread.count} onPick={pick} busy={!!flight} />
      {flight && <FlyingCard flight={flight} lang={lang} onLand={() => { onDraw(flight.index); setFlight(null); picking.current = false; }} />}
      {drawn.length === spread.count && <div className="reading-ready"><button className="next-link" onClick={onReveal} autoFocus>{t.reveal}</button></div>}
    </main>
  );
}

function Reading({ lang, theme, drawn, activeIndex, setActiveIndex, saved, onSave, onRestart, onHome }) {
  const t = copy[lang];
  const spread = spreads[theme];
  const active = drawn[activeIndex];
  const position = spread.positions[activeIndex];
  const orientation = active.reversed ? t.reversed : t.upright;
  const themeName = t.themeNames[theme];
  const detail = lang === "zh"
    ? `${position[0]}位置出现${active.card.cn}（${orientation}）。它把注意力带向${meaningFor(active.card, active.reversed, lang)}。在${themeName}议题里，先观察这份讯息与你当下哪个选择或感受最接近。`
    : `${active.card.en} appears in ${position[1].toLowerCase()} (${orientation.toLowerCase()}). It draws attention to ${meaningFor(active.card, active.reversed, lang)}. In this ${themeName.toLowerCase()} reading, notice which present feeling or choice this reflects most closely.`;
  const summary = drawn.slice(0, 3).map((item) => meaningFor(item.card, item.reversed, lang).split(",")[0].split("、")[0]).join(lang === "zh" ? "、" : ", ");
  return (
    <main className="reading-screen screen-enter">
      <section className="reading-layout">
        <div className={`reading-spread ${theme}`}>
          {drawn.map((item, index) => (
            <div className={`reading-card-wrap slot-${index + 1} ${activeIndex === index ? "active" : ""}`} key={`${item.card.id}-${index}`}>
              <TarotCard item={item} revealed delay={index * 130} compact label={item.card[lang === "zh" ? "cn" : "en"]} onClick={() => setActiveIndex(index)} />
              <small>{spread.positions[index][lang === "zh" ? 0 : 1]}</small>
            </div>
          ))}
        </div>
        <article className="interpretation-panel">
          <p className="eyebrow">{lang === "zh" ? spread.cn : spread.en}</p>
          <h1>{active.card[lang === "zh" ? "cn" : "en"]}</h1>
          <div className="orientation"><span>✦</span>{orientation}</div>
          <h2>{position[lang === "zh" ? 0 : 1]}</h2>
          <p className="detail-copy">{detail}</p>
          <div className="summary-box"><strong>{t.summary}</strong><p>{t.summaryLead} {summary}{lang === "zh" ? "。" : "."}</p></div>
          <p className="reflection-copy">{t.reflection}</p>
          <div className="reading-actions">
            <button className="line-action" onClick={onSave}>{t.save}<span>↓</span></button>
            <button className="line-action" onClick={onRestart}>{t.restart}<span>↻</span></button>
            <button className="line-action" onClick={onHome}>{t.home}<span>→</span></button>
          </div>
        </article>
      </section>
      <p className="disclaimer">{t.disclaimer}</p>
    </main>
  );
}

function CardDetails({ index, lang, setLang, onSelect, onClose }) {
  const dialog = useRef(null);
  const card = cards[index];
  const lore = cardLore[card.id][lang];
  const t = copy[lang];
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => { dialog.current.scrollTop = 0; }, [index]);
  return <dialog className="card-details" ref={dialog} aria-labelledby="card-detail-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="card-details-shell">
      <header className="card-details-toolbar">
        <span>{lang === "zh" ? "牌的故事" : "Behind the card"}</span>
        <div><button className="language-button" onClick={() => setLang(lang === "zh" ? "en" : "zh")} aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}>{t.language}</button><button className="close-button" onClick={onClose} aria-label={t.close} autoFocus>×</button></div>
      </header>
      <div className="card-details-layout">
        <div className="card-details-art"><img src={card.image} alt={card[lang === "zh" ? "cn" : "en"]} /><span>{String(index + 1).padStart(2, "0")} / 78</span></div>
        <article>
          <p className="eyebrow">{card.suit === "major" ? (lang === "zh" ? "大阿尔卡纳" : "Major Arcana") : (lang === "zh" ? "小阿尔卡纳" : "Minor Arcana")}</p>
          <h2 id="card-detail-title">{card[lang === "zh" ? "cn" : "en"]}</h2>
          <p className="card-detail-subtitle">{card[lang === "zh" ? "en" : "cn"]}</p>
          <section><h3>{lang === "zh" ? "牌的故事" : "The story"}</h3><p>{lore.story}</p></section>
          <section><h3>{lang === "zh" ? "大众含义" : "General meaning"}</h3><p>{lore.general}</p></section>
          <div className="card-meaning-pair"><section><h3>{t.upright}</h3><p>{meaningFor(card, false, lang)}</p></section><section><h3>{t.reversed}</h3><p>{meaningFor(card, true, lang)}</p></section></div>
          <p className="card-lore-note">{lang === "zh" ? "故事为基于常见塔罗象征的原创叙述；牌义随问题与牌阵而变化。象征参考：" : "An original retelling of common tarot symbolism. Meanings vary with the question and spread. Symbolic reference: "}<a href={`https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot/Part_${card.suit === "major" ? 2 : 3}`} target="_blank" rel="noreferrer">A. E. Waite · The Pictorial Key to the Tarot</a></p>
        </article>
      </div>
      <nav className="card-details-navigation" aria-label={lang === "zh" ? "浏览牌的故事" : "Browse card stories"}>
        <button className="next-link" onClick={() => onSelect(index - 1)} disabled={index === 0}>← {lang === "zh" ? "上一张" : "Previous"}</button>
        <span>{index + 1} / 78</span>
        <button className="next-link" onClick={() => onSelect(index + 1)} disabled={index === cards.length - 1}>{lang === "zh" ? "下一张" : "Next"} →</button>
      </nav>
    </div>
  </dialog>;
}

function Gallery({ lang, setLang, onBack }) {
  const t = copy[lang];
  const [selected, setSelected] = useState(null);
  return (
    <main className="gallery-screen screen-enter">
      <section className="gallery-heading">
        <button className="text-button" onClick={onBack}>← {t.back}</button>
        <p className="eyebrow">LUMEN ARCANA</p>
        <h1>{t.deckTitle}</h1>
        <p>{t.deckIntro}</p>
        <p className="gallery-hint">{lang === "zh" ? "轻触任意一张牌，读它的故事与含义。" : "Choose a card to discover its story and meaning."}</p>
      </section>
      <div className="gallery-grid">
        {cards.map((card, index) => <figure key={card.id}><button className="gallery-card" aria-haspopup="dialog" aria-label={lang === "zh" ? `阅读${card.cn}的故事与含义` : `Read about ${card.en}`} onClick={() => setSelected(index)}><img src={card.image} alt="" loading="lazy" /><span className="gallery-caption">{card[lang === "zh" ? "cn" : "en"]}</span><small>{lang === "zh" ? "阅读故事" : "Discover the story"} ↗</small></button></figure>)}
      </div>
      {selected !== null && <CardDetails index={selected} lang={lang} setLang={setLang} onSelect={setSelected} onClose={() => setSelected(null)} />}
    </main>
  );
}

function ResultPreview({ lang, theme, drawn, onClose }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const close = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    close.current.focus();
    const keydown = event => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const controls = [...close.current.closest("section").querySelectorAll("button, a[href]")];
        const index = controls.indexOf(document.activeElement);
        event.preventDefault();
        controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
      }
    };
    document.addEventListener("keydown", keydown);
    let cancelled = false;
    let objectUrl;
    createResultImage(theme, drawn, lang).then(blob => {
      if (cancelled) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); document.removeEventListener("keydown", keydown); previousFocus?.focus(); };
  }, [lang, theme, drawn]);
  return <div className="modal-backdrop result-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="result-preview" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <div className="result-toolbar"><h2 id="result-title">{lang === "zh" ? "此刻的牌阵" : "Your reading, to keep"}</h2><button ref={close} className="close-button" onClick={onClose} aria-label={copy[lang].close}>×</button></div>
      {url ? <><img className="result-image" src={url} alt={lang === "zh" ? "包含所有牌位、牌面和解读的结果卡片" : "Your complete spread with card meanings"} /><a className="next-link" href={url} download={`Lumen-Arcana-${theme}-${new Date().toISOString().slice(0, 10)}.png`}>{lang === "zh" ? "下载结果图片" : "Download image"} <span>↓</span></a><p>{lang === "zh" ? "手机上也可长按图片保存" : "On mobile, you can also hold the image to save it"}</p></> : <p role="status">{error ? (lang === "zh" ? "图片生成失败，请关闭后重新尝试。" : "Could not create the image. Please close and try again.") : (lang === "zh" ? "正在生成你的结果卡片…" : "Creating your keepsake…")}</p>}
    </section>
  </div>;
}

function HistoryPanel({ lang, history, onClose, onOpen, onClear }) {
  const t = copy[lang];
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="history-panel" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <div className="panel-head"><div><p className="eyebrow">LUMEN ARCANA</p><h2 id="history-title">{t.historyTitle}</h2></div><button className="close-button" onClick={onClose}>×<span className="sr-only">{t.close}</span></button></div>
        {history.length === 0 ? <p className="empty-history">{t.historyEmpty}</p> : (
          <div className="history-list">
            {history.map((item) => (
              <button key={item.id} className="history-item" onClick={() => onOpen(item)}>
                <span><strong>{lang === "zh" ? spreads[item.theme].cn : spreads[item.theme].en}</strong><small>{new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", { dateStyle:"medium", timeStyle:"short" }).format(new Date(item.date))}</small></span>
                <span className="history-thumbs">{item.cards.slice(0, 3).map((entry) => <img key={entry.id} src={cards.find((card) => card.id === entry.id)?.image} alt="" />)}</span>
              </button>
            ))}
          </div>
        )}
        {history.length > 0 && <button className="clear-history" onClick={onClear}>{lang === "zh" ? "清除全部记录" : "Clear all history"}</button>}
      </aside>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lumen-language") || "zh");
  const [view, setView] = useState("home");
  const [theme, setTheme] = useState("love");
  const [shuffling, setShuffling] = useState(false);
  const [shuffleRound, setShuffleRound] = useState(0);
  const shuffleTimer = useRef(null);
  const [drawn, setDrawn] = useState([]);
  const [deck, setDeck] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lumen-history") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("lumen-language", lang); document.documentElement.lang = lang === "zh" ? "zh-CN" : "en"; }, [lang]);
  useEffect(() => { localStorage.setItem("lumen-history", JSON.stringify(history)); }, [history]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [view]);
  useEffect(() => () => clearTimeout(shuffleTimer.current), []);

  const selectTheme = (nextTheme) => { clearTimeout(shuffleTimer.current); setTheme(nextTheme); setDrawn([]); setShuffleRound(0); setShuffling(false); setDeck(shuffleDeck(cards)); setSaved(false); setView("shuffle"); };
  const shuffle = () => { clearTimeout(shuffleTimer.current); setDeck(shuffleDeck(cards)); setShuffleRound(round => round + 1); setShuffling(true); shuffleTimer.current = window.setTimeout(() => setShuffling(false), 1000); };
  const drawNext = index => {
    setDrawn(current => pickCard(current, deck[index], spreads[theme].count));
  };
  const reveal = () => { setActiveIndex(0); setView("reading"); };
  const restart = () => { setDrawn([]); setSaved(false); setView("themes"); };
  const home = () => { setDrawn([]); setSaved(false); setView("home"); };
  const save = () => {
    setResultOpen(true);
    if (saved) return;
    const record = { id: crypto.randomUUID(), date: new Date().toISOString(), theme, cards: drawn.map(({ card, reversed }) => ({ id: card.id, reversed })) };
    setHistory((current) => [record, ...current].slice(0, 30));
    setSaved(true);
  };
  const openHistory = (record) => {
    const restored = record.cards.map((entry) => ({ card: cards.find((card) => card.id === entry.id), reversed: entry.reversed })).filter((entry) => entry.card);
    setTheme(record.theme); setDrawn(restored); setActiveIndex(0); setSaved(true); setView("reading"); setHistoryOpen(false);
  };

  return (
    <div className="app-shell">
      <Header lang={lang} setLang={setLang} setView={setView} setHistoryOpen={setHistoryOpen} home={view === "home"} />
      {view === "home" && <Home lang={lang} setView={setView} />}
      {view === "themes" && <Themes lang={lang} onSelect={selectTheme} />}
      {view === "shuffle" && <Shuffle lang={lang} theme={theme} shuffling={shuffling} shuffleRound={shuffleRound} onShuffle={shuffle} onDraw={() => setView("draw")} />}
      {view === "draw" && <Draw lang={lang} theme={theme} deck={deck} drawn={drawn} onDraw={drawNext} onReveal={reveal} />}
      {view === "reading" && drawn.length > 0 && <Reading lang={lang} theme={theme} drawn={drawn} activeIndex={activeIndex} setActiveIndex={setActiveIndex} saved={saved} onSave={save} onRestart={restart} onHome={home} />}
      {view === "gallery" && <Gallery lang={lang} setLang={setLang} onBack={() => setView("home")} />}
      {historyOpen && <HistoryPanel lang={lang} history={history} onClose={() => setHistoryOpen(false)} onOpen={openHistory} onClear={() => setHistory([])} />}
      {resultOpen && <ResultPreview lang={lang} theme={theme} drawn={drawn} onClose={() => setResultOpen(false)} />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
