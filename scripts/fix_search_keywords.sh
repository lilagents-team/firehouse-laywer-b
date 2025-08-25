#!/bin/bash

# Script to fix malformed search_keywords fields in newsletter YAML frontmatter

NEWSLETTERS_DIR="/code/lilagents/firehouse-laywer-b/content/newsletters"
COUNTER=0

echo "Starting YAML search_keywords fixes..."

# Find all files with malformed search_keywords (unclosed quotes)
find "$NEWSLETTERS_DIR" -name "*.md" -exec grep -l "search_keywords:.*\"[^\"]*$" {} \; | while read file; do
    echo "Processing: $file"
    
    # Create a temporary file
    TEMP_FILE=$(mktemp)
    
    # Process the file to fix search_keywords
    awk '
        BEGIN { in_frontmatter = 0; in_search_keywords = 0; }
        
        # Detect start of frontmatter
        /^---$/ { 
            if (in_frontmatter == 0) {
                in_frontmatter = 1
                print $0
                next
            } else {
                # End of frontmatter
                in_frontmatter = 0
                in_search_keywords = 0
                print $0
                next
            }
        }
        
        # If we are in frontmatter
        in_frontmatter == 1 {
            # Check if line starts with search_keywords and has unclosed quote
            if (/^search_keywords: *"[^"]*$/) {
                # Start collecting search keywords content
                in_search_keywords = 1
                search_content = $0
                gsub(/^search_keywords: *"/, "", search_content)
                gsub(/\.\.\.$/, "", search_content)  # Remove trailing ...
                next
            }
            
            # If we are collecting search_keywords content
            if (in_search_keywords == 1) {
                # If this line looks like another YAML field, finish search_keywords
                if (/^[a-z_]+: /) {
                    # Output the fixed search_keywords line
                    printf "search_keywords: \"%s\"\n", search_content
                    in_search_keywords = 0
                    print $0
                    next
                }
                
                # Otherwise, append to search content (clean up the text)
                line = $0
                gsub(/^ */, "", line)  # Remove leading spaces
                gsub(/\.\.\.$/, "", line)  # Remove trailing ...
                if (line != "") {
                    if (search_content != "") {
                        search_content = search_content ", " line
                    } else {
                        search_content = line
                    }
                }
                next
            }
            
            # Regular frontmatter line
            print $0
        }
        
        # Outside frontmatter
        in_frontmatter == 0 {
            # If we were in search_keywords when frontmatter ended, fix it
            if (in_search_keywords == 1) {
                printf "search_keywords: \"%s\"\n", search_content
                print "---"
                in_search_keywords = 0
            }
            print $0
        }
    ' "$file" > "$TEMP_FILE"
    
    # Replace the original file
    mv "$TEMP_FILE" "$file"
    
    COUNTER=$((COUNTER + 1))
    echo "Fixed: $file (Count: $COUNTER)"
done

echo "Completed fixing search_keywords in $COUNTER files."