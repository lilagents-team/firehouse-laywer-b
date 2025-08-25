#!/usr/bin/env python3
"""
Quick batch YAML fix script for remaining newsletter files
"""
import re
import os

# Files and their approximate problematic search_keywords sections
files_to_fix = {
    "2016SeptemberFINAL.md": {
        "find": r'search_keywords: "Volume 14, Number Nine"[^"]*',
        "replace": 'search_keywords: "Volume 14 Number Nine, September 2016 legal updates, fire department regulations, public agency law"'
    },
    "June2023FINAL.md": {
        "find": r'search_keywords: "Volume 21, Number 6"[^"]*',
        "replace": 'search_keywords: "Volume 21 Number 6, June 2023 legal updates, fire department compliance, public safety regulations"'
    },
    "July2021FINAL.md": {
        "find": r'search_keywords: "Firehouse Lawyer Newsletter Volume 19, Number 7 - Power and Security"[^"]*',
        "replace": 'search_keywords: "Firehouse Lawyer Newsletter Volume 19 Number 7, Power and Security, July 2021 legal updates"'
    },
    "November2015FINAL.md": {
        "find": r'search_keywords: "The Public Duty Doctrine and Marijuana"[^"]*',
        "replace": 'search_keywords: "The Public Duty Doctrine and Marijuana, November 2015 legal updates, fire department policies"'
    },
    "September2022FINAL (2).md": {
        "find": r'search_keywords: "Firehousel[^"]*Eric T\. Quinn, Editor"',
        "replace": 'search_keywords: "Firehouse Lawyer September 2022 Volume 20 Number 9, firehouselawyer.com, public agencies, Eric T. Quinn Editor"'
    },
    "v03n04apr1999.md": {
        "find": r'search_keywords: "Vol\. 3, No\. 4 Joseph F\. Quinn"[^"]*',
        "replace": 'search_keywords: "Vol. 3, No. 4, Joseph F. Quinn, April 1999 legal updates, fire department regulations"'
    }
}

content_dir = "/code/lilagents/firehouse-laywer-b/content/newsletters/"

for filename, fix_info in files_to_fix.items():
    filepath = os.path.join(content_dir, filename)
    
    if os.path.exists(filepath):
        print(f"Processing {filename}...")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Apply the fix using regex replacement
        updated_content = re.sub(fix_info["find"], fix_info["replace"], content, flags=re.MULTILINE | re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"Fixed {filename}")
    else:
        print(f"File not found: {filename}")

print("Batch YAML fixes completed!")