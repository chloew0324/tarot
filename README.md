# Lumen Arcana

中英文塔罗牌交互网站，使用 React 与 Vite 构建。包含完整 78 张牌、正逆位牌义、四种主题牌阵、翻牌动画及本地历史记录。

首页使用原始透明标题图，卡片支持悬停翻背。洗牌页可反复点击中央牌堆，自行决定洗牌次数，再通过 NEXT 进入抽牌。

图鉴中每张牌都可点击，查看大图、独立的中英文象征故事、大众含义与正逆位关键词；支持前后翻阅与 Escape 关闭。故事为原创象征叙述，并非本套牌的创作者设定。象征参考 A. E. Waite 的《The Pictorial Key to the Tarot》。主题标题使用本地托管的 Cormorant 字体，许可证保存在 `public/fonts/OFL-Cormorant.txt`。

抽牌页将 78 张洗好的牌全部排入弧形牌带。将鼠标移到牌带上滚动滚轮，或使用触控板、手机横向滑动浏览；悬停抬牌，点击后立即翻面、展示名称与正逆位，再落入对应牌位。也可用左右按钮或方向键浏览，Home / End 跳到首尾。已选牌保留位置并显示标记。

保存结果会生成可下载的 PNG，同时保留本地历史记录。四种主题分别使用十字、上升路径、四宫格和三牌横排，包含所有牌位和牌义。原始牌图和标题图均在本地渲染，不上传到外部服务。

## 本地启动

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

终端会显示 localhost 地址，通常为 `http://localhost:5173`。

## 生产构建

```bash
npm run build
npm run preview
```

生成的静态文件位于 `dist/`，可部署到 GitHub Pages、Vercel、Netlify 或任意静态网站服务。

运行 `npm run check` 检查完整牌组、图片路径、牌阵，以及洗牌和防止重复选牌的逻辑。

开发服务器启动后，可访问 `/scripts/preview-results.html`，验证四种牌阵、中英文共八张 PNG 的生成与排版。

## 素材处理

原始牌面保存在项目外层的 `图片/` 文件夹。重新加入或替换素材后，在 `coding/` 中运行：

```bash
python3 scripts/process_cards.py
```

脚本会裁除牌框外背景、添加透明通道、统一输出 PNG，并压缩到适合网页使用的尺寸。
