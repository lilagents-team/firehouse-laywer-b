#!/usr/bin/env python3

"""
Newsletter Title Analysis Script
Analyzes newsletter titles to find common substrings and identify newsletters needing better titles.
"""

import os
import re
from collections import Counter, defaultdict

def extract_titles_from_newsletters(newsletter_dir):
    """Extract all titles from newsletter markdown files."""
    titles = []
    file_title_map = {}
    
    for filename in os.listdir(newsletter_dir):
        if filename.endswith('.md'):
            filepath = os.path.join(newsletter_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Extract frontmatter title
                    title_match = re.search(r'^title:\s*["\']?([^"\'\n]+)["\']?', 
                                          content, re.MULTILINE)
                    
                    if title_match:
                        title = title_match.group(1).strip()
                        titles.append(title)
                        file_title_map[filename] = title
            except Exception as e:
                print(f"Warning: Could not process {filename}: {e}")
    
    return titles, file_title_map

def find_common_substrings(titles, min_length=3, min_frequency=3):
    """Find common substrings across titles."""
    substring_counts = Counter()
    substring_files = defaultdict(list)
    
    # Whitelisted words that should not count as problematic
    whitelisted_words = {'and', 'or', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'legal'}
    
    # Generate all substrings of sufficient length
    for i, title in enumerate(titles):
        title_clean = title.lower().strip()
        words = title_clean.split()
        
        # Generate word-based substrings
        for start in range(len(words)):
            for end in range(start + 1, len(words) + 1):
                if end - start >= 1:  # At least 1 word
                    substring = ' '.join(words[start:end])
                    # Skip whitelisted single words
                    if len(substring) >= min_length and substring not in whitelisted_words:
                        substring_counts[substring] += 1
                        substring_files[substring].append((i, title))
    
    # Filter by minimum frequency
    common_substrings = {k: v for k, v in substring_counts.items() 
                        if v >= min_frequency}
    
    return common_substrings, substring_files

def identify_generic_titles(titles, file_title_map, common_substrings, substring_files):
    """Identify newsletters with generic titles that should be renamed."""
    
    # Blacklisted terms that automatically flag titles for regeneration
    blacklisted_terms = [
        'firehouse',
        'legal updates',
        'newsletter',
        'volume',
        'number',
        'updates',
        'joseph f. quin',
        'inside this issue',
        'laborhous',
        'Legal Updates'
    ]
    
    # Define problematic patterns
    problematic_patterns = [
        r'firehouse lawyer',
        r'fire.*lawyer',
        r'legal updates',
        r'newsletter',
        r'volume \d+',
        r'number \d+',
        r'vol\.?\s*\d+',
        r'no\.?\s*\d+',
        r'eric t\.? quinn',
        r'joseph f\.? quinn',
        r'editor'
    ]
    
    generic_titles = []
    
    for filename, title in file_title_map.items():
        title_lower = title.lower()
        
        # Check for blacklisted terms - automatic flagging
        blacklisted = False
        for term in blacklisted_terms:
            if term in title_lower:
                blacklisted = True
                break
        
        # Check if title is mostly generic publication info
        generic_score = 0
        total_words = len(title.split())
        
        for pattern in problematic_patterns:
            matches = re.findall(pattern, title_lower)
            generic_score += len(' '.join(matches).split()) if matches else 0
        
        # Calculate ratio of generic words to total words
        generic_ratio = generic_score / max(total_words, 1)
        
        # Flag if blacklisted OR more than 50% generic OR if title is very short and generic
        if blacklisted or generic_ratio > 0.5 or (total_words <= 4 and generic_score > 0):
            generic_titles.append({
                'filename': filename,
                'title': title,
                'generic_ratio': generic_ratio,
                'total_words': total_words,
                'generic_score': generic_score,
                'blacklisted': blacklisted
            })
    
    return sorted(generic_titles, key=lambda x: x['generic_ratio'], reverse=True)

def create_histogram_report(common_substrings, substring_files, generic_titles, file_title_map):
    """Create a detailed histogram report."""
    
    print("=" * 80)
    print("NEWSLETTER TITLE ANALYSIS REPORT")
    print("=" * 80)
    print()
    
    # Top common substrings
    print("📊 MOST COMMON TITLE SUBSTRINGS:")
    print("-" * 40)
    
    # Sort by frequency
    sorted_substrings = sorted(common_substrings.items(), 
                             key=lambda x: x[1], reverse=True)
    
    for substring, count in sorted_substrings[:20]:
        print(f"{count:3d} files: '{substring}'")
    
    print()
    
    # Histogram of problematic patterns
    print("📈 HISTOGRAM OF PROBLEMATIC PATTERNS:")
    print("-" * 40)
    
    pattern_counts = Counter()
    pattern_examples = defaultdict(list)
    
    for item in generic_titles:
        title = item['title'].lower()
        
        if 'firehouse lawyer' in title:
            pattern_counts['Firehouse Lawyer'] += 1
            pattern_examples['Firehouse Lawyer'].append(item)
        elif 'legal updates' in title:
            pattern_counts['Legal Updates'] += 1
            pattern_examples['Legal Updates'].append(item)
        elif re.search(r'volume \d+', title):
            pattern_counts['Volume Numbers Only'] += 1
            pattern_examples['Volume Numbers Only'].append(item)
        elif 'newsletter' in title:
            pattern_counts['Newsletter Generic'] += 1
            pattern_examples['Newsletter Generic'].append(item)
        elif re.search(r'(eric|joseph).*quinn', title):
            pattern_counts['Author Names'] += 1
            pattern_examples['Author Names'].append(item)
        else:
            pattern_counts['Other Generic'] += 1
            pattern_examples['Other Generic'].append(item)
    
    # Display histogram
    for pattern, count in pattern_counts.most_common():
        print(f"{count:3d} files: {pattern}")
        
        # Show worst examples
        examples = sorted(pattern_examples[pattern], 
                         key=lambda x: x['generic_ratio'], reverse=True)[:3]
        for ex in examples:
            print(f"     - {ex['filename']}: '{ex['title']}'")
        print()
    
    # Detailed list of newsletters needing new titles
    print("🎯 NEWSLETTERS REQUIRING NEW TITLES (High Priority):")
    print("-" * 50)
    
    high_priority = [item for item in generic_titles 
                    if item['generic_ratio'] > 0.6]
    
    for i, item in enumerate(high_priority[:30], 1):
        ratio_pct = int(item['generic_ratio'] * 100)
        print(f"{i:2d}. {item['filename']}")
        print(f"    Title: '{item['title']}'")
        print(f"    Generic ratio: {ratio_pct}% ({item['generic_score']}/{item['total_words']} words)")
        print()
    
    print(f"📋 SUMMARY:")
    print(f"   • Total newsletters analyzed: {len(file_title_map)}")
    print(f"   • Newsletters with generic titles: {len(generic_titles)}")
    print(f"   • High priority for renaming: {len(high_priority)}")
    print(f"   • Most common substring: '{sorted_substrings[0][0]}' ({sorted_substrings[0][1]} files)")

def main():
    newsletter_dir = "/code/lilagents/firehouse-laywer-b/content/newsletters"
    
    if not os.path.exists(newsletter_dir):
        print(f"Error: Newsletter directory not found: {newsletter_dir}")
        return
    
    # Extract titles
    print("📖 Reading newsletter titles...")
    titles, file_title_map = extract_titles_from_newsletters(newsletter_dir)
    print(f"   Found {len(titles)} newsletter titles")
    
    # Find common substrings
    print("🔍 Analyzing common substrings...")
    common_substrings, substring_files = find_common_substrings(titles)
    
    # Identify generic titles
    print("🎯 Identifying generic titles...")
    generic_titles = identify_generic_titles(titles, file_title_map, 
                                           common_substrings, substring_files)
    
    # Generate report
    create_histogram_report(common_substrings, substring_files, generic_titles, file_title_map)
    
    # Save problematic files to a list
    output_file = "/tmp/newsletters_needing_titles.txt"
    with open(output_file, 'w') as f:
        f.write("# Newsletters Requiring New Titles\n\n")
        for item in generic_titles:
            f.write(f"File: {item['filename']}\n")
            f.write(f"Current Title: {item['title']}\n")
            f.write(f"Generic Ratio: {int(item['generic_ratio'] * 100)}%\n")
            f.write("\n")
    
    print(f"\n📄 Detailed list saved to: {output_file}")

if __name__ == "__main__":
    main()