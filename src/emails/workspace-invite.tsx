import * as React from 'react'

interface Props {
  inviterName: string
  workspaceName: string
  inviteLink: string
}

// Plain React component rendered server-side to HTML by Resend
export const WorkspaceInviteEmail = ({
  inviterName,
  workspaceName,
  inviteLink,
}: Props) => (
  <div
    style={{
      fontFamily: "'Segoe UI', Arial, sans-serif",
      maxWidth: 560,
      margin: '0 auto',
      backgroundColor: '#0d0d0d',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid #1D1D1D',
    }}
  >
    {/* Header */}
    <div
      style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        padding: '32px 40px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#fff', margin: 0, fontSize: 24, fontWeight: 700 }}>
        Streamline
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0', fontSize: 13 }}>
        Async video collaboration
      </p>
    </div>

    {/* Body */}
    <div style={{ padding: '32px 40px' }}>
      <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 600, marginTop: 0 }}>
        You&apos;ve been invited!
      </h2>
      <p style={{ color: '#9D9D9D', fontSize: 15, lineHeight: 1.6, margin: '12px 0' }}>
        <strong style={{ color: '#e5e5e5' }}>{inviterName}</strong> has invited you
        to join their workspace{' '}
        <strong style={{ color: '#e5e5e5' }}>&quot;{workspaceName}&quot;</strong> on
        Streamline.
      </p>
      <p style={{ color: '#9D9D9D', fontSize: 15, lineHeight: 1.6, margin: '12px 0' }}>
        Click the button below to accept the invitation and start collaborating.
      </p>

      {/* CTA */}
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <a
          href={inviteLink}
          style={{
            display: 'inline-block',
            backgroundColor: '#4f46e5',
            color: '#fff',
            textDecoration: 'none',
            padding: '14px 32px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Accept Invitation →
        </a>
      </div>

      <p style={{ color: '#555', fontSize: 12, lineHeight: 1.6 }}>
        If you weren&apos;t expecting this invite, you can safely ignore this email.
        This link will remain active.
      </p>
    </div>

    {/* Footer */}
    <div
      style={{
        borderTop: '1px solid #1D1D1D',
        padding: '16px 40px',
        textAlign: 'center',
      }}
    >
      <p style={{ color: '#555', fontSize: 12, margin: 0 }}>
        © 2025 Streamline. All rights reserved.
      </p>
    </div>
  </div>
)
