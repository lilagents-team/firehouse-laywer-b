#!/usr/bin/env python3

"""
YAML Error Detection Script
Parses all newsletter files to identify specific YAML frontmatter issues
"""

import os
import re

def check_yaml_frontmatter(file_path):
    """Check a single file for YAML frontmatter errors."""
    errors = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if not content.startswith('---'):
            return ['No YAML frontmatter found']
        
        # Extract frontmatter
        parts = content.split('---', 2)
        if len(parts) < 3:
            return ['Incomplete YAML frontmatter (missing closing ---)']
        
        frontmatter = parts[1]
        lines = frontmatter.strip().split('\n')
        
        # Check each line for common YAML issues
        in_multiline_field = False
        current_field = None
        
        for i, line in enumerate(lines):
            line_num = i + 2  # Account for opening ---
            
            # Skip empty lines
            if not line.strip():
                continue
            
            # Check for field definitions (key: value)
            if ':' in line and not line.strip().startswith('-'):
                # This looks like a field definition
                field_match = re.match(r'^(\s*)([^:]+):\s*(.*)$', line)
                if field_match:
                    indent, field_name, field_value = field_match.groups()
                    current_field = field_name.strip()
                    
                    # Check for common issues in field values
                    if field_value:
                        # Check for unquoted strings that span multiple lines
                        if field_value.startswith('"') and not field_value.endswith('"'):
                            errors.append(f"Line {line_num}: Unclosed quote in {current_field}")
                        elif field_value.startswith("'") and not field_value.endswith("'"):
                            errors.append(f"Line {line_num}: Unclosed quote in {current_field}")
                    
                    in_multiline_field = field_value.startswith('"') and not field_value.endswith('"')
                else:
                    errors.append(f"Line {line_num}: Malformed field definition")
            else:
                # This line doesn't start a new field
                if not in_multiline_field and not line.strip().startswith('-'):
                    # This might be continuation content that should be quoted
                    if current_field and not line.strip().startswith('#'):
                        errors.append(f"Line {line_num}: Content continuation without proper YAML formatting in {current_field}")
        
        # Check for specific problematic patterns
        if 'search_keywords:' in frontmatter:
            # Find search_keywords field and check for multi-line issues
            search_match = re.search(r'search_keywords:\s*"([^"]*?)$', frontmatter, re.MULTILINE)
            if search_match:
                errors.append(f"search_keywords field has unclosed quotes spanning multiple lines")
        
    except Exception as e:
        errors.append(f"File read error: {e}")
    
    return errors

def main():
    newsletter_dir = "/code/lilagents/firehouse-laywer-b/content/newsletters"
    
    print("🔍 YAML Frontmatter Error Detection")
    print("=" * 50)
    
    error_files = []
    total_files = 0
    
    for filename in os.listdir(newsletter_dir):
        if filename.endswith('.md'):
            total_files += 1
            filepath = os.path.join(newsletter_dir, filename)
            errors = check_yaml_frontmatter(filepath)
            
            if errors:
                error_files.append((filename, errors))
                print(f"\n❌ {filename}:")
                for error in errors:
                    print(f"   • {error}")
            else:
                print(f"✅ {filename}")
    
    print(f"\n📊 SUMMARY:")
    print(f"   Total files: {total_files}")
    print(f"   Files with YAML errors: {len(error_files)}")
    print(f"   Files without errors: {total_files - len(error_files)}")
    
    if error_files:
        print(f"\n🚨 FILES NEEDING YAML FIXES:")
        for filename, errors in error_files:
            print(f"   - {filename} ({len(errors)} issues)")

if __name__ == "__main__":
    main()