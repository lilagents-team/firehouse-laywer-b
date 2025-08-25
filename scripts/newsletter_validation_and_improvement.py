#!/usr/bin/env python3

"""
Newsletter Validation and Title Improvement Script

This script performs comprehensive newsletter validation and title improvements by:
1. Running the title analysis script to identify problematic titles
2. Reading newsletter files that need title improvements
3. Generating content-based titles for newsletters with blacklisted terms
4. Updating newsletter files with improved titles
5. Focusing on the highest priority cases first

Blacklisted terms include: 'firehouse', 'legal updates', 'newsletter', 'volume', 'number', 'updates', 'joseph f. quin'
"""

import os
import sys
import re
import json
import subprocess
from datetime import datetime
from pathlib import Path
from collections import Counter
import tempfile

class NewsletterValidator:
    """Main class for newsletter validation and title improvement."""
    
    def __init__(self, newsletter_dir="/code/lilagents/firehouse-laywer-b/content/newsletters"):
        self.newsletter_dir = newsletter_dir
        self.script_dir = "/code/lilagents/firehouse-laywer-b/scripts"
        self.analysis_script = os.path.join(self.script_dir, "analyze_newsletter_titles.py")
        
        # Updated blacklist including "joseph f. quin" as requested
        self.blacklisted_terms = [
            'firehouse',
            'legal updates', 
            'newsletter',
            'volume',
            'number',
            'updates',
            'joseph f. quin'
        ]
        
        # Required fields for newsletter validation
        self.required_fields = [
            'title',
            'date',
            'volume',
            'number',
            'summary'
        ]
        
        self.processed_files = []
        self.errors = []
        
    def run_title_analysis(self):
        """Run the existing title analysis script to identify problematic titles."""
        print("🔍 Running title analysis script...")
        
        try:
            result = subprocess.run([
                sys.executable, self.analysis_script
            ], capture_output=True, text=True, cwd=self.script_dir)
            
            if result.returncode == 0:
                print("✅ Title analysis completed successfully")
                print(result.stdout)
                return True
            else:
                print("❌ Title analysis failed")
                print("STDERR:", result.stderr)
                return False
                
        except Exception as e:
            print(f"❌ Error running title analysis: {e}")
            return False
    
    def extract_newsletter_content(self, filepath):
        """Extract content from a newsletter file for title generation."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Split into frontmatter and body
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    frontmatter = parts[1]
                    body = parts[2]
                else:
                    frontmatter = ""
                    body = content
            else:
                frontmatter = ""
                body = content
                
            return frontmatter, body
            
        except Exception as e:
            self.errors.append(f"Error reading {filepath}: {e}")
            return "", ""
    
    def parse_frontmatter(self, frontmatter):
        """Parse YAML frontmatter into a dictionary."""
        fields = {}
        
        for line in frontmatter.split('\n'):
            line = line.strip()
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip().strip('"\'')
                fields[key] = value
                
        return fields
    
    def generate_content_based_title(self, body_content, filename):
        """Generate a title based on newsletter content."""
        
        # Extract key legal topics and themes from content
        legal_topics = self.extract_legal_topics(body_content)
        date_info = self.extract_date_from_filename(filename)
        
        if legal_topics:
            # Create title based on most prominent topics
            main_topics = legal_topics[:2]  # Take top 2 topics
            
            if len(main_topics) == 1:
                title = f"{main_topics[0]} Legal Guidance"
            else:
                title = f"{main_topics[0]} and {main_topics[1]} Updates"
                
            # Add date context if available
            if date_info:
                title = f"{title} - {date_info}"
                
            return title
        
        # Fallback: use date-based title
        if date_info:
            return f"Legal Updates for {date_info}"
        
        # Last resort fallback
        return "Fire Department Legal Guidance"
    
    def extract_legal_topics(self, content):
        """Extract legal topics and themes from newsletter content."""
        
        # Common fire department legal topics
        topic_patterns = {
            'Employment Law': r'(employment|hiring|discrimination|personnel|wage|overtime|fmla)',
            'Contract Law': r'(contract|agreement|vendor|procurement|bid)',
            'Public Records': r'(records|foia|sunshine|transparency|disclosure)',
            'Liability': r'(liability|insurance|claim|lawsuit|negligence)',
            'Labor Relations': r'(union|collective bargaining|grievance|arbitration)',
            'Constitutional Law': r'(constitutional|first amendment|due process|equal protection)',
            'Workers Compensation': r'(workers.?comp|injury|disability|medical)',
            'Public Safety': r'(safety|emergency|hazmat|equipment|training)',
            'Budget and Finance': r'(budget|finance|funding|appropriation|tax)',
            'HIPAA Compliance': r'(hipaa|privacy|medical records|health information)',
            'Policy Development': r'(policy|procedure|regulation|compliance)',
            'Pension Benefits': r'(pension|retirement|benefits|pera)'
        }
        
        content_lower = content.lower()
        topic_scores = {}
        
        # Score each topic based on frequency and context
        for topic, pattern in topic_patterns.items():
            matches = re.findall(pattern, content_lower, re.IGNORECASE)
            if matches:
                # Weight by frequency and add bonus for title-like contexts
                base_score = len(matches)
                
                # Check for topic in headers or emphasized text
                header_pattern = rf'#+.*{pattern}|<h[1-6]>.*{pattern}|\*\*.*{pattern}'
                if re.search(header_pattern, content, re.IGNORECASE):
                    base_score += 5
                
                topic_scores[topic] = base_score
        
        # Return topics sorted by relevance score
        return [topic for topic, score in sorted(topic_scores.items(), 
                                                key=lambda x: x[1], reverse=True)]
    
    def extract_date_from_filename(self, filename):
        """Extract date information from filename."""
        
        # Common date patterns in filenames
        date_patterns = [
            r'(\w+)(\d{4})',  # MonthYear
            r'(\w+)(\d{2})(\d{4})',  # MonthDayYear  
            r'(\d{4})(\w+)',  # YearMonth
            r'v\d+n\d+(\w+)(\d{4})',  # Volume format with date
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, filename, re.IGNORECASE)
            if match:
                groups = match.groups()
                
                # Try to construct readable date
                if len(groups) >= 2:
                    month_str = groups[0] if groups[0].isalpha() else groups[1] if len(groups) > 1 and groups[1].isalpha() else ""
                    year_str = groups[1] if groups[1].isdigit() else groups[0] if groups[0].isdigit() else ""
                    
                    if month_str and year_str:
                        return f"{month_str.title()} {year_str}"
        
        return None
    
    def check_title_needs_improvement(self, title):
        """Check if a title contains blacklisted terms and needs improvement."""
        title_lower = title.lower()
        
        for term in self.blacklisted_terms:
            if term in title_lower:
                return True
        
        return False
    
    def validate_newsletter_fields(self, filepath):
        """Validate all required fields in a newsletter file."""
        
        frontmatter, body = self.extract_newsletter_content(filepath)
        fields = self.parse_frontmatter(frontmatter)
        
        issues = []
        
        # Check required fields
        for field in self.required_fields:
            if field not in fields or not fields[field]:
                issues.append(f"Missing or empty required field: {field}")
        
        # Validate field formats
        if 'date' in fields:
            if not self.is_valid_date(fields['date']):
                issues.append(f"Invalid date format: {fields['date']}")
        
        if 'volume' in fields:
            if not fields['volume'].isdigit():
                issues.append(f"Volume should be numeric: {fields['volume']}")
                
        if 'number' in fields:
            if not fields['number'].isdigit():
                issues.append(f"Number should be numeric: {fields['number']}")
        
        # Check title quality
        if 'title' in fields:
            if self.check_title_needs_improvement(fields['title']):
                issues.append(f"Title contains blacklisted terms: {fields['title']}")
        
        return fields, issues
    
    def is_valid_date(self, date_str):
        """Validate date format."""
        date_formats = [
            '%Y-%m-%d',
            '%m/%d/%Y', 
            '%B %d, %Y',
            '%d %B %Y'
        ]
        
        for fmt in date_formats:
            try:
                datetime.strptime(date_str, fmt)
                return True
            except ValueError:
                continue
        
        return False
    
    def update_newsletter_title(self, filepath, new_title):
        """Update the title field in a newsletter file."""
        
        try:
            frontmatter, body = self.extract_newsletter_content(filepath)
            fields = self.parse_frontmatter(frontmatter)
            
            # Update title
            fields['title'] = new_title
            
            # Reconstruct frontmatter
            new_frontmatter = "---\n"
            for key, value in fields.items():
                # Properly quote values that contain special characters
                if any(char in str(value) for char in ['"', "'", ':', '\n']):
                    new_frontmatter += f'{key}: "{str(value).replace('"', '\\"')}"\n'
                else:
                    new_frontmatter += f'{key}: {value}\n'
            new_frontmatter += "---\n"
            
            # Write back to file
            new_content = new_frontmatter + body
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            return True
            
        except Exception as e:
            self.errors.append(f"Error updating {filepath}: {e}")
            return False
    
    def process_high_priority_newsletters(self):
        """Process newsletters with blacklisted terms first (highest priority)."""
        
        print("\n🎯 Processing high-priority newsletters with blacklisted terms...")
        
        processed = 0
        
        for filename in os.listdir(self.newsletter_dir):
            if not filename.endswith('.md'):
                continue
                
            filepath = os.path.join(self.newsletter_dir, filename)
            fields, issues = self.validate_newsletter_fields(filepath)
            
            if 'title' in fields and self.check_title_needs_improvement(fields['title']):
                print(f"\n📄 Processing: {filename}")
                print(f"   Current title: '{fields['title']}'")
                
                # Extract content for title generation
                _, body = self.extract_newsletter_content(filepath)
                
                # Generate new title
                new_title = self.generate_content_based_title(body, filename)
                print(f"   Proposed title: '{new_title}'")
                
                # Update the file
                if self.update_newsletter_title(filepath, new_title):
                    print("   ✅ Title updated successfully")
                    self.processed_files.append({
                        'filename': filename,
                        'old_title': fields['title'],
                        'new_title': new_title,
                        'issues': issues
                    })
                    processed += 1
                else:
                    print("   ❌ Failed to update title")
                    
                # Limit processing for safety
                if processed >= 20:
                    print(f"\n⚠️ Stopping after {processed} files for safety. Run again to continue.")
                    break
        
        return processed
    
    def validate_all_newsletters(self):
        """Validate all newsletter files for field completeness and format."""
        
        print("\n📋 Validating all newsletter fields...")
        
        validation_results = []
        
        for filename in os.listdir(self.newsletter_dir):
            if not filename.endswith('.md'):
                continue
                
            filepath = os.path.join(self.newsletter_dir, filename)
            fields, issues = self.validate_newsletter_fields(filepath)
            
            validation_results.append({
                'filename': filename,
                'fields': fields,
                'issues': issues,
                'status': 'valid' if not issues else 'needs_attention'
            })
        
        return validation_results
    
    def generate_report(self, validation_results):
        """Generate a comprehensive validation and improvement report."""
        
        print("\n" + "="*80)
        print("NEWSLETTER VALIDATION AND IMPROVEMENT REPORT")
        print("="*80)
        
        # Summary statistics
        total_files = len(validation_results)
        files_with_issues = len([r for r in validation_results if r['issues']])
        files_processed = len(self.processed_files)
        
        print(f"\n📊 SUMMARY:")
        print(f"   • Total newsletter files: {total_files}")
        print(f"   • Files with validation issues: {files_with_issues}")
        print(f"   • Files with titles improved: {files_processed}")
        print(f"   • Processing errors: {len(self.errors)}")
        
        # Show files that were updated
        if self.processed_files:
            print(f"\n✅ TITLES SUCCESSFULLY IMPROVED:")
            print("-" * 50)
            for item in self.processed_files:
                print(f"📄 {item['filename']}")
                print(f"   Old: '{item['old_title']}'")
                print(f"   New: '{item['new_title']}'")
                print()
        
        # Show validation issues
        problematic_files = [r for r in validation_results if r['issues']]
        if problematic_files:
            print(f"\n⚠️ FILES NEEDING ATTENTION:")
            print("-" * 40)
            
            for result in problematic_files[:20]:  # Show first 20
                print(f"📄 {result['filename']}")
                for issue in result['issues']:
                    print(f"   • {issue}")
                print()
        
        # Show errors
        if self.errors:
            print(f"\n❌ PROCESSING ERRORS:")
            print("-" * 30)
            for error in self.errors:
                print(f"   • {error}")
        
        # Save detailed report
        self.save_detailed_report(validation_results)
    
    def save_detailed_report(self, validation_results):
        """Save a detailed report to file."""
        
        report_file = f"/tmp/newsletter_validation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total_files': len(validation_results),
                'files_with_issues': len([r for r in validation_results if r['issues']]),
                'files_processed': len(self.processed_files),
                'processing_errors': len(self.errors)
            },
            'processed_files': self.processed_files,
            'validation_results': validation_results,
            'errors': self.errors,
            'blacklisted_terms': self.blacklisted_terms
        }
        
        try:
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report_data, f, indent=2, ensure_ascii=False)
                
            print(f"\n📄 Detailed report saved to: {report_file}")
            
        except Exception as e:
            print(f"⚠️ Could not save detailed report: {e}")
    
    def run(self):
        """Main execution method."""
        
        print("🚀 Starting Newsletter Validation and Title Improvement")
        print("="*60)
        
        # Step 1: Run title analysis
        if not self.run_title_analysis():
            print("⚠️ Title analysis failed, continuing with validation...")
        
        # Step 2: Process high-priority newsletters (blacklisted terms)
        processed_count = self.process_high_priority_newsletters()
        
        # Step 3: Validate all newsletters
        validation_results = self.validate_all_newsletters()
        
        # Step 4: Generate comprehensive report
        self.generate_report(validation_results)
        
        print("\n🎉 Newsletter validation and improvement completed!")
        
        return {
            'processed_files': len(self.processed_files),
            'validation_results': len(validation_results),
            'errors': len(self.errors)
        }


def main():
    """Main entry point."""
    
    # Check if newsletter directory exists
    newsletter_dir = "/code/lilagents/firehouse-laywer-b/content/newsletters"
    
    if not os.path.exists(newsletter_dir):
        print(f"❌ Error: Newsletter directory not found: {newsletter_dir}")
        sys.exit(1)
    
    # Initialize validator
    validator = NewsletterValidator(newsletter_dir)
    
    # Run the validation and improvement process
    try:
        results = validator.run()
        
        if results['processed_files'] > 0:
            print(f"\n✅ Success! Improved titles for {results['processed_files']} newsletters.")
        
        if results['errors'] > 0:
            print(f"\n⚠️ Warning: {results['errors']} errors encountered during processing.")
            
    except KeyboardInterrupt:
        print("\n\n⚠️ Process interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()