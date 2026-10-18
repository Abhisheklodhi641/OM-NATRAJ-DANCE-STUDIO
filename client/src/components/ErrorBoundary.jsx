import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section
          style={{
            minHeight: this.props.isolated ? 'auto' : '60vh',
            padding: '4rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary, #0c0b10)',
            color: '#fff',
            textAlign: 'center'
          }}
        >
          <div style={{ maxWidth: '580px', margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold, #d4af37)',
                marginBottom: '1rem'
              }}
            >
              Application Notice
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-serif, serif)',
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                marginBottom: '1rem',
                color: '#fff'
              }}
            >
              Something went unexpectedly wrong.
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body, sans-serif)',
                fontSize: '0.95rem',
                color: 'var(--text-muted, #9e9a93)',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}
            >
              A momentary display error occurred while rendering this section. You can refresh the view or return to the studio home page.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                className="btn btn-primary"
                style={{ padding: '12px 24px', cursor: 'pointer' }}
              >
                Reload Page
              </button>
              <a
                href="/"
                className="btn btn-outline"
                style={{ padding: '12px 24px', textDecoration: 'none' }}
              >
                Studio Home
              </a>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
