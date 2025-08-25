#!/usr/bin/env python3
"""
Newsletter Quality Assessment Agent
Systematically evaluates newsletter documents and assigns quality ratings based on content analysis.
"""

import os
import re
import yaml
from typing import Dict, List, Tuple, Any
from pathlib import Path
import datetime
import json

class NewsletterQualityAgent:
    def __init__(self, newsletters_dir: str):
        self.newsletters_dir = Path(newsletters_dir)
        self.assessment_results = []
        self.quality_distribution = {"high": 0, "medium": 0, "low": 0}
        
        # Quality thresholds
        self.HIGH_QUALITY_THRESHOLD = 85
        self.MEDIUM_QUALITY_THRESHOLD = 60
        
        # Scoring weights
        self.CONTENT_WEIGHT = 0.40
        self.METADATA_WEIGHT = 0.30
        self.INTEGRITY_WEIGHT = 0.30
    
    def find_pre_assessment_files(self) -> List[Path]:
        """Find all newsletter files with pre-assessment metadata quality."""
        files = []
        for file_path in self.newsletters_dir.glob("*.md"):
            try:
                content = file_path.read_text(encoding='utf-8')
                if 'metadata_quality: "pre-assessment"' in content:
                    files.append(file_path)
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
        return sorted(files)
    
    def parse_frontmatter(self, content: str) -> Tuple[Dict[str, Any], str]:
        """Parse YAML frontmatter from markdown content."""
        if not content.startswith('---'):
            return {}, content
        
        try:
            end_match = re.search(r'\n---\n', content[3:])
            if not end_match:
                return {}, content
            
            yaml_content = content[3:end_match.start() + 3]
            body_content = content[end_match.end() + 3:]
            
            frontmatter = yaml.safe_load(yaml_content)
            return frontmatter or {}, body_content
        except Exception as e:
            print(f"Error parsing YAML frontmatter: {e}")
            return {}, content
    
    def assess_content_completeness(self, frontmatter: Dict, body: str) -> Tuple[float, List[str]]:
        """Assess content completeness (40% weight)."""
        score = 0
        issues = []
        max_score = 100
        
        # Summary quality (25 points)
        summary = frontmatter.get('summary', '')
        if not summary:
            issues.append("Missing summary field")
        elif len(summary) < 50:
            score += 10
            issues.append("Summary too brief (< 50 chars)")
        elif len(summary) < 150:
            score += 20
            issues.append("Summary adequate but could be more detailed")
        else:
            score += 25
        
        # Description quality (25 points)
        description = frontmatter.get('description', '')
        if not description:
            issues.append("Missing description field")
        elif len(description) < 100:
            score += 10
            issues.append("Description too brief (< 100 chars)")
        elif len(description) < 300:
            score += 20
            issues.append("Description adequate but could be more comprehensive")
        else:
            score += 25
        
        # Legal references completeness (25 points)
        legal_statutes = frontmatter.get('legal_statutes', [])
        legal_cases = frontmatter.get('legal_cases', [])
        
        if not legal_statutes and not legal_cases:
            issues.append("No legal references provided")
        elif len(legal_statutes) + len(legal_cases) < 3:
            score += 10
            issues.append("Limited legal references")
        elif len(legal_statutes) + len(legal_cases) < 8:
            score += 20
        else:
            score += 25
        
        # Search keywords richness (25 points)
        keywords = frontmatter.get('search_keywords', '')
        if not keywords:
            issues.append("Missing search keywords")
        elif len(keywords) < 100:
            score += 10
            issues.append("Limited search keywords")
        elif len(keywords) < 200:
            score += 20
        else:
            score += 25
        
        return (score / max_score) * 100, issues
    
    def assess_metadata_richness(self, frontmatter: Dict) -> Tuple[float, List[str]]:
        """Assess metadata richness (30% weight)."""
        score = 0
        issues = []
        max_score = 100
        
        # Categories/tags arrays (30 points)
        categories = frontmatter.get('categories', [])
        tags = frontmatter.get('tags', [])
        
        if not categories and not tags:
            issues.append("No categories or tags provided")
        elif len(categories) + len(tags) < 5:
            score += 10
            issues.append("Limited categories and tags")
        elif len(categories) + len(tags) < 10:
            score += 20
        else:
            score += 30
        
        # Legal cases identification (35 points)
        legal_cases = frontmatter.get('legal_cases', [])
        if not legal_cases:
            issues.append("No legal cases identified")
        elif len(legal_cases) < 2:
            score += 15
            issues.append("Limited legal case references")
        elif len(legal_cases) < 5:
            score += 25
        else:
            score += 35
        
        # Legal statutes coverage (35 points)
        legal_statutes = frontmatter.get('legal_statutes', [])
        if not legal_statutes:
            issues.append("No legal statutes referenced")
        elif len(legal_statutes) < 3:
            score += 15
            issues.append("Limited statute references")
        elif len(legal_statutes) < 8:
            score += 25
        else:
            score += 35
        
        return (score / max_score) * 100, issues
    
    def assess_data_integrity(self, frontmatter: Dict, body: str, file_path: Path) -> Tuple[float, List[str]]:
        """Assess data integrity (30% weight)."""
        score = 0
        issues = []
        max_score = 100
        
        # Required fields completeness (40 points)
        required_fields = ['title', 'date', 'volume', 'edition', 'source_pdf']
        missing_fields = [field for field in required_fields if not frontmatter.get(field)]
        
        if not missing_fields:
            score += 40
        elif len(missing_fields) <= 1:
            score += 30
            issues.append(f"Missing required field: {missing_fields[0]}")
        elif len(missing_fields) <= 2:
            score += 20
            issues.append(f"Missing required fields: {', '.join(missing_fields)}")
        else:
            score += 10
            issues.append(f"Multiple missing required fields: {', '.join(missing_fields)}")
        
        # YAML formatting validity (30 points)
        try:
            # Check if YAML is properly formatted
            content = file_path.read_text(encoding='utf-8')
            frontmatter_test, _ = self.parse_frontmatter(content)
            if frontmatter_test:
                score += 30
            else:
                score += 15
                issues.append("YAML parsing issues detected")
        except Exception as e:
            issues.append(f"YAML formatting errors: {str(e)}")
        
        # PDF link validity check (30 points)
        source_pdf = frontmatter.get('source_pdf', '')
        if source_pdf:
            # Check if PDF exists in public/newsletters or client/public/Newsletters
            pdf_paths = [
                Path(self.newsletters_dir).parent / 'public' / 'newsletters' / source_pdf,
                Path(self.newsletters_dir).parent / 'client' / 'public' / 'Newsletters' / source_pdf
            ]
            
            if any(pdf_path.exists() for pdf_path in pdf_paths):
                score += 30
            else:
                score += 15
                issues.append(f"PDF file not found: {source_pdf}")
        else:
            issues.append("No source PDF specified")
        
        return (score / max_score) * 100, issues
    
    def calculate_overall_quality(self, content_score: float, metadata_score: float, integrity_score: float) -> str:
        """Calculate overall quality rating."""
        overall_score = (
            content_score * self.CONTENT_WEIGHT +
            metadata_score * self.METADATA_WEIGHT +
            integrity_score * self.INTEGRITY_WEIGHT
        )
        
        if overall_score >= self.HIGH_QUALITY_THRESHOLD:
            return "high"
        elif overall_score >= self.MEDIUM_QUALITY_THRESHOLD:
            return "medium"
        else:
            return "low"
    
    def assess_newsletter(self, file_path: Path) -> Dict[str, Any]:
        """Assess a single newsletter file."""
        try:
            content = file_path.read_text(encoding='utf-8')
            frontmatter, body = self.parse_frontmatter(content)
            
            # Perform assessments
            content_score, content_issues = self.assess_content_completeness(frontmatter, body)
            metadata_score, metadata_issues = self.assess_metadata_richness(frontmatter)
            integrity_score, integrity_issues = self.assess_data_integrity(frontmatter, body, file_path)
            
            # Calculate overall quality
            overall_quality = self.calculate_overall_quality(content_score, metadata_score, integrity_score)
            
            # Calculate overall score
            overall_score = (
                content_score * self.CONTENT_WEIGHT +
                metadata_score * self.METADATA_WEIGHT +
                integrity_score * self.INTEGRITY_WEIGHT
            )
            
            assessment = {
                'file': file_path.name,
                'title': frontmatter.get('title', 'Unknown'),
                'date': frontmatter.get('date', 'Unknown'),
                'volume': frontmatter.get('volume', 'Unknown'),
                'edition': frontmatter.get('edition', 'Unknown'),
                'original_quality': frontmatter.get('metadata_quality', 'pre-assessment'),
                'new_quality': overall_quality,
                'overall_score': round(overall_score, 2),
                'scores': {
                    'content_completeness': round(content_score, 2),
                    'metadata_richness': round(metadata_score, 2),
                    'data_integrity': round(integrity_score, 2)
                },
                'issues': {
                    'content': content_issues,
                    'metadata': metadata_issues,
                    'integrity': integrity_issues
                },
                'assessment_date': datetime.datetime.now().isoformat()
            }
            
            return assessment
            
        except Exception as e:
            return {
                'file': file_path.name,
                'error': str(e),
                'new_quality': 'low',
                'overall_score': 0
            }
    
    def update_newsletter_quality(self, file_path: Path, new_quality: str) -> bool:
        """Update the metadata_quality field in the newsletter file."""
        try:
            content = file_path.read_text(encoding='utf-8')
            
            # Replace the metadata_quality line
            updated_content = re.sub(
                r'metadata_quality:\s*"pre-assessment"',
                f'metadata_quality: "{new_quality}"',
                content
            )
            
            if updated_content != content:
                file_path.write_text(updated_content, encoding='utf-8')
                return True
            else:
                print(f"Warning: metadata_quality not found in {file_path.name}")
                return False
                
        except Exception as e:
            print(f"Error updating {file_path.name}: {e}")
            return False
    
    def process_all_newsletters(self) -> None:
        """Process all pre-assessment newsletters."""
        files = self.find_pre_assessment_files()
        print(f"Found {len(files)} newsletters with pre-assessment quality rating")
        
        for i, file_path in enumerate(files, 1):
            print(f"\nProcessing {i}/{len(files)}: {file_path.name}")
            
            assessment = self.assess_newsletter(file_path)
            
            if 'error' not in assessment:
                # Update the file with new quality rating
                if self.update_newsletter_quality(file_path, assessment['new_quality']):
                    print(f"  Updated quality: {assessment['original_quality']} → {assessment['new_quality']}")
                    print(f"  Overall score: {assessment['overall_score']}%")
                    
                    # Update distribution
                    self.quality_distribution[assessment['new_quality']] += 1
                else:
                    print(f"  Failed to update file")
            else:
                print(f"  Error: {assessment['error']}")
                self.quality_distribution['low'] += 1
            
            self.assessment_results.append(assessment)
    
    def generate_summary_report(self) -> Dict[str, Any]:
        """Generate comprehensive summary report."""
        total_processed = len(self.assessment_results)
        successful_assessments = [r for r in self.assessment_results if 'error' not in r]
        
        if not successful_assessments:
            return {
                'error': 'No successful assessments to analyze',
                'total_processed': total_processed
            }
        
        # Calculate average scores
        avg_scores = {
            'overall': sum(r['overall_score'] for r in successful_assessments) / len(successful_assessments),
            'content': sum(r['scores']['content_completeness'] for r in successful_assessments) / len(successful_assessments),
            'metadata': sum(r['scores']['metadata_richness'] for r in successful_assessments) / len(successful_assessments),
            'integrity': sum(r['scores']['data_integrity'] for r in successful_assessments) / len(successful_assessments)
        }
        
        # Identify common issues
        all_issues = []
        for r in successful_assessments:
            all_issues.extend(r['issues']['content'])
            all_issues.extend(r['issues']['metadata'])
            all_issues.extend(r['issues']['integrity'])
        
        issue_counts = {}
        for issue in all_issues:
            issue_counts[issue] = issue_counts.get(issue, 0) + 1
        
        top_issues = sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Quality distribution analysis
        quality_percentages = {
            quality: (count / total_processed) * 100
            for quality, count in self.quality_distribution.items()
        }
        
        report = {
            'assessment_summary': {
                'total_files_processed': total_processed,
                'successful_assessments': len(successful_assessments),
                'failed_assessments': total_processed - len(successful_assessments),
                'assessment_date': datetime.datetime.now().isoformat()
            },
            'quality_distribution': {
                'counts': self.quality_distribution,
                'percentages': {k: round(v, 1) for k, v in quality_percentages.items()}
            },
            'average_scores': {k: round(v, 2) for k, v in avg_scores.items()},
            'top_issues': top_issues,
            'detailed_results': self.assessment_results
        }
        
        return report
    
    def save_results(self, output_file: str = None) -> None:
        """Save assessment results to JSON file."""
        if output_file is None:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"newsletter_quality_assessment_{timestamp}.json"
        
        report = self.generate_summary_report()
        
        output_path = Path(self.newsletters_dir).parent / 'scripts' / output_file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\nResults saved to: {output_path}")

