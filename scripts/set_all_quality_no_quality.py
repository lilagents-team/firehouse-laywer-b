#!/usr/bin/env python3

import os
import re

def set_all_metadata_quality_to_no_quality():
    """Set all newsletter markdown files' metadata_quality field to 'No Quality'."""
    
    newsletters_dir = "content/newsletters"
    
    if not os.path.exists(newsletters_dir):
        print(f"Error: Directory {newsletters_dir} not found")
        return
    
    # Get all markdown files
    md_files = [f for f in os.listdir(newsletters_dir) if f.endswith('.md')]
    
    updated_count = 0
    added_count = 0
    skipped_count = 0
    
    print(f"Processing {len(md_files)} markdown files...")
    print()
    
    for filename in md_files:
        filepath = os.path.join(newsletters_dir, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if file has frontmatter
            if not content.startswith('---'):
                print(f"Skipping {filename}: No frontmatter found")
                skipped_count += 1
                continue
            
            # Split content into frontmatter and body
            parts = content.split('---', 2)
            if len(parts) < 3:
                print(f"Skipping {filename}: Invalid frontmatter structure")
                skipped_count += 1
                continue
            
            frontmatter = parts[1]
            body = parts[2]
            
            # Check if metadata_quality already exists
            if re.search(r'^metadata_quality:', frontmatter, re.MULTILINE):
                # Replace existing metadata_quality
                new_frontmatter = re.sub(
                    r'^metadata_quality:.*$', 
                    'metadata_quality: "No Quality"', 
                    frontmatter, 
                    flags=re.MULTILINE
                )
                print(f"Updated {filename}: Changed existing metadata_quality")
                updated_count += 1
            else:
                # Add metadata_quality field before the closing ---
                new_frontmatter = frontmatter.rstrip() + '\nmetadata_quality: "No Quality"\n'
                print(f"Updated {filename}: Added metadata_quality field")
                added_count += 1
            
            # Reconstruct the file
            new_content = f"---{new_frontmatter}---{body}"
            
            # Write back to file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            continue
    
    print()
    print("SUMMARY:")
    print(f"Total files processed: {len(md_files)}")
    print(f"Files updated (existing field): {updated_count}")
    print(f"Files updated (added field): {added_count}")
    print(f"Files skipped: {skipped_count}")
    print(f"Total successful updates: {updated_count + added_count}")

if __name__ == "__main__":
    set_all_metadata_quality_to_no_quality()