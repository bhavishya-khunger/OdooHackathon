'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Something went wrong</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{error?.message ?? 'An unexpected error occurred.'}</p>
          <button
            onClick={reset}
            style={{ padding: '10px 24px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