def main():
    """Main execution function."""
    newsletters_dir = "/code/lilagents/firehouse-laywer-b/content/newsletters"
    
    print("Newsletter Quality Assessment Agent")
    print("=" * 50)
    print(f"Processing newsletters from: {newsletters_dir}")
    
    agent = NewsletterQualityAgent(newsletters_dir)
    
    # Process all newsletters
    agent.process_all_newsletters()
    
    # Generate and display summary report
    report = agent.generate_summary_report()
    
    print("\n" + "=" * 50)
    print("ASSESSMENT SUMMARY")
    print("=" * 50)
    print(f"Total files processed: {report['assessment_summary']['total_files_processed']}")
    print(f"Successful assessments: {report['assessment_summary']['successful_assessments']}")
    print(f"Failed assessments: {report['assessment_summary']['failed_assessments']}")
    
    print("\nQuality Distribution:")
    for quality, count in report['quality_distribution']['counts'].items():
        percentage = report['quality_distribution']['percentages'][quality]
        print(f"  {quality.title()}: {count} files ({percentage}%)")
    
    print("\nAverage Scores:")
    for metric, score in report['average_scores'].items():
        print(f"  {metric.replace('_', ' ').title()}: {score}%")
    
    print("\nTop Issues Found:")
    for i, (issue, count) in enumerate(report['top_issues'][:5], 1):
        print(f"  {i}. {issue} ({count} files)")
    
    # Save detailed results
    agent.save_results()
    
    print("\nAssessment complete!")

if __name__ == "__main__":
    main()