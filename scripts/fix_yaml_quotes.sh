#!/bin/bash

# Fix YAML Quote Parsing Errors in Newsletter Files
# This script fixes missing closing quotes in newsletter frontmatter that prevent Sveltia CMS from parsing files

NEWSLETTER_DIR="/code/lilagents/firehouse-laywer-b/content/newsletters"

echo "🔧 Fixing YAML quote parsing errors in newsletter files..."
echo "Working directory: $NEWSLETTER_DIR"
echo

# Counter for fixes applied
fixes_applied=0

# Files with known YAML parsing errors (from Sveltia CMS error log)
error_files=(
    "June2018FINAL.md"
    "June2016FINAL.md"
    "v03n10oct1999.md" 
    "March2025FINAL (2).md"
    "November2016FINAL.md"
    "August2016.md"
    "October2017FINAL5.md"
    "March2023FINALwDEI.md"
    "v05n05may2005.md"
    "May2016FINAL.md"
    "v12n02jun2014.md"
    "v02n09sep1998.md"
    "August2022FINAL.md"
    "v02n06jun1998.md"
    "March2021FINAL.md"
    "July2022FINAL.md"
    "June2022FINAL.md"
    "August2017FINAL.md"
    "April2016FINAL.md"
    "January2018FINAL.md"
    "v01n03jun1997.md"
    "v05n04apr2005.md"
    "July_2015_FINAL_2.md"
    "v05n01jan2005.md"
    "March2024FINAL.md"
    "v03n08aug1999.md"
    "September2015_ThidDraft.md"
    "October2015_FINAL .md"
    "v03n11nov1999.md"
    "July2024FINAL.md"
    "AugustSeptember2021FINAL.md"
    "June2023FINAL.md"
    "2016SeptemberFINAL.md"
    "July2021FINAL.md"
    "June2019FINAL.md"
    "September2022FINAL (2).md"
    "May2019FINAL.md"
    "May2017FINAL.md"
    "March2020FINAL.md"
    "v03n04apr1999.md"
    "v01n02may1997.md"
    "April2025FINAL2.md"
    "November2015FINAL.md"
    "August2024FINAL.md"
    "v05n06jun2005.md"
    "April2022FINAL.md"
    "August_2015.md"
)

cd "$NEWSLETTER_DIR" || exit 1

# Function to fix missing quotes in a specific field
fix_missing_quotes() {
    local file="$1"
    local field="$2"
    
    if [[ ! -f "$file" ]]; then
        echo "⚠️  File not found: $file"
        return 1
    fi
    
    # Check if file has the problematic pattern: field: "text without closing quote
    if grep -q "^${field}: \"[^\"]*$" "$file"; then
        echo "🔧 Fixing missing closing quote in $field for: $file"
        
        # Use sed to add missing closing quote at end of line
        sed -i "s/^${field}: \"\([^\"]*\)$/${field}: \"\1\"/" "$file"
        
        fixes_applied=$((fixes_applied + 1))
        return 0
    fi
    
    return 1
}

# Function to fix frontmatter structure issues
fix_frontmatter_structure() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        return 1
    fi
    
    # Check for the specific v12n02jun2014.md issue: missing closing ---
    if [[ "$file" == "v12n02jun2014.md" ]]; then
        if grep -q "layout: newsletter" "$file" && ! grep -q "^---$" "$file" | tail -1; then
            echo "🔧 Fixing frontmatter structure for: $file"
            
            # Find the line with "layout: newsletter" and ensure proper YAML closing
            sed -i '/^layout: newsletter$/a---' "$file"
            
            fixes_applied=$((fixes_applied + 1))
            return 0
        fi
    fi
    
    return 1
}

echo "Processing ${#error_files[@]} files with known YAML errors..."
echo

for file in "${error_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "📄 Processing: $file"
        
        # Try to fix various field quote issues
        fix_missing_quotes "$file" "search_keywords"
        fix_missing_quotes "$file" "keywords"
        fix_missing_quotes "$file" "title" 
        fix_missing_quotes "$file" "summary"
        
        # Fix structural issues
        fix_frontmatter_structure "$file"
        
    else
        echo "⚠️  File not found: $file"
    fi
done

echo
echo "📊 Summary:"
echo "   🔧 Total fixes applied: $fixes_applied"
echo "   📁 Working directory: $NEWSLETTER_DIR"
echo

if [[ $fixes_applied -gt 0 ]]; then
    echo "✅ YAML quote fixes completed successfully!"
    echo "   The Sveltia CMS should now be able to parse these files without errors."
    echo
    echo "🧪 Next steps:"
    echo "   1. Test the Sveltia CMS interface at http://localhost:5000/admin/index.html" 
    echo "   2. Verify that newsletter files load without parsing errors"
    echo "   3. Check that all newsletter files are now accessible in the CMS"
else
    echo "ℹ️  No fixes were needed - files may already be corrected."
fi

echo
echo "Script completed."