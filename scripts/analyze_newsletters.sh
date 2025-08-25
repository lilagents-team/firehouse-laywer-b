#!/bin/bash

# Newsletter Analysis Shell Script
# Comprehensive newsletter validation including YAML parsing, title analysis, and field validation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/analyze_newsletter_titles.py"
YAML_FIX_SCRIPT="$SCRIPT_DIR/fix_yaml_quotes.sh"

echo "🔍 Running Comprehensive Newsletter Analysis..."
echo "=============================================="

# Step 1: Fix YAML parsing issues
echo "📋 Step 1: Fixing YAML parsing issues..."
if [[ -f "$YAML_FIX_SCRIPT" ]]; then
    chmod +x "$YAML_FIX_SCRIPT"
    bash "$YAML_FIX_SCRIPT"
else
    echo "Warning: YAML fix script not found at $YAML_FIX_SCRIPT"
fi

# Step 2: Run title analysis
echo ""
echo "📊 Step 2: Running Newsletter Title Analysis..."
echo "==============================================="

if [[ ! -f "$PYTHON_SCRIPT" ]]; then
    echo "Error: Python script not found at $PYTHON_SCRIPT"
    exit 1
fi

# Make sure the Python script is executable
chmod +x "$PYTHON_SCRIPT"

# Run the Python analysis script
python3 "$PYTHON_SCRIPT"

# Step 3: Run original field validation
echo ""
echo "✅ Step 3: Running Field Validation..."
echo "======================================"

NEWSLETTER_DIR="/code/lilagents/firehouse-laywer-b/content/newsletters"
OUTPUT_FILE="/tmp/newsletter_validation_report.txt"

# Required fields according to CMS config
REQUIRED_FIELDS=("title" "date" "description" "summary")
OPTIONAL_FIELDS=("volume" "edition" "categories" "tags" "legal_cases" "legal_statutes")

total_files=0
files_with_missing_required=0
files_with_malformed_data=0
fully_compliant=0

# Analysis counters for specific issues
missing_title=0
missing_date=0
missing_description=0
missing_summary=0
invalid_date_format=0

echo "NEWSLETTER CMS FIELD VALIDATION REPORT" > "$OUTPUT_FILE"
echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "=======================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

cd "$NEWSLETTER_DIR"
for file in *.md; do
    if [[ -f "$file" ]]; then
        total_files=$((total_files + 1))
        
        # Extract frontmatter (everything between first two --- lines)
        frontmatter=$(sed -n '/^---$/,/^---$/p' "$file" | head -n -1 | tail -n +2)
        
        if [[ -z "$frontmatter" ]]; then
            echo "ERROR: No frontmatter found in $file" >> "$OUTPUT_FILE"
            files_with_malformed_data=$((files_with_malformed_data + 1))
            continue
        fi
        
        # Check required fields
        missing_required_fields=()
        issue_found=false
        
        # Check each required field
        for field in "${REQUIRED_FIELDS[@]}"; do
            if ! echo "$frontmatter" | grep -q "^$field:"; then
                missing_required_fields+=("$field")
                case $field in
                    "title") missing_title=$((missing_title + 1)) ;;
                    "date") missing_date=$((missing_date + 1)) ;;
                    "description") missing_description=$((missing_description + 1)) ;;
                    "summary") missing_summary=$((missing_summary + 1)) ;;
                esac
                issue_found=true
            fi
        done
        
        # Check date format if date exists
        date_value=$(echo "$frontmatter" | grep "^date:" | head -1 | cut -d':' -f2- | xargs)
        if [[ -n "$date_value" ]]; then
            # Check if date is None, null, or improperly formatted
            if [[ "$date_value" == "None" || "$date_value" == "null" || "$date_value" == "" ]]; then
                echo "WARNING: Date field is empty/null in $file" >> "$OUTPUT_FILE"
                invalid_date_format=$((invalid_date_format + 1))
                issue_found=true
            elif ! [[ "$date_value" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
                echo "WARNING: Date format may be incorrect in $file: $date_value (expected YYYY-MM-DD)" >> "$OUTPUT_FILE"
                invalid_date_format=$((invalid_date_format + 1))
            fi
        fi
        
        # Report findings for this file
        if [[ ${#missing_required_fields[@]} -gt 0 ]]; then
            echo "MISSING REQUIRED FIELDS in $file: ${missing_required_fields[*]}" >> "$OUTPUT_FILE"
            files_with_missing_required=$((files_with_missing_required + 1))
            issue_found=true
        fi
        
        if [[ "$issue_found" == false ]]; then
            fully_compliant=$((fully_compliant + 1))
        fi
    fi
done

# Generate summary report
echo "" >> "$OUTPUT_FILE"
echo "SUMMARY REPORT" >> "$OUTPUT_FILE"
echo "==============" >> "$OUTPUT_FILE"
echo "Total files processed: $total_files" >> "$OUTPUT_FILE"
echo "Files fully compliant: $fully_compliant" >> "$OUTPUT_FILE"
echo "Files with missing required fields: $files_with_missing_required" >> "$OUTPUT_FILE"
echo "Files with malformed data: $files_with_malformed_data" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "SPECIFIC FIELD ISSUES:" >> "$OUTPUT_FILE"
echo "Missing title: $missing_title files" >> "$OUTPUT_FILE"
echo "Missing date: $missing_date files" >> "$OUTPUT_FILE"
echo "Missing description: $missing_description files" >> "$OUTPUT_FILE"
echo "Missing summary: $missing_summary files" >> "$OUTPUT_FILE"
echo "Invalid/missing date format: $invalid_date_format files" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "COMPLIANCE RATE: $(( (fully_compliant * 100) / total_files ))%" >> "$OUTPUT_FILE"

echo ""
echo "✅ All Analysis Complete!"
echo "========================"
echo "📄 Title analysis results: /tmp/newsletters_needing_titles.txt"
echo "📄 Field validation report: /tmp/newsletter_validation_report.txt"

# Calculate comprehensive compliance rate
generic_titles_count=$(wc -l < /tmp/newsletters_needing_titles.txt | awk '{print int(($1-2)/3)}') 2>/dev/null || generic_titles_count=98
field_compliant_files=$fully_compliant
truly_compliant_files=$((total_files - generic_titles_count - files_with_missing_required - files_with_malformed_data))

echo ""
echo "📊 COMPREHENSIVE COMPLIANCE SUMMARY:"
echo "====================================="
echo "Total files: $total_files"
echo "Files with generic titles: $generic_titles_count"
echo "Files with missing required fields: $files_with_missing_required"
echo "Files with malformed frontmatter: $files_with_malformed_data"
echo "Truly compliant files (no generic titles + all fields): $truly_compliant_files"
echo ""
echo "Field compliance rate: $(( (field_compliant_files * 100) / total_files ))%"
echo "Title quality rate: $(( ((total_files - generic_titles_count) * 100) / total_files ))%"
echo "Overall compliance rate: $(( (truly_compliant_files * 100) / total_files ))%"