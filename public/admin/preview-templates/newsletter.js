// Custom preview template for newsletters
const NewsletterPreview = createClass({
  render() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || 'Newsletter Title';
    const summary = entry.getIn(['data', 'summary']) || '';
    const description = entry.getIn(['data', 'description']) || '';
    const keywords = entry.getIn(['data', 'keywords']) || [];
    const topics = entry.getIn(['data', 'topics']) || [];
    const legal_cases = entry.getIn(['data', 'legal_cases']) || [];
    const legal_statutes = entry.getIn(['data', 'legal_statutes']) || [];
    const tags = entry.getIn(['data', 'tags']) || [];
    const volume = entry.getIn(['data', 'volume']) || '';
    const edition = entry.getIn(['data', 'edition']) || '';
    const date = entry.getIn(['data', 'date']) || '';
    const content = entry.getIn(['data', 'content']) || '';
    
    // Format date to show only month and year
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    }) : 'Date not available';

    return h('div', { 
      style: { 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        minHeight: '100vh',
        padding: '0'
      }
    }, [
      // Header section
      h('div', {
        style: {
          backgroundColor: '#111111',
          padding: '2rem 1rem',
          borderBottom: '2px solid #ff6b35'
        }
      }, [
        h('div', {
          style: {
            maxWidth: '1200px',
            margin: '0 auto'
          }
        }, [
          h('p', {
            style: {
              color: '#ff6b35',
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: '0 0 0.5rem 0'
            }
          }, `Volume ${volume}, Edition ${edition}`),
          h('h1', {
            style: {
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 0.5rem 0',
              letterSpacing: '0.05em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }
          }, title || 'Newsletter Title'),
          h('p', {
            style: {
              fontSize: '1.125rem',
              color: '#d1d5db',
              margin: '0'
            }
          }, formattedDate)
        ])
      ]),
      
      // Main content area
      h('div', {
        style: {
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '3rem',
          backgroundColor: '#2a2a2a'
        }
      }, [
        // Left column - main content
        h('div', {}, [
          // Topics badges
          topics && topics.size > 0 && h('div', {
            style: { marginBottom: '1.5rem' }
          }, [
            h('div', {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }
            }, topics.entrySeq().map(([index, topic]) => 
              h('span', {
                key: index,
                style: {
                  backgroundColor: '#ff6b35',
                  color: '#000000',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontWeight: '500'
                }
              }, topic)
            ))
          ]),
          
          // Summary section
          summary && h('div', {
            style: { marginBottom: '2rem' }
          }, [
            h('h3', {
              style: {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }
            }, 'SUMMARY'),
            h('p', {
              style: {
                color: '#f3f4f6',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }
            }, summary)
          ]),
          
          // Description section
          description && h('div', {
            style: { marginBottom: '2rem' }
          }, [
            h('h3', {
              style: {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }
            }, 'DESCRIPTION'),
            h('p', {
              style: {
                color: '#f3f4f6',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }
            }, description)
          ]),
          
          // Content preview section
          content && h('div', {
            style: { marginBottom: '2rem' }
          }, [
            h('h3', {
              style: {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }
            }, 'CONTENT PREVIEW'),
            h('div', {
              style: {
                color: '#f3f4f6',
                lineHeight: '1.6',
                whiteSpace: 'pre-line'
              },
              dangerouslySetInnerHTML: { __html: content }
            })
          ])
        ]),
        
        // Right column - sidebar
        h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }
        }, [
          // Keywords
          keywords && keywords.size > 0 && h('div', {
            style: {
              backgroundColor: '#3a3a3a',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ff6b35'
            }
          }, [
            h('h3', {
              style: {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }
            }, 'KEYWORDS'),
            h('div', {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }
            }, keywords.entrySeq().map(([index, keyword]) =>
              h('span', {
                key: index,
                style: {
                  border: '1px solid #ff6b35',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem'
                }
              }, keyword)
            ))
          ]),
          
          // Legal Cases
          legal_cases && legal_cases.size > 0 && h('div', {
            style: {
              backgroundColor: '#3a3a3a',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ff6b35'
            }
          }, [
            h('h3', {
              style: {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }
            }, 'LEGAL CASES'),
            h('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }
            }, legal_cases.entrySeq().map(([index, case_name]) =>
              h('span', {
                key: index,
                style: {
                  border: '1px solid #60a5fa',
                  color: '#93c5fd',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem'
                }
              }, case_name)
            ))
          ]),
          
          // Legal Statutes
          legal_statutes && legal_statutes.size > 0 && h('div', {
            style: {
              backgroundColor: '#3a3a3a',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ff6b35'
            }
          }, [
            h('h3', {
              style: {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }
            }, 'LEGAL STATUTES'),
            h('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }
            }, legal_statutes.entrySeq().map(([index, statute]) =>
              h('span', {
                key: index,
                style: {
                  border: '1px solid #a78bfa',
                  color: '#c4b5fd',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem'
                }
              }, statute)
            ))
          ]),
          
          // Tags
          tags && tags.size > 0 && h('div', {
            style: {
              backgroundColor: '#3a3a3a',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ff6b35'
            }
          }, [
            h('h3', {
              style: {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }
            }, 'TAGS'),
            h('div', {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }
            }, tags.entrySeq().map(([index, tag]) =>
              h('span', {
                key: index,
                style: {
                  border: '1px solid #fb923c',
                  color: '#fed7aa',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem'
                }
              }, tag)
            ))
          ])
        ])
      ])
    ]);
  }
});

// Register the preview template
CMS.registerPreviewTemplate("newsletters", NewsletterPreview);