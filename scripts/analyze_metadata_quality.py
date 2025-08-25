#!/usr/bin/env python3

import json
import os
from collections import Counter

def analyze_metadata_quality():
    """Analyze metadata_quality field values and distribution across newsletter files."""
    
    # Directory containing newsletter JSON files
    newsletter_dir = "client/public/api/newsletters"
    
    if not os.path.exists(newsletter_dir):
        print(f"Error: Directory {newsletter_dir} not found")
        return
    
    files = [f for f in os.listdir(newsletter_dir) if f.endswith('.json') and f != 'index.json']
    
    quality_values = []
    sample_files_by_quality = {}
    
    print("METADATA_QUALITY ANALYSIS:")
    print("=" * 50)
    
    for filename in files:
        filepath = os.path.join(newsletter_dir, filename)
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                
            if 'metadata_quality' in data and data['metadata_quality']:
                quality = data['metadata_quality']
                quality_values.append(quality)
                
                # Store sample files for each quality level
                if quality not in sample_files_by_quality:
                    sample_files_by_quality[quality] = []
                if len(sample_files_by_quality[quality]) < 3:
                    sample_files_by_quality[quality].append(filename)
                    
        except Exception as e:
            print(f"Error processing {filename}: {e}")
    
    # Count occurrences
    quality_counts = Counter(quality_values)
    total_with_quality = len(quality_values)
    total_files = len(files)
    
    print(f"Total files analyzed: {total_files}")
    print(f"Total files with metadata_quality field: {total_with_quality}")
    print(f"Files without metadata_quality: {total_files - total_with_quality}")
    print()
    
    if total_with_quality > 0:
        print("QUALITY DISTRIBUTION:")
        print("-" * 30)
        for quality, count in quality_counts.most_common():
            percentage = (count / total_with_quality) * 100
            overall_percentage = (count / total_files) * 100
            print(f"{quality:>10}: {count:>3} files ({percentage:>5.1f}% of quality files, {overall_percentage:>4.1f}% overall)")
            
            # Show sample files
            samples = sample_files_by_quality.get(quality, [])
            print(f"            Examples: {', '.join(samples[:2])}")
            print()
    
    print("QUALITY BADGE COLORS IN UI:")
    print("-" * 30)
    print("high   -> default (green/blue)")
    print("medium -> secondary (gray)")
    print("low    -> destructive (red)")
    print()
    
    # Additional analysis: Check what other metadata fields correlate with quality
    print("QUALITY vs OTHER FIELDS:")
    print("-" * 30)
    
    field_presence_by_quality = {}
    
    for filename in files:
        filepath = os.path.join(newsletter_dir, filename)
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                
            quality = data.get('metadata_quality', 'no_quality')
            if quality not in field_presence_by_quality:
                field_presence_by_quality[quality] = {'legal_cases': 0, 'legal_statutes': 0, 'categories': 0, 'total': 0}
            
            field_presence_by_quality[quality]['total'] += 1
            
            if data.get('legal_cases') and len(data['legal_cases']) > 0:
                field_presence_by_quality[quality]['legal_cases'] += 1
            if data.get('legal_statutes') and len(data['legal_statutes']) > 0:
                field_presence_by_quality[quality]['legal_statutes'] += 1
            if data.get('categories') and len(data['categories']) > 0:
                field_presence_by_quality[quality]['categories'] += 1
                
        except Exception as e:
            continue
    
    for quality, stats in field_presence_by_quality.items():
        if stats['total'] > 0:
            legal_cases_pct = (stats['legal_cases'] / stats['total']) * 100
            legal_statutes_pct = (stats['legal_statutes'] / stats['total']) * 100
            categories_pct = (stats['categories'] / stats['total']) * 100
            
            print(f"{quality:>12} ({stats['total']:>3} files):")
            print(f"             Legal Cases:   {legal_cases_pct:>5.1f}%")
            print(f"             Legal Statutes: {legal_statutes_pct:>5.1f}%")
            print(f"             Categories:     {categories_pct:>5.1f}%")
            print()

if __name__ == "__main__":
    analyze_metadata_quality()