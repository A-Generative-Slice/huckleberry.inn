import urllib.request
import urllib.parse
import urllib.error
import json
import time
import cv2
import numpy as np
import re
import os

items = [
    (
        "item-milo-tres-leches",
        "Clear square dessert tub of artisan Milo Tres Leches cake, layers of milk-soaked malt chocolate sponge, condensed milk cream, thick velvet dusting of Milo malt chocolate powder, chocolate pearls, luxury dessert photography, text-free, clean background, 8k"
    ),
    (
        "item-swiss-roll-chocolate",
        "Individual slice and roll of dark chocolate Swiss roll pastry, moist dark cocoa sponge rolled with smooth vanilla mascarpone cream, dark chocolate ganache drizzle, chocolate curls, high-end pastry shop presentation, text-free, 8k"
    ),
    (
        "item-cupcake",
        "Single gourmet chocolate cupcake in dark pleated liner, lavish swirl of rich whipped dark chocolate fudge buttercream frosting, delicate chocolate shavings on top, elegant bakery setting, text-free, 8k"
    ),
    (
        "item-nutella-cookie",
        "Artisan thick chunky gourmet chocolate chip cookie split in half, warm molten Nutella filling oozing from the center, toasted hazelnut pieces, flaky sea salt, rustic bakery plate, text-free, 8k"
    ),
    (
        "item-tiramisu-tub",
        "Clear dessert cup with classic artisan Italian tiramisu, distinct layers of espresso-soaked Savoiardi ladyfingers and whipped mascarpone cream, dusted generously with dark cocoa powder, text-free, 8k"
    ),
    (
        "item-cake-pops-vanilla",
        "Two artisanal gourmet vanilla cake pops on sticks, dipped in smooth pastel pink and ivory white candy coating, tiny pearl sprinkles, tied with soft satin ribbon, boutique confectionery photography, text-free, 8k"
    )
]

def clean_watermark(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return
    h, w, _ = img.shape
    # Pollinations watermark is usually in the bottom right corner (approx 160x30)
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.rectangle(mask, (w - 180, h - 35), (w, h), 255, -1)
    clean = cv2.inpaint(img, mask, 5, cv2.INPAINT_TELEA)
    cv2.imwrite(image_path, clean)

def generate_item(name, prompt, seed):
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&nologo=true&seed={seed}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    
    max_retries = 5
    for attempt in range(max_retries):
        try:
            print(f"[{name}] Requesting generation (attempt {attempt+1}/{max_retries})...")
            with urllib.request.urlopen(req, timeout=40) as resp:
                data = resp.read()
                out_path = f"assets/images/{name}.jpg"
                with open(out_path, "wb") as f:
                    f.write(data)
                clean_watermark(out_path)
                print(f"[{name}] Successfully generated and saved to {out_path} ({len(data)} bytes)")
                return True
        except urllib.error.HTTPError as e:
            err_body = e.read().decode(errors="ignore")
            print(f"[{name}] HTTP Error {e.code}: {err_body}")
            if e.code == 402:
                # Parse retry after seconds if present
                match = re.search(r"Retry after (\d+)s", err_body)
                wait_sec = int(match.group(1)) + 3 if match else 48
                print(f"[{name}] Rate limit hit. Sleeping {wait_sec}s before retry...")
                time.sleep(wait_sec)
            else:
                time.sleep(10)
        except Exception as e:
            print(f"[{name}] Error: {e}")
            time.sleep(5)
            
    return False

def main():
    os.makedirs("assets/images", exist_ok=True)
    print(f"Starting generation for {len(items)} items...")
    for idx, (name, prompt) in enumerate(items):
        print(f"\n--- Item {idx+1}/{len(items)}: {name} ---")
        success = generate_item(name, prompt, seed=idx*31337 + 101)
        if not success:
            print(f"FAILED to generate {name}")
        # To avoid 402 on the next request, proactively wait 48 seconds
        if idx < len(items) - 1:
            print("Proactively sleeping 48s for API rate-limit window...")
            time.sleep(48)
            
    print("\nAll items processed!")

if __name__ == "__main__":
    main()
