#!/usr/bin/env python3
"""
Simple script to validate that newsletter markdown files have summary fields.
"""
import os
import re
from pathlib import Path

def count_summary_fields():
    newsletter_dir = Path("content/newsletters")
    
    total_files = 0
    files_with_summary = 0
    missing_summary_files = []
    
    # Get all .md files in the newsletters directory
    for md_file in newsletter_dir.glob("*.md"):
        total_files += 1
        
        try:
            content = md_file.read_text(encoding='utf-8')
            
            # Check if file has a summary field in the front matter
            if re.search(r'^summary:\s*["\'].*["\']', content, re.MULTILINE):
                files_with_summary += 1
            else:
                missing_summary_files.append(md_file.name)
                
        except Exception as e:
            print(f"Error reading {md_file}: {e}")
    
    # Calculate compliance rate
    compliance_rate = (files_with_summary / total_files * 100) if total_files > 0 else 0
    
    print(f"Newsletter Summary Field Validation Report")
    print(f"=" * 50)
    print(f"Total newsletter files: {total_files}")
    print(f"Files with summary field: {files_with_summary}")
    print(f"Files missing summary field: {len(missing_summary_files)}")
    print(f"Compliance rate: {compliance_rate:.1f}%")
    
    if missing_summary_files:
        print(f"\nFiles missing summary field ({len(missing_summary_files)}):")
        for filename in sorted(missing_summary_files)[:10]:  # Show first 10
            print(f"  - {filename}")
        if len(missing_summary_files) > 10:
            print(f"  ... and {len(missing_summary_files) - 10} more files")
    
    return {
        'total': total_files,
        'with_summary': files_with_summary,
        'missing_summary': len(missing_summary_files),
        'compliance_rate': compliance_rate,
        'missing_files': missing_summary_files[:10]  # Return first 10
    }

if __name__ == "__main__":
    count_summary_fields()