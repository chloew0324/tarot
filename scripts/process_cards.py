#!/usr/bin/env python3
"""Crop tarot scans to their printed border and export web-ready transparent PNGs."""

from pathlib import Path
from PIL import Image, ImageChops, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "图片"
OUTPUT = ROOT / "coding" / "public" / "cards"
MAX_WIDTH = 480


def border_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()

    def is_ink(pixel: tuple[int, int, int]) -> bool:
        return max(pixel) - min(pixel) > 8 or sum(pixel) / 3 < 242

    x_scores = [
        sum(is_ink(pixels[x, y]) for y in range(0, height, 4)) / ((height + 3) // 4)
        for x in range(width)
    ]
    y_scores = [
        sum(is_ink(pixels[x, y]) for x in range(0, width, 4)) / ((width + 3) // 4)
        for y in range(height)
    ]
    xs = [i for i, score in enumerate(x_scores) if score > 0.45]
    ys = [i for i, score in enumerate(y_scores) if score > 0.45]
    if not xs or not ys:
        raise ValueError("Could not detect the printed card border")
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def process(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    image = image.crop(border_bounds(image))
    if image.width > MAX_WIDTH:
        height = round(image.height * MAX_WIDTH / image.width)
        image = image.resize((MAX_WIDTH, height), Image.Resampling.LANCZOS)

    radius = max(8, round(min(image.size) * 0.028))
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, image.width - 1, image.height - 1), radius=radius, fill=255
    )
    image.putalpha(ImageChops.multiply(image.getchannel("A"), mask))
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, format="PNG", optimize=True, compress_level=9)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    sources = [
        path
        for path in SOURCE.rglob("*")
        if path.is_file() and path.suffix.lower() in {".png", ".jpg", ".jpeg"}
        and (path.parent != SOURCE or path.stem == "卡背")
    ]
    for source in sorted(sources):
        group = "back" if source.parent == SOURCE else source.parent.name
        destination = OUTPUT / group / f"{source.stem.lower()}.png"
        if destination.exists() and destination.stat().st_mtime >= source.stat().st_mtime:
            continue
        process(source, destination)
        print(f"{source.relative_to(ROOT)} -> {destination.relative_to(ROOT)}")
    print(f"Processed {len(sources)} images")


if __name__ == "__main__":
    main()
