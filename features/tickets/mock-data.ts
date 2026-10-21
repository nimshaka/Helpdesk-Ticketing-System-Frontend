import type { Ticket } from '@/types';

export const SEED_TICKETS: Ticket[] = [
  // 1. In Progress (Held by Alex Rivera, Customer Alice)
  {
    id: 1,
    subject: 'Cannot log into customer portal on Safari',
    description: 'Whenever I try logging in with Safari 17 on macOS, the login form spins indefinitely and throws a CORS warning.',
    priority: 'high',
    status: { value: 'in_progress', label: 'In Progress' },
    customer: { id: 10, name: 'Alice Johnson' },
    agent: { id: 2, name: 'Alex Rivera (Agent)' },
    created_at: '2026-10-18T09:00:00Z',
    updated_at: '2026-10-20T14:30:00Z',
    last_activity_at: '2026-10-20T14:30:00Z',
    replies: [
      {
        id: 101,
        body: 'Hello Alice, thank you for reaching out. We are investigating a potential cookie partition issue in newer Safari releases.',
        author: { id: 2, name: 'Alex Rivera (Agent)', role: 'agent' },
        created_at: '2026-10-18T10:15:00Z',
      },
      {
        id: 102,
        body: 'Thanks Alex! I can confirm it works fine on Chrome on the same laptop.',
        author: { id: 10, name: 'Alice Johnson', role: 'customer' },
        created_at: '2026-10-19T08:20:00Z',
      },
      {
        id: 103,
        body: 'Great to know. Our authentication team has rolled out a hotfix to staging. Testing it now.',
        author: { id: 2, name: 'Alex Rivera (Agent)', role: 'agent' },
        created_at: '2026-10-20T14:30:00Z',
      },
    ],
    status_history: [
      {
        id: 201,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 10, name: 'Alice Johnson' },
        created_at: '2026-10-18T09:00:00Z',
      },
      {
        id: 202,
        from: { value: 'open', label: 'Open' },
        to: { value: 'in_progress', label: 'In Progress' },
        changed_by: { id: 2, name: 'Alex Rivera (Agent)' },
        created_at: '2026-10-18T09:45:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 2, name: 'Alex Rivera (Agent)' },
        assigned_by: 2,
        assigned_at: '2026-10-18T09:45:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 2. Waiting for Customer (Held by Bob Smith, Customer Michael)
  {
    id: 2,
    subject: 'Billing discrepancy on invoice #INV-4921',
    description: 'I was charged twice for the monthly Enterprise plan subscription on Oct 1st.',
    priority: 'high',
    status: { value: 'waiting_for_customer', label: 'Waiting for Customer' },
    customer: { id: 11, name: 'Michael Chen' },
    agent: { id: 3, name: 'Bob Smith (Agent)' },
    created_at: '2026-10-19T11:00:00Z',
    updated_at: '2026-10-20T16:00:00Z',
    last_activity_at: '2026-10-20T16:00:00Z',
    replies: [
      {
        id: 104,
        body: 'Hi Michael, could you please provide the last 4 digits of the card used and a screenshot of the duplicate bank charge?',
        author: { id: 3, name: 'Bob Smith (Agent)', role: 'agent' },
        created_at: '2026-10-20T16:00:00Z',
      },
    ],
    status_history: [
      {
        id: 203,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 11, name: 'Michael Chen' },
        created_at: '2026-10-19T11:00:00Z',
      },
      {
        id: 204,
        from: { value: 'open', label: 'Open' },
        to: { value: 'in_progress', label: 'In Progress' },
        changed_by: { id: 3, name: 'Bob Smith (Agent)' },
        created_at: '2026-10-19T11:30:00Z',
      },
      {
        id: 205,
        from: { value: 'in_progress', label: 'In Progress' },
        to: { value: 'waiting_for_customer', label: 'Waiting for Customer' },
        changed_by: { id: 3, name: 'Bob Smith (Agent)' },
        created_at: '2026-10-20T16:00:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 3, name: 'Bob Smith (Agent)' },
        assigned_by: 3,
        assigned_at: '2026-10-19T11:30:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 3. Open & Unassigned (Available for Claim / Assign)
  {
    id: 3,
    subject: 'Webhook delivery failing with 504 timeout',
    description: 'Our server webhook endpoint is timing out on payload delivery during ticket status changes.',
    priority: 'high',
    status: { value: 'open', label: 'Open' },
    customer: { id: 12, name: 'Emily Davis' },
    agent: null,
    created_at: '2026-10-21T06:30:00Z',
    updated_at: '2026-10-21T06:30:00Z',
    last_activity_at: '2026-10-21T06:30:00Z',
    replies: [],
    status_history: [
      {
        id: 206,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 12, name: 'Emily Davis' },
        created_at: '2026-10-21T06:30:00Z',
      },
    ],
    assignments: [],
  },

  // 4. Open & Unassigned
  {
    id: 4,
    subject: 'Requesting SSO (SAML 2.0) setup for our workspace',
    description: 'We need guidance and metadata exchange to connect Okta SAML 2.0 for our 45 staff members.',
    priority: 'medium',
    status: { value: 'open', label: 'Open' },
    customer: { id: 13, name: 'David Wilson' },
    agent: null,
    created_at: '2026-10-21T07:15:00Z',
    updated_at: '2026-10-21T07:15:00Z',
    last_activity_at: '2026-10-21T07:15:00Z',
    replies: [],
    status_history: [
      {
        id: 207,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 13, name: 'David Wilson' },
        created_at: '2026-10-21T07:15:00Z',
      },
    ],
    assignments: [],
  },

  // 5. Open & Unassigned
  {
    id: 5,
    subject: 'How do I export customer ticket history to CSV?',
    description: 'I would like to download our historical ticket logs for an internal quarterly review.',
    priority: 'low',
    status: { value: 'open', label: 'Open' },
    customer: { id: 14, name: 'Sophia Martinez' },
    agent: null,
    created_at: '2026-10-21T08:00:00Z',
    updated_at: '2026-10-21T08:00:00Z',
    last_activity_at: '2026-10-21T08:00:00Z',
    replies: [],
    status_history: [
      {
        id: 208,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 14, name: 'Sophia Martinez' },
        created_at: '2026-10-21T08:00:00Z',
      },
    ],
    assignments: [],
  },

  // 6. Resolved (Held by Diana Lee, Customer Alice)
  {
    id: 6,
    subject: 'Unable to update profile avatar image',
    description: 'PNG files under 2MB are getting rejected with invalid file format error.',
    priority: 'low',
    status: { value: 'resolved', label: 'Resolved' },
    customer: { id: 10, name: 'Alice Johnson' },
    agent: { id: 4, name: 'Diana Lee (Agent)' },
    created_at: '2026-10-15T12:00:00Z',
    updated_at: '2026-10-17T15:00:00Z',
    last_activity_at: '2026-10-17T15:00:00Z',
    replies: [
      {
        id: 105,
        body: 'We noticed our image processing service had an overly strict MIME filter. This has been updated.',
        author: { id: 4, name: 'Diana Lee (Agent)', role: 'agent' },
        created_at: '2026-10-16T10:00:00Z',
      },
      {
        id: 106,
        body: 'Confirmed working now! Thank you so much.',
        author: { id: 10, name: 'Alice Johnson', role: 'customer' },
        created_at: '2026-10-17T14:45:00Z',
      },
      {
        id: 107,
        body: 'Glad to hear! Marking this ticket as resolved.',
        author: { id: 4, name: 'Diana Lee (Agent)', role: 'agent' },
        created_at: '2026-10-17T15:00:00Z',
      },
    ],
    status_history: [
      {
        id: 209,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 10, name: 'Alice Johnson' },
        created_at: '2026-10-15T12:00:00Z',
      },
      {
        id: 210,
        from: { value: 'open', label: 'Open' },
        to: { value: 'in_progress', label: 'In Progress' },
        changed_by: { id: 4, name: 'Diana Lee (Agent)' },
        created_at: '2026-10-15T13:00:00Z',
      },
      {
        id: 211,
        from: { value: 'in_progress', label: 'In Progress' },
        to: { value: 'resolved', label: 'Resolved' },
        changed_by: { id: 4, name: 'Diana Lee (Agent)' },
        created_at: '2026-10-17T15:00:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 4, name: 'Diana Lee (Agent)' },
        assigned_by: 4,
        assigned_at: '2026-10-15T13:00:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 7. In Progress (Held by Alex Rivera, Customer Michael)
  {
    id: 7,
    subject: 'API rate limits too restrictive on free tier',
    description: 'We are hitting the 60 requests/minute ceiling during peak sync hours.',
    priority: 'medium',
    status: { value: 'in_progress', label: 'In Progress' },
    customer: { id: 11, name: 'Michael Chen' },
    agent: { id: 2, name: 'Alex Rivera (Agent)' },
    created_at: '2026-10-17T14:00:00Z',
    updated_at: '2026-10-19T09:00:00Z',
    last_activity_at: '2026-10-19T09:00:00Z',
    replies: [
      {
        id: 108,
        body: 'Hi Michael, we can provision a temporary burst quota of 150 req/min while you evaluate our Pro plan.',
        author: { id: 2, name: 'Alex Rivera (Agent)', role: 'agent' },
        created_at: '2026-10-19T09:00:00Z',
      },
    ],
    status_history: [
      {
        id: 212,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 11, name: 'Michael Chen' },
        created_at: '2026-10-17T14:00:00Z',
      },
      {
        id: 213,
        from: { value: 'open', label: 'Open' },
        to: { value: 'in_progress', label: 'In Progress' },
        changed_by: { id: 2, name: 'Alex Rivera (Agent)' },
        created_at: '2026-10-18T08:00:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 2, name: 'Alex Rivera (Agent)' },
        assigned_by: 2,
        assigned_at: '2026-10-18T08:00:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 8. Waiting for Customer (Held by Diana Lee, Customer Emily)
  {
    id: 8,
    subject: 'Cannot add secondary admin to workspace',
    description: 'The invitation link expires immediately after clicking for user dev@emilycorp.com.',
    priority: 'medium',
    status: { value: 'waiting_for_customer', label: 'Waiting for Customer' },
    customer: { id: 12, name: 'Emily Davis' },
    agent: { id: 4, name: 'Diana Lee (Agent)' },
    created_at: '2026-10-19T15:00:00Z',
    updated_at: '2026-10-20T11:00:00Z',
    last_activity_at: '2026-10-20T11:00:00Z',
    replies: [
      {
        id: 109,
        body: 'Could you please try regenerating the invite with an extended expiration from the Team Settings menu?',
        author: { id: 4, name: 'Diana Lee (Agent)', role: 'agent' },
        created_at: '2026-10-20T11:00:00Z',
      },
    ],
    status_history: [
      {
        id: 214,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 12, name: 'Emily Davis' },
        created_at: '2026-10-19T15:00:00Z',
      },
      {
        id: 215,
        from: { value: 'open', label: 'Open' },
        to: { value: 'in_progress', label: 'In Progress' },
        changed_by: { id: 4, name: 'Diana Lee (Agent)' },
        created_at: '2026-10-20T09:30:00Z',
      },
      {
        id: 216,
        from: { value: 'in_progress', label: 'In Progress' },
        to: { value: 'waiting_for_customer', label: 'Waiting for Customer' },
        changed_by: { id: 4, name: 'Diana Lee (Agent)' },
        created_at: '2026-10-20T11:00:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 4, name: 'Diana Lee (Agent)' },
        assigned_by: 4,
        assigned_at: '2026-10-20T09:30:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 9. Resolved (Held by Bob Smith, Customer David)
  {
    id: 9,
    subject: 'Custom domain SSL renewal failed',
    description: 'Our helpdesk CNAME domain cert expired over the weekend.',
    priority: 'high',
    status: { value: 'resolved', label: 'Resolved' },
    customer: { id: 13, name: 'David Wilson' },
    agent: { id: 3, name: 'Bob Smith (Agent)' },
    created_at: '2026-10-14T08:00:00Z',
    updated_at: '2026-10-14T11:00:00Z',
    last_activity_at: '2026-10-14T11:00:00Z',
    replies: [
      {
        id: 110,
        body: 'LetsEncrypt certificate renewed and propagated across all Cloudflare edge nodes.',
        author: { id: 3, name: 'Bob Smith (Agent)', role: 'agent' },
        created_at: '2026-10-14T11:00:00Z',
      },
    ],
    status_history: [
      {
        id: 217,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 13, name: 'David Wilson' },
        created_at: '2026-10-14T08:00:00Z',
      },
      {
        id: 218,
        from: { value: 'open', label: 'Open' },
        to: { value: 'resolved', label: 'Resolved' },
        changed_by: { id: 3, name: 'Bob Smith (Agent)' },
        created_at: '2026-10-14T11:00:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 3, name: 'Bob Smith (Agent)' },
        assigned_by: 3,
        assigned_at: '2026-10-14T08:30:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 10. In Progress (Assigned by Admin Sarah Jenkins to Bob Smith, Customer Sophia)
  {
    id: 10,
    subject: 'Email notification template localization in Spanish',
    description: 'Our Latin America operations require Spanish translation for automated customer ticket updates.',
    priority: 'low',
    status: { value: 'in_progress', label: 'In Progress' },
    customer: { id: 14, name: 'Sophia Martinez' },
    agent: { id: 3, name: 'Bob Smith (Agent)' },
    created_at: '2026-10-16T10:00:00Z',
    updated_at: '2026-10-18T16:00:00Z',
    last_activity_at: '2026-10-18T16:00:00Z',
    replies: [
      {
        id: 111,
        body: 'Admin Sarah assigned this ticket to Bob Smith for internationalization templates review.',
        author: { id: 1, name: 'Sarah Jenkins (Admin)', role: 'admin' },
        created_at: '2026-10-17T09:00:00Z',
      },
      {
        id: 112,
        body: 'I have prepared the Spanish localization strings and will submit them for PR merge today.',
        author: { id: 3, name: 'Bob Smith (Agent)', role: 'agent' },
        created_at: '2026-10-18T16:00:00Z',
      },
    ],
    status_history: [
      {
        id: 219,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 14, name: 'Sophia Martinez' },
        created_at: '2026-10-16T10:00:00Z',
      },
      {
        id: 220,
        from: { value: 'open', label: 'Open' },
        to: { value: 'in_progress', label: 'In Progress' },
        changed_by: { id: 1, name: 'Sarah Jenkins (Admin)' },
        created_at: '2026-10-17T09:00:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 3, name: 'Bob Smith (Agent)' },
        assigned_by: 1,
        assigned_at: '2026-10-17T09:00:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 11. Open & Unassigned
  {
    id: 11,
    subject: 'Data export job stuck at 99% progress',
    description: 'Triggered a full customer data export yesterday evening, but the status is still showing in progress.',
    priority: 'high',
    status: { value: 'open', label: 'Open' },
    customer: { id: 10, name: 'Alice Johnson' },
    agent: null,
    created_at: '2026-10-21T05:00:00Z',
    updated_at: '2026-10-21T05:00:00Z',
    last_activity_at: '2026-10-21T05:00:00Z',
    replies: [],
    status_history: [
      {
        id: 221,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 10, name: 'Alice Johnson' },
        created_at: '2026-10-21T05:00:00Z',
      },
    ],
    assignments: [],
  },

  // 12. Resolved (Customer Michael)
  {
    id: 12,
    subject: 'Update primary account billing address',
    description: 'We relocated our headquarters to Austin, TX. Need to update tax registration address on file.',
    priority: 'low',
    status: { value: 'resolved', label: 'Resolved' },
    customer: { id: 11, name: 'Michael Chen' },
    agent: { id: 2, name: 'Alex Rivera (Agent)' },
    created_at: '2026-10-10T11:00:00Z',
    updated_at: '2026-10-11T14:00:00Z',
    last_activity_at: '2026-10-11T14:00:00Z',
    replies: [
      {
        id: 113,
        body: 'Billing address has been updated in Stripe and our ERP records.',
        author: { id: 2, name: 'Alex Rivera (Agent)', role: 'agent' },
        created_at: '2026-10-11T14:00:00Z',
      },
    ],
    status_history: [
      {
        id: 222,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 11, name: 'Michael Chen' },
        created_at: '2026-10-10T11:00:00Z',
      },
      {
        id: 223,
        from: { value: 'open', label: 'Open' },
        to: { value: 'resolved', label: 'Resolved' },
        changed_by: { id: 2, name: 'Alex Rivera (Agent)' },
        created_at: '2026-10-11T14:00:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 2, name: 'Alex Rivera (Agent)' },
        assigned_by: 2,
        assigned_at: '2026-10-10T12:00:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 13. Waiting for Customer (Customer Alice)
  {
    id: 13,
    subject: 'Slack integration bot not posting ticket alerts',
    description: 'Our #support-alerts channel stopped receiving incoming webhook events after recent app upgrade.',
    priority: 'medium',
    status: { value: 'waiting_for_customer', label: 'Waiting for Customer' },
    customer: { id: 10, name: 'Alice Johnson' },
    agent: { id: 3, name: 'Bob Smith (Agent)' },
    created_at: '2026-10-20T10:00:00Z',
    updated_at: '2026-10-20T14:00:00Z',
    last_activity_at: '2026-10-20T14:00:00Z',
    replies: [
      {
        id: 114,
        body: 'Please verify if the Slack OAuth token has the channels:write scope authorized.',
        author: { id: 3, name: 'Bob Smith (Agent)', role: 'agent' },
        created_at: '2026-10-20T14:00:00Z',
      },
    ],
    status_history: [
      {
        id: 224,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 10, name: 'Alice Johnson' },
        created_at: '2026-10-20T10:00:00Z',
      },
      {
        id: 225,
        from: { value: 'open', label: 'Open' },
        to: { value: 'waiting_for_customer', label: 'Waiting for Customer' },
        changed_by: { id: 3, name: 'Bob Smith (Agent)' },
        created_at: '2026-10-20T14:00:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 3, name: 'Bob Smith (Agent)' },
        assigned_by: 3,
        assigned_at: '2026-10-20T10:30:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 14. In Progress (Held by Alex Rivera, Customer David)
  {
    id: 14,
    subject: 'Slow search query responses during peak traffic',
    description: 'Searching for tickets with broad keywords takes 5-8 seconds to render.',
    priority: 'medium',
    status: { value: 'in_progress', label: 'In Progress' },
    customer: { id: 13, name: 'David Wilson' },
    agent: { id: 2, name: 'Alex Rivera (Agent)' },
    created_at: '2026-10-20T08:00:00Z',
    updated_at: '2026-10-20T12:00:00Z',
    last_activity_at: '2026-10-20T12:00:00Z',
    replies: [
      {
        id: 115,
        body: 'We are optimizing full-text index shards for faster prefix matching.',
        author: { id: 2, name: 'Alex Rivera (Agent)', role: 'agent' },
        created_at: '2026-10-20T12:00:00Z',
      },
    ],
    status_history: [
      {
        id: 226,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 13, name: 'David Wilson' },
        created_at: '2026-10-20T08:00:00Z',
      },
      {
        id: 227,
        from: { value: 'open', label: 'Open' },
        to: { value: 'in_progress', label: 'In Progress' },
        changed_by: { id: 2, name: 'Alex Rivera (Agent)' },
        created_at: '2026-10-20T09:00:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 2, name: 'Alex Rivera (Agent)' },
        assigned_by: 2,
        assigned_at: '2026-10-20T09:00:00Z',
        unassigned_at: null,
      },
    ],
  },

  // 15. Resolved (Held by Diana Lee, Customer Sophia)
  {
    id: 15,
    subject: 'Two-factor authentication device reset',
    description: 'Customer lost access to authenticator app on old phone.',
    priority: 'high',
    status: { value: 'resolved', label: 'Resolved' },
    customer: { id: 14, name: 'Sophia Martinez' },
    agent: { id: 4, name: 'Diana Lee (Agent)' },
    created_at: '2026-10-18T10:00:00Z',
    updated_at: '2026-10-18T14:30:00Z',
    last_activity_at: '2026-10-18T14:30:00Z',
    replies: [
      {
        id: 116,
        body: 'Identity verified through emergency security questions. Temporary recovery key generated and sent via encrypted SMS.',
        author: { id: 4, name: 'Diana Lee (Agent)', role: 'agent' },
        created_at: '2026-10-18T14:30:00Z',
      },
    ],
    status_history: [
      {
        id: 228,
        from: null,
        to: { value: 'open', label: 'Open' },
        changed_by: { id: 14, name: 'Sophia Martinez' },
        created_at: '2026-10-18T10:00:00Z',
      },
      {
        id: 229,
        from: { value: 'open', label: 'Open' },
        to: { value: 'resolved', label: 'Resolved' },
        changed_by: { id: 4, name: 'Diana Lee (Agent)' },
        created_at: '2026-10-18T14:30:00Z',
      },
    ],
    assignments: [
      {
        agent: { id: 4, name: 'Diana Lee (Agent)' },
        assigned_by: 4,
        assigned_at: '2026-10-18T11:00:00Z',
        unassigned_at: null,
      },
    ],
  },
];
