from __future__ import annotations

import argparse
import re
import time
from datetime import datetime

import requests
from bs4 import BeautifulSoup
from sqlalchemy import select

from app.core.config import get_settings
from app.db.session import SessionLocal
from app.ml.preprocess import convert_area_to_marla
from app.models.property import PropertyListing

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options as ChromeOptions

    HAS_SELENIUM = True
except ImportError:
    HAS_SELENIUM = False


def parse_price(raw_text: str) -> float | None:
    text = raw_text.lower().replace(",", "").strip()
    match = re.search(r"([\d.]+)", text)
    if not match:
        return None
    number = float(match.group(1))
    if "crore" in text:
        return number * 10_000_000
    if "lakh" in text:
        return number * 100_000
    return number


def fetch_html(url: str, use_selenium: bool = False) -> str:
    settings = get_settings()
    if use_selenium and HAS_SELENIUM:
        options = ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        browser = webdriver.Chrome(options=options)
        try:
            browser.get(url)
            time.sleep(2)
            return browser.page_source
        finally:
            browser.quit()

    headers = {"User-Agent": settings.scraper_user_agent}
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    return response.text


def extract_listings(html: str, city: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    cards = soup.select('article[aria-label="Listing"]')
    results: list[dict] = []

    for card in cards:
        price_raw = card.select_one('[aria-label="Price"]')
        location_raw = card.select_one('[aria-label="Location"]')
        title_raw = card.select_one("h2")
        beds_raw = card.select_one('[aria-label="Beds"]')
        baths_raw = card.select_one('[aria-label="Baths"]')
        area_raw = card.select_one('[aria-label="Area"]')
        link_raw = card.select_one("a")

        price = parse_price(price_raw.text if price_raw else "")
        location = location_raw.text.strip() if location_raw else "Unknown"
        title = title_raw.text.strip() if title_raw else "House"
        bedrooms = int(re.search(r"\d+", beds_raw.text).group()) if beds_raw and re.search(r"\d+", beds_raw.text) else None
        bathrooms = int(re.search(r"\d+", baths_raw.text).group()) if baths_raw and re.search(r"\d+", baths_raw.text) else None
        area_size_marla = convert_area_to_marla(area_raw.text if area_raw else "")
        source_listing_id = (
            link_raw.get("href", "").strip("/").split("-")[-1]
            if link_raw
            else None
        )

        if price is None or area_size_marla is None:
            continue

        results.append(
            {
                "source_listing_id": source_listing_id,
                "price": price,
                "city": city,
                "location_area": location,
                "property_type": "House" if "house" in title.lower() else "Flat",
                "area_size_marla": area_size_marla,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "latitude": None,
                "longitude": None,
                "listing_date": datetime.utcnow().date(),
            }
        )
    return results


def upsert_listings(listings: list[dict]) -> int:
    db = SessionLocal()
    inserted = 0
    try:
        for item in listings:
            source_id = item.get("source_listing_id")
            if source_id:
                exists = db.scalar(
                    select(PropertyListing).where(PropertyListing.source_listing_id == source_id)
                )
                if exists:
                    continue
            db.add(PropertyListing(**item))
            inserted += 1
        db.commit()
        return inserted
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape property listings from Zameen.")
    parser.add_argument("--city", default="lahore", choices=["lahore", "karachi"])
    parser.add_argument("--pages", type=int, default=3)
    parser.add_argument("--selenium", action="store_true")
    args = parser.parse_args()

    total_inserted = 0
    for page in range(1, args.pages + 1):
        url = f"https://www.zameen.com/Homes/{args.city.title()}-{page}.html"
        html = fetch_html(url, use_selenium=args.selenium)
        listings = extract_listings(html, city=args.city.title())
        total_inserted += upsert_listings(listings)
        time.sleep(1.0)

    print(f"Inserted {total_inserted} new listings into PostgreSQL.")


if __name__ == "__main__":
    main()

