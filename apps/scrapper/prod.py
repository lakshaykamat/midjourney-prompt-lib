import time
import json
import os
import requests
import re
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime

# ---------- CONFIG ----------
BASE_URL = "https://promptlibrary.org"
OUTPUT_DIR = "output"
LOAD_MORE_CLICKS = 100     # 🔁 Number of times to click "Load More"
TEST_MODE = False
MAX_TEST_POSTS = 3
NODE_ENDPOINT = "https://midjourney-prompt-lib-scrapper.onrender.com/api/save-post"

# ---------- SETUP BROWSER ----------
def setup_driver():
    options = Options()
    options.add_argument("--headless=new")  # Hides the browser window (new headless mode)
    options.add_argument("--disable-gpu")   # Often recommended for headles
    options.add_argument("--window-size=1920,1080")
    return webdriver.Chrome(options=options)

# ---------- CLICK LOAD MORE ----------
def click_load_more(driver):
    try:
        print("🖱️ Scrolling to Load More button...")
        time.sleep(2)
        wait = WebDriverWait(driver, 10)
        button = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "a.elementor-button")))
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
        time.sleep(1)
        driver.execute_script("arguments[0].click();", button)
        print("✅ 'Load More' clicked using JS.")
        time.sleep(7)
    except Exception as e:
        print(f"⚠️ Load More button not clicked: {e}")

# ---------- GET POST AND TAG URLS ----------
def collect_post_urls():
    driver = setup_driver()
    print("🌐 Opening homepage...")
    driver.get(BASE_URL)
    time.sleep(5)

    print("📜 Scrolling initial view...")
    for _ in range(3):
        driver.execute_script("window.scrollBy(0, window.innerHeight);")
        time.sleep(2)

    for i in range(LOAD_MORE_CLICKS):
        print(f"🔁 Clicking Load More [{i+1}/{LOAD_MORE_CLICKS}]")
        click_load_more(driver)
        time.sleep(3)

    print("📜 Final scroll for full content...")
    for _ in range(3):
        driver.execute_script("window.scrollBy(0, window.innerHeight);")
        time.sleep(2)

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    all_links = {
        a["href"] for a in soup.find_all("a", href=True)
        if a["href"].startswith("http") and "promptlibrary.org" in a["href"]
    }

    tag_urls = {link for link in all_links if "/tag/" in link}
    post_urls = {
        link for link in all_links
        if "/tag/" not in link and link.strip("/") != BASE_URL.strip("/")
    }

    return sorted(post_urls), sorted(tag_urls)

# ---------- EXTRACT SLUG ----------
def get_slug(url):
    return urlparse(url).path.strip("/").split("/")[-1].lower()

# ---------- SCRAPE ONE POST ----------
def scrape_post_data(url):
    try:
        print(f"🔍 Scraping: {url}")
        res = requests.get(url, timeout=10)
        if res.status_code != 200:
            print(f"❌ Failed: {url}")
            return None

        soup = BeautifulSoup(res.text, "html.parser")

        title_tag = soup.find("h1", class_="elementor-heading-title")
        title = title_tag.get_text(strip=True) if title_tag else "No Title"

        code_block = soup.find("pre")
        prompt = code_block.get_text(strip=True) if code_block else "No prompt."

        tag_links = soup.select("span.elementor-post-info__terms-list a")
        tags = [{"name": tag.get_text(strip=True), "url": tag["href"]} for tag in tag_links if tag.get("href")]

        slug = get_slug(url)
        images = {"original": None, "sizes": {}}

        for img in soup.find_all("img"):
            srcs = []
            if img.get("src"):
                srcs.append(img["src"])
            if img.get("srcset"):
                srcset_urls = [u.strip().split(" ")[0] for u in img["srcset"].split(",")]
                srcs.extend(srcset_urls)

            for image_url in srcs:
                url_lower = image_url.lower()
                if slug in url_lower and image_url.endswith(".webp"):
                    match = re.search(r"-([0-9]+x[0-9]+)\.webp$", image_url)
                    if match:
                        size = match.group(1)
                        images["sizes"][size] = image_url
                    else:
                        images["original"] = image_url

        return {
            "url": url,
            "title": title,
            "prompt": prompt,
            "tags": tags,
            "images": images
        }

    except Exception as e:
        print(f"⚠️ Error scraping {url}: {e}")
        return None

# ---------- MAIN ----------
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    tag_urls_file = os.path.join(OUTPUT_DIR, "tag_urls.json")

    post_urls, tag_urls = collect_post_urls()
    print(f"\n✅ Found {len(post_urls)} post URLs")
    print(f"🏷️ Found {len(tag_urls)} tag URLs\n")

    with open(tag_urls_file, "w", encoding="utf-8") as f:
        json.dump(tag_urls, f, indent=2)

    if TEST_MODE:
        post_urls = post_urls[:MAX_TEST_POSTS]
        print(f"🚧 TEST MODE: scraping only {MAX_TEST_POSTS} posts...\n")

    for i, url in enumerate(post_urls):
        print(f"[{i+1}/{len(post_urls)}]")
        post = scrape_post_data(url)
        if post:
            try:
                response = requests.post(NODE_ENDPOINT, json=post)
                if response.status_code == 200:
                    print("✅ Saved via Node.js API")
                else:
                    print(f"❌ Failed to save via Node.js: {response.status_code}")
            except Exception as e:
                print(f"⚠️ Error sending data to Node.js: {e}")

    print("\n✅ All done!")
    print(f"🏷️ Tags saved to: {tag_urls_file}")

# ---------- RUN ----------
if __name__ == "__main__":
    main()
