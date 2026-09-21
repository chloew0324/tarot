import { meaningFor, spreads } from "./cards.js";

// The exported composition follows each spread, rather than enlarging one card.
export const resultLayouts = {
  love: { width: 1200, height: 2140, cardWidth: 156, points: [[600, 275], [345, 660], [600, 660], [855, 660], [600, 1045]], notes: 1440, row: 112 },
  career: { width: 1440, height: 1710, cardWidth: 164, points: [[210, 670], [465, 580], [720, 490], [975, 400], [1230, 310]], notes: 1100, row: 100 },
  wealth: { width: 1200, height: 1760, cardWidth: 188, points: [[380, 275], [820, 275], [380, 710], [820, 710]], notes: 1175, row: 112 },
  self: { width: 1440, height: 1480, cardWidth: 244, points: [[310, 300], [720, 300], [1130, 300]], notes: 930, row: 130 }
};

const loadImage = async src => {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = "";
  for (const part of text.match(/[\u3400-\u9fff]|[^\u3400-\u9fff\s]+\s*|\s/g) || []) {
    if (line && ctx.measureText(line + part).width > maxWidth) {
      ctx.fillText(line.trim(), x, y);
      line = part;
      y += lineHeight;
    } else line += part;
  }
  ctx.fillText(line.trim(), x, y);
}

export async function createResultImage(theme, drawn, lang, date = new Date()) {
  const spread = spreads[theme];
  if (!spread || drawn.length !== spread.count) throw new Error("Incomplete spread");
  const layout = resultLayouts[theme];
  const images = await Promise.all(drawn.map(item => loadImage(item.card.image)));
  const logo = await loadImage("/wordmark.png");
  const canvas = document.createElement("canvas");
  canvas.width = layout.width;
  canvas.height = layout.height;
  const ctx = canvas.getContext("2d");
  const { width, height, cardWidth, points, notes, row } = layout;
  const cardHeight = cardWidth * 1642 / 958;
  const zh = lang === "zh";
  const orientation = item => zh ? (item.reversed ? "逆位" : "正位") : (item.reversed ? "Reversed" : "Upright");
  ctx.fillStyle = "#fbf8f2";
  ctx.fillRect(0, 0, width, height);
  const glow = ctx.createRadialGradient(width * .74, height * .26, 30, width * .74, height * .26, width * .7);
  glow.addColorStop(0, "#ece2ee"); glow.addColorStop(.52, "#f9ece7"); glow.addColorStop(1, "#fbf8f2");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#c9b7b9"; ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, width - 64, height - 64);
  ctx.drawImage(logo, (width - 590) / 2, 70, 590, 590 * logo.height / logo.width);
  ctx.textAlign = "center"; ctx.fillStyle = "#493b45";
  ctx.font = '30px "Songti SC", Georgia, serif';
  ctx.fillText(zh ? spread.cn : spread.en, width / 2, 222);
  // Faint paths connect the cards without obscuring their artwork.
  ctx.beginPath();
  const route = theme === "love" ? [0, 2, 4, 2, 1, 2, 3] : theme === "wealth" ? [0, 1, 3, 2, 0] : points.map((_, i) => i);
  route.forEach((index, i) => {
    const [x, y] = points[index];
    if (i) ctx.lineTo(x, y + cardHeight / 2); else ctx.moveTo(x, y + cardHeight / 2);
  });
  ctx.stroke();
  drawn.forEach((item, i) => {
    const [x, y] = points[i];
    ctx.save();
    ctx.translate(x, y + cardHeight / 2);
    if (item.reversed) ctx.rotate(Math.PI);
    ctx.shadowColor = "#8e718522"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 7;
    ctx.drawImage(images[i], -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
    ctx.restore();
    ctx.fillStyle = "#715b67"; ctx.font = '20px "Songti SC", Georgia, serif';
    ctx.fillText(`${i + 1} · ${spread.positions[i][zh ? 0 : 1]}`, x, y + cardHeight + 30);
    ctx.fillStyle = "#312832"; ctx.font = '23px "Songti SC", Georgia, serif';
    ctx.fillText(item.card[zh ? "cn" : "en"], x, y + cardHeight + 60);
    ctx.fillStyle = "#886a78"; ctx.font = '18px "Helvetica Neue", sans-serif';
    ctx.fillText(orientation(item), x, y + cardHeight + 88);
  });
  ctx.textAlign = "left";
  drawn.forEach((item, i) => {
    const y = notes + i * row;
    ctx.beginPath(); ctx.moveTo(88, y - 22); ctx.lineTo(width - 88, y - 22); ctx.stroke();
    ctx.fillStyle = "#986e80"; ctx.font = '22px "Songti SC", Georgia, serif';
    ctx.fillText(`${String(i + 1).padStart(2, "0")}  ${spread.positions[i][zh ? 0 : 1]}`, 92, y + 7);
    ctx.fillStyle = "#342d35"; ctx.font = '25px "Songti SC", Georgia, serif';
    ctx.fillText(`${item.card[zh ? "cn" : "en"]} · ${orientation(item)}`, width * .39, y + 7);
    ctx.fillStyle = "#70656d"; ctx.font = '22px "Songti SC", Georgia, serif';
    wrapText(ctx, meaningFor(item.card, item.reversed, lang), width * .39, y + 43, width * .61 - 94, 31);
  });
  ctx.textAlign = "center"; ctx.font = '18px "Helvetica Neue", sans-serif'; ctx.fillStyle = "#8e7d86";
  ctx.fillText(`${new Intl.DateTimeFormat(zh ? "zh-CN" : "en", { dateStyle: "long" }).format(date)}  ·  LUMEN ARCANA`, width / 2, height - 84);
  ctx.font = '17px "Songti SC", Georgia, serif';
  ctx.fillText(zh ? "在光与直觉之间，听见此刻的自己。" : "Meet yourself between light and intuition.", width / 2, height - 52);
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Image export failed")), "image/png"));
}
