import json
import os
import time
from pathlib import Path
import scrapy
from scrapy.crawler import CrawlerProcess
from bs4 import BeautifulSoup

class ConjugationSpider(scrapy.Spider):
    name = 'conjugation_spider'
    
    def __init__(self, verbs=None, callback=None, *args, **kwargs):
        super(ConjugationSpider, self).__init__(*args, **kwargs)
        self.verbs = verbs or []
        self.results = {}
        self.callback = callback
    
    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(ConjugationSpider, cls).from_crawler(crawler, *args, **kwargs)
        # Register the closed callback if provided
        if hasattr(spider, 'callback') and spider.callback:
            crawler.signals.connect(spider.callback, signal=scrapy.signals.spider_closed)
        return spider
        
    def start_requests(self):
        total_verbs = len(self.verbs)
        for i, verb in enumerate(self.verbs):
            url = f'https://conjugator.reverso.net/conjugation-portuguese-verb-{verb}.html'
            print(f"Processing verb {i+1}/{total_verbs}: {verb}")
            yield scrapy.Request(url=url, callback=self.parse, meta={'verb': verb})
            # Be nice to the server with a small delay
            time.sleep(1)
    
    def parse(self, response):
        verb = response.meta['verb']
        self.log(f"Parsing verb: {verb}")
        
        # Initialize the conjugation data structure
        conjugation_data = {
            'infinitive': verb,
            'tenses': {}
        }
        
        # Save the HTML for inspection
        with open(f"conjugation_data/{verb}_debug.html", "w", encoding="utf-8") as f:
            f.write(response.text)
        
        print(f"Saved HTML for {verb} to conjugation_data/{verb}_debug.html")
        
        # Extract the conjugation tables
        # The main categories (Indicativo, Conjuntivo, etc.)
        for category_section in response.css('div.blue-box-wrap'):
            category_name = category_section.css('h4::text').get()
            if not category_name:
                continue
                
            category_name = category_name.strip()
            print(f"Found category: {category_name}")
            conjugation_data['tenses'][category_name] = {}
            
            # Find all tense blocks within this category
            for tense_block in category_section.css('div.wrap-three-col, div.wrap-verbs-listing'):
                # Get the tense name
                tense_title = tense_block.css('span.tense-title::text').get()
                if not tense_title:
                    continue
                    
                tense_title = tense_title.strip()
                print(f"  Found tense: {tense_title}")
                conjugation_data['tenses'][category_name][tense_title] = {}
                
                # Get all conjugation items
                for item in tense_block.css('li'):
                    # The person is in an <i> tag and the conjugation is in a <b> tag
                    person_text = item.css('i::text').get()
                    conjugation_text = item.css('b::text').get()
                    
                    if person_text and conjugation_text:
                        person = person_text.strip().rstrip(':')
                        conjugation = conjugation_text.strip()
                        
                        print(f"    Found conjugation: {person} -> {conjugation}")
                        conjugation_data['tenses'][category_name][tense_title][person] = conjugation
        
        # Store the result
        self.results[verb] = conjugation_data
        
def scrape_conjugations(verb_list_path, output_path):
    """
    Scrape conjugation data for verbs in the provided list and save as JSON.
    
    Args:
        verb_list_path: Path to the text file containing verbs (one per line)
        output_path: Path where the JSON output will be saved
    """
    # Read the verb list
    with open(verb_list_path, 'r', encoding='utf-8') as f:
        verbs = [line.strip() for line in f if line.strip()]
    
    # Set up the crawler
    process = CrawlerProcess(settings={
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'LOG_LEVEL': 'WARNING',  # Reduce log noise to make progress more visible
    })
    
    print(f"Starting to scrape conjugation data for {len(verbs)} verbs...")
    
    # Create a container for results
    results = {}
    
    # Define a spider closed callback to save results
    def spider_closed(spider):
        results.update(spider.results)
        # Save the results to a JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"\nCompleted! Conjugation data for {len(results)} verbs saved to {output_path}")
    
    # Run the spider
    process.crawl(ConjugationSpider, verbs=verbs, callback=spider_closed)
    process.start()

if __name__ == "__main__":
    # Ensure the output directory exists
    output_dir = Path("conjugation_data")
    output_dir.mkdir(exist_ok=True)
    
    # Define paths
    verb_list_path = "conjugation_data/verbs_top_250.txt"
    output_path = "conjugation_data/conjugations.json"
    
    # For debugging, let's create a test with just a few verbs
    test_mode = True
    if test_mode:
        # Create a temporary file with just a few verbs for testing
        test_verbs = ["ser", "ter", "ir"]
        test_verb_path = "conjugation_data/test_verbs.txt"
        with open(test_verb_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(test_verbs))
        
        # Ensure the debug directory exists
        debug_dir = Path("conjugation_data/debug")
        debug_dir.mkdir(exist_ok=True)
        
        # Run the scraper with the test verbs
        print("RUNNING IN TEST MODE with verbs:", test_verbs)
        scrape_conjugations(test_verb_path, "conjugation_data/test_conjugations.json")
    else:
        # Run the scraper with all verbs
        scrape_conjugations(verb_list_path, output_path)
