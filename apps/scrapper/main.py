import time
import json
import os
import requests
import re
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from datetime import datetime

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def click_load_more(driver):
    try:
        print("🖱️ Scrolling to Load More button...")
        time.sleep(2)
        wait = WebDriverWait(driver, 10)
        button = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "a.elementor-button")))

        # Scroll the element into view
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
        time.sleep(1)

        # Use JS to click to avoid interception
        driver.execute_script("arguments[0].click();", button)
        print("✅ 'Load More' clicked using JS.")
        time.sleep(5)  # Let new posts load in

    except Exception as e:
        print(f"⚠️ Load More button not clicked: {e}")


# ---------- CONFIG ----------
BASE_URL = "https://promptlibrary.org"
OUTPUT_DIR = "output"
TEST_MODE = False        # ✅ Set to False to scrape all
MAX_TEST_POSTS = 3     # Used if TEST_MODE is True

# ---------- SETUP BROWSER ----------
def setup_driver():
    options = Options()
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--headless")  # Uncomment to run without opening browser
    return webdriver.Chrome(options=options)

# ---------- GET POST AND TAG URLS ----------
def collect_post_urls():
    driver = setup_driver()
    print("🌐 Opening homepage...")
    driver.get(BASE_URL)
    time.sleep(5)

    print("📜 Scrolling...")
    for _ in range(5):
        driver.execute_script("window.scrollBy(0, window.innerHeight);")
        time.sleep(5)

    click_load_more(driver)
    time.sleep(10)
    print("📜 Scrolling...")
    for _ in range(5):
        driver.execute_script("window.scrollBy(0, window.innerHeight);")
        time.sleep(5)
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

# ---------- EXTRACT SLUG FROM URL ----------
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

        # ✅ Image Filtering (by slug and case-insensitive match)
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

# ---------- MAIN FUNCTION ----------
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    posts_file = os.path.join(OUTPUT_DIR, f"posts-{timestamp}.json")
    tag_urls_file = os.path.join(OUTPUT_DIR, "tag_urls.json")

    post_urls, tag_urls = collect_post_urls()
    print(f"\n✅ Found {len(post_urls)} post URLs")
    print(f"🏷️ Found {len(tag_urls)} tag URLs\n")

    # Save tag URLs
    with open(tag_urls_file, "w", encoding="utf-8") as f:
        json.dump(tag_urls, f, indent=2)

    # Limit if test mode
    if TEST_MODE:
        post_urls = post_urls[:MAX_TEST_POSTS]
        print(f"🚧 TEST MODE: scraping only {MAX_TEST_POSTS} posts...\n")

    all_posts = []
    for i, url in enumerate(post_urls):
        print(f"[{i+1}/{len(post_urls)}]")
        post = scrape_post_data(url)
        if post:
            all_posts.append(post)
            # ✅ Save incrementally
            with open(posts_file, "w", encoding="utf-8") as f:
                json.dump(all_posts, f, indent=2, ensure_ascii=False)

    print("\n✅ Done!")
    print(f"📁 Posts saved to: {posts_file}")
    print(f"🏷️ Tags saved to: {tag_urls_file}")

# ---------- RUN ----------
if __name__ == "__main__":
    main()
