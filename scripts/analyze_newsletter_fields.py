#!/usr/bin/env python3

import json
import os
from collections import defaultdict

def analyze_newsletter_fields():
    """Analyze field coverage across all newsletter JSON files."""
    
    # Directory containing newsletter JSON files
    newsletter_dir = "client/public/api/newsletters"
    
    if not os.path.exists(newsletter_dir):
        print(f"Error: Directory {newsletter_dir} not found")
        return
    
    # Skip the index file and only process individual newsletters
    files = [f for f in os.listdir(newsletter_dir) if f.endswith('.json') and f != 'index.json']
    
    field_counts = defaultdict(int)
    total_files = len(files)
    non_empty_field_counts = defaultdict(int)
    field_examples = defaultdict(list)
    
    print(f"Analyzing {total_files} newsletter JSON files...")
    print()
    
    for filename in files:
        filepath = os.path.join(newsletter_dir, filename)
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                
            for field, value in data.items():
                field_counts[field] += 1
                
                # Check if field has meaningful content (not empty/null)
                if value and value != [] and value != '' and value != 0:
                    non_empty_field_counts[field] += 1
                    
                    # Store examples for display
                    if len(field_examples[field]) < 3:
                        if isinstance(value, list):
                            if value:  # non-empty list
                                field_examples[field].append(f"[{len(value)} items: {value[0]}...]" if len(value) > 1 else f"[{value[0]}]")
                        elif isinstance(value, str):
                            field_examples[field].append(f'"{value[:50]}..."' if len(value) > 50 else f'"{value}"')
                        else:
                            field_examples[field].append(str(value))
                            
        except Exception as e:
            print(f"Error processing {filename}: {e}")
    
    # Sort by presence percentage
    sorted_fields = sorted(field_counts.items(), key=lambda x: x[1], reverse=True)
    
    print("FIELD ANALYSIS:")
    print("=" * 90)
    print(f"{'Field Name':<20} {'Present':<8} {'Non-Empty':<10} {'%Present':<9} {'%Populated':<12} {'Examples'}")
    print("-" * 90)
    
    for field, count in sorted_fields:
        present_pct = (count / total_files) * 100
        populated_pct = (non_empty_field_counts[field] / total_files) * 100
        examples = " | ".join(field_examples[field][:2])
        
        print(f"{field:<20} {count:<8} {non_empty_field_counts[field]:<10} {present_pct:<8.1f}% {populated_pct:<11.1f}% {examples[:60]}")
    
    print()
    print("SUMMARY:")
    print(f"Total files analyzed: {total_files}")
    print(f"Files ending in '-extracted.json': {len([f for f in files if f.endswith('-extracted.json')])}")
    print(f"Regular newsletter files: {len([f for f in files if not f.endswith('-extracted.json')])}")
    
    # Analyze file types
    print()
    print("FILE TYPE BREAKDOWN:")
    print("-" * 40)
    extracted_files = [f for f in files if f.endswith('-extracted.json')]
    regular_files = [f for f in files if not f.endswith('-extracted.json')]
    
    print(f"Regular newsletters:     {len(regular_files)} files")
    print(f"Extracted content files: {len(extracted_files)} files")
    
    # Find fields that exist in regular files vs extracted files
    regular_fields = set()
    extracted_fields = set()
    
    for filename in regular_files[:10]:  # Sample first 10
        filepath = os.path.join(newsletter_dir, filename)
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                regular_fields.update(data.keys())
        except:
            pass
    
    for filename in extracted_files[:10]:  # Sample first 10
        filepath = os.path.join(newsletter_dir, filename)
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                extracted_fields.update(data.keys())
        except:
            pass
    
    print()
    print("FIELD DIFFERENCES:")
    print("-" * 40)
    regular_only = regular_fields - extracted_fields
    extracted_only = extracted_fields - regular_fields
    shared_fields = regular_fields & extracted_fields
    
    print(f"Fields only in regular files: {', '.join(sorted(regular_only))}")
    print(f"Fields only in extracted files: {', '.join(sorted(extracted_only))}")
    print(f"Shared fields: {len(shared_fields)} fields")

if __name__ == "__main__":
    analyze_newsletter_fields()