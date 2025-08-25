#!/usr/bin/env python3

import os
import re

def fix_quality_ratings():
    """Fix newsletter markdown files to use single-word quality ratings."""
    
    newsletters_dir = "content/newsletters"
    
    if not os.path.exists(newsletters_dir):
        print(f"Error: Directory {newsletters_dir} not found")
        return
    
    # Get all markdown files
    md_files = [f for f in os.listdir(newsletters_dir) if f.endswith('.md')]
    
    updated_count = 0
    
    print(f"Processing {len(md_files)} markdown files...")
    print()
    
    for filename in md_files:
        filepath = os.path.join(newsletters_dir, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if file has frontmatter
            if not content.startswith('---'):
                continue
            
            # Split content into frontmatter and body
            parts = content.split('---', 2)
            if len(parts) < 3:
                continue
            
            frontmatter = parts[1]
            body = parts[2]
            
            # Fix quality ratings
            original_frontmatter = frontmatter
            
            # Replace variations with single words
            frontmatter = re.sub(r'metadata_quality:\s*["\']?high quality["\']?', 'metadata_quality: "high"', frontmatter)
            frontmatter = re.sub(r'metadata_quality:\s*["\']?medium quality["\']?', 'metadata_quality: "medium"', frontmatter)
            frontmatter = re.sub(r'metadata_quality:\s*["\']?low quality["\']?', 'metadata_quality: "low"', frontmatter)
            
            # Check if we made changes
            if frontmatter != original_frontmatter:
                # Reconstruct the file
                new_content = f"---{frontmatter}---{body}"
                
                # Write back to file
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"Updated {filename}: Fixed quality rating")
                updated_count += 1
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            continue
    
    print()
    print("SUMMARY:")
    print(f"Total files processed: {len(md_files)}")
    print(f"Files updated: {updated_count}")

if __name__ == "__main__":
    fix_quality_ratings()