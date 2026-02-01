# Limitations & Future Roadmap

## 1. Email Notifications
**Limitation**: The system does not currently send email notifications (e.g., on task assignment).
**Reason**: **Time Constraints**. Implementing a reliable transactional email service (like SendGrid or AWS SES) and setting up background job queues was out of scope for the MVP.
**Improvement**: Integrate a Redis-based message queue (BullMQ) to process email delivery asynchronously.

## 2. Refresh Tokens
**Limitation**: Authentication relies on simple, long-lived JWTs.
**Reason**: **Time Constraints**. Implementing a secure dual-token system (Access + Refresh tokens) with secure cookie handling adds significant complexity.
**Improvement**: Shift to HTTP-Only Refresh Cookies with short-lived Access Tokens for better security and session management.

## 3. Real-Time Collaboration
**Limitation**: Updates are not pushed to other clients in real-time (requires refresh).
**Reason**: No WebSocket implementation.
**Improvement**: Add `Socket.io` to broadcast events to organization-specific rooms.
