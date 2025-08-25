#!/usr/bin/env python3
"""
Test script for Newsletter Quality Assessment Agent
Tests the scoring mechanism on a small sample of newsletters.
"""

import sys
from pathlib import Path

# Add the scripts directory to the path
sys.path.append(str(Path(__file__).parent))

from newsletter_quality_assessment_agent import NewsletterQualityAgent

def test_sample_newsletters():
    """Test the agent on a small sample of newsletters."""
    newsletters_dir = "/code/lilagents/firehouse-laywer-b/content/newsletters"
    agent = NewsletterQualityAgent(newsletters_dir)
    
    # Test with specific files we examined earlier
    test_files = [
        "August_2015.md",
        "January2022FINAL.md", 
        "April2023FINAL.md"
    ]
    
    print("Newsletter Quality Assessment Agent - Test Run")
    print("=" * 60)
    
    for filename in test_files:
        file_path = Path(newsletters_dir) / filename
        if not file_path.exists():
            print(f"File not found: {filename}")
            continue
            
        print(f"\nTesting: {filename}")
        print("-" * 40)
        
        assessment = agent.assess_newsletter(file_path)
        
        if 'error' not in assessment:
            print(f"Title: {assessment['title']}")
            print(f"Current Quality: {assessment['original_quality']}")
            print(f"Recommended Quality: {assessment['new_quality']}")
            print(f"Overall Score: {assessment['overall_score']}%")
            
            print("\nDetailed Scores:")
            print(f"  Content Completeness (40%): {assessment['scores']['content_completeness']}%")
            print(f"  Metadata Richness (30%): {assessment['scores']['metadata_richness']}%")
            print(f"  Data Integrity (30%): {assessment['scores']['data_integrity']}%")
            
            print("\nIssues Found:")
            all_issues = (assessment['issues']['content'] + 
                         assessment['issues']['metadata'] + 
                         assessment['issues']['integrity'])
            if all_issues:
                for issue in all_issues:
                    print(f"  • {issue}")
            else:
                print("  No issues found")
        else:
            print(f"Error assessing file: {assessment['error']}")
    
    print("\n" + "=" * 60)
    print("Test complete - ready for full processing")

if __name__ == "__main__":
    test_sample_newsletters()