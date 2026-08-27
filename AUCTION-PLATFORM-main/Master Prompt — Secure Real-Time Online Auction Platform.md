# MASTER SOFTWARE DEVELOPMENT PROMPT
## Build a Secure, Real-Time Online Auction Marketplace From Scratch to Production

You are a senior software architect, full-stack engineer, DevSecOps engineer, database engineer, UI/UX designer, QA engineer, and cybersecurity specialist.

Your task is to **design, develop, test, secure, document, and prepare for deployment a complete production-ready online auction marketplace**.

The platform will allow users to register as buyers and/or sellers. Sellers can create auction listings, buyers can participate in auctions and place bids in real time, the system automatically tracks bids and auction status, and the highest valid bidder at the end of an auction becomes the winner.

Administrators must have a secure management dashboard where they can manage users, listings, auctions, reports, disputes, payments, suspicious activity, and platform configuration.

Do not create a simple demonstration, mockup, static website, or prototype.

Build the system as a **real full-stack application with a production-oriented architecture, secure authentication, persistent database, real-time bidding, authorization, validation, audit logging, automated auction processing, notifications, testing, monitoring, and deployment configuration.**

---

# 1. PRODUCT OBJECTIVE

Build an online marketplace called:

**[AUCTION PLATFORM NAME]**

The platform should function similarly to a professional online auction marketplace.

Core workflow:

1. A user creates an account.
2. The user verifies their account.
3. The user can become a seller.
4. The seller creates an auction listing.
5. The listing goes through validation/moderation where required.
6. The auction becomes active at its scheduled start time.
7. Buyers view the item.
8. Buyers place bids.
9. Other connected users see bid updates in real time.
10. The platform validates every bid on the server.
11. The highest valid bid becomes the current winning bid.
12. The auction countdown continues.
13. When the auction reaches its ending condition, bidding is permanently closed.
14. The system determines the winner.
15. The winner and seller receive notifications.
16. Payment/checkout becomes available.
17. The seller fulfills the order.
18. The buyer confirms receipt.
19. The transaction is completed.
20. Users can leave ratings/reviews where applicable.
21. Disputes can be opened.
22. Administrators can investigate and resolve disputes.
23. Every important operation is recorded in an audit trail.

---

# 2. DEVELOPMENT PRINCIPLES

Follow these principles throughout development:

- Security first.
- Server-side validation is authoritative.
- Never trust the browser/client.
- Never trust data received from WebSocket connections.
- Never trust prices or bid amounts supplied by the frontend.
- Never expose secrets in frontend code.
- Never store plaintext passwords.
- Never expose sensitive database information through APIs.
- Use least-privilege authorization.
- Use transactions for financially or competitively sensitive operations.
- Design for concurrent bids.
- Make important operations idempotent.
- Prevent duplicate requests from causing duplicate transactions.
- Use UTC internally for timestamps.
- Display dates/times according to the user's timezone.
- Use secure HTTP headers.
- Implement rate limiting.
- Implement comprehensive logging.
- Implement monitoring and alerting.
- Follow OWASP security principles.
- Separate development, staging, and production environments.
- Keep secrets in environment variables or a dedicated secrets manager.
- Never hard-code API keys, database passwords, JWT secrets, payment secrets, or private credentials.
- Never commit `.env` files or secrets to Git.

---

# 3. USER ROLES

Implement a robust role and permission system.

## Guest

Guests can:

- Browse auctions.
- Search listings.
- Filter listings.
- View auction details.
- View seller public profiles.
- Register.
- Log in.

Guests cannot:

- Place bids.
- Create listings.
- Access private user information.
- Access account pages.
- Access administration features.

## Buyer

Buyers can:

- Browse auctions.
- Search auctions.
- Save/favorite items.
- Follow auctions.
- Place bids.
- View bidding history for auctions they are authorized to see.
- Receive notifications.
- View won auctions.
- Pay for won items.
- View order history.
- Open disputes.
- Contact sellers through controlled platform messaging.
- Manage their profile.
- Manage security settings.

## Seller

Sellers can:

- Create listings.
- Upload item images.
- Configure auction settings.
- Schedule auctions.
- View active bids.
- View auction analytics.
- Manage their listings.
- Communicate with winners.
- View completed sales.
- Manage fulfillment.
- Receive seller notifications.
- Respond to disputes.

A seller must not be able to manipulate bids or auction results.

## Moderator

Moderators can:

- Review listings.
- Approve/reject listings.
- Review reported content.
- Suspend problematic listings.
- Investigate suspicious activity.

Moderators should not automatically have access to financial secrets or unrestricted system administration.

## Administrator

Administrators can:

- Manage users.
- Suspend users.
- Manage roles.
- Manage listings.
- Manage auctions.
- Investigate bids.
- Review audit logs.
- Manage disputes.
- Manage reports.
- Configure platform settings.
- Review payment issues.
- Manage categories.
- View security alerts.
- Manage moderation policies.

Use granular permissions rather than relying only on a single `isAdmin` boolean.

---

# 4. FRONTEND APPLICATION

Build a responsive modern frontend.

The interface should work correctly on:

- Desktop.
- Laptop.
- Tablet.
- Mobile phones.

Recommended frontend architecture:

- React
- TypeScript
- Next.js or another production-grade React framework
- Tailwind CSS or an equivalent maintainable design system
- Accessible UI components
- WebSocket client for real-time auction updates

The architecture should be modular and maintainable.

Organize the application into reusable components.

---

# 5. PUBLIC PAGES

Create:

## Home Page

Include:

- Featured auctions.
- Ending soon.
- Recently added auctions.
- Popular categories.
- Search bar.
- Call-to-action for selling.
- Registration/login.
- Platform information.
- Trust/security information.

## Auction Marketplace

Include:

- Search.
- Categories.
- Price filters.
- Auction status.
- Ending soon.
- Newly listed.
- Seller rating.
- Location where appropriate.
- Sorting.

## Auction Details Page

Display:

- Item title.
- High-quality images.
- Description.
- Seller information.
- Seller rating.
- Current highest bid.
- Number of bids.
- Minimum next bid.
- Auction start time.
- Auction end time.
- Live countdown.
- Bid input.
- Bid button.
- Bid history where appropriate.
- Shipping information.
- Terms.
- Item condition.
- Watch/favorite button.
- Report listing button.

The current bid must update without requiring the user to refresh the page.

---

# 6. SELLER SYSTEM

Create a complete seller dashboard.

Dashboard sections:

- Overview.
- Create auction.
- Draft auctions.
- Pending approval.
- Active auctions.
- Ending soon.
- Completed auctions.
- Sold items.
- Unsold items.
- Orders.
- Payments.
- Disputes.
- Notifications.
- Profile.
- Security.

## Create Auction

Fields should include:

- Item title.
- Description.
- Category.
- Subcategory.
- Condition.
- Starting price.
- Minimum bid increment.
- Optional reserve price.
- Auction start date/time.
- Auction end date/time.
- Shipping options.
- Pickup options.
- Item location at an appropriate level of precision.
- Return policy.
- Terms.
- Images.

Validate every field on both:

1. Frontend.
2. Backend.

The backend must always be authoritative.

---

# 7. IMAGE AND FILE SECURITY

Implement secure file uploads.

Requirements:

- Validate MIME type.
- Validate file extension.
- Validate file signature where practical.
- Restrict file size.
- Restrict number of uploaded files.
- Generate server-side filenames.
- Never trust user-provided filenames.
- Store uploads outside the application source directory.
- Prefer object storage such as S3-compatible storage.
- Generate optimized thumbnails.
- Strip dangerous metadata where appropriate.
- Prevent executable files from being uploaded.
- Use signed URLs for private assets where necessary.
- Apply access controls.
- Scan uploads for malware where practical.

Never directly expose arbitrary filesystem paths.

---

# 8. AUCTION ENGINE

The auction engine is one of the most important parts of the application.

Design it as a dedicated backend service/module.

Each auction should have states such as:

```text
DRAFT
PENDING_REVIEW
SCHEDULED
ACTIVE
ENDING
ENDED
CANCELLED
SUSPENDED
SETTLED
DISPUTED
```

Implement strict state transitions.

For example:

```text
DRAFT → PENDING_REVIEW
PENDING_REVIEW → SCHEDULED
SCHEDULED → ACTIVE
ACTIVE → ENDED
ENDED → SETTLED
```

Do not allow unauthorized or invalid state transitions.

---

# 9. BIDDING ENGINE

Bidding must happen through the backend.

Never determine the winner using frontend JavaScript.

When a user submits a bid:

1. Authenticate the user.
2. Authorize the user.
3. Verify the auction exists.
4. Verify the auction is active.
5. Verify the auction has not expired.
6. Verify the user is eligible to bid.
7. Verify the user is not the seller.
8. Verify the user is not blocked/suspended.
9. Validate the bid amount.
10. Validate currency.
11. Validate minimum increment.
12. Check auction rules.
13. Lock or serialize the relevant auction/bid operation.
14. Re-read the latest auction state.
15. Compare the proposed bid against the current valid bid.
16. Accept or reject the bid atomically.
17. Record the bid.
18. Update auction state.
19. Record an audit event.
20. Publish the new auction state through the real-time system.
21. Trigger notifications.

The entire critical bidding operation must be protected against race conditions.

---

# 10. CONCURRENT BIDDING

The system must correctly handle multiple people bidding at almost exactly the same time.

For example:

Buyer A submits:

```text
$100
```

Buyer B simultaneously submits:

```text
$105
```

The backend must not incorrectly accept both as the winning bid.

Use appropriate database transactions and concurrency controls such as:

- Row-level locking.
- Serializable transactions where necessary.
- Atomic updates.
- Unique constraints.
- Server-side timestamps.
- Optimistic concurrency controls where appropriate.

Never rely on JavaScript timers or frontend state to determine who won.

---

# 11. BID INCREMENTS

Allow each auction to define a minimum bid increment.

Example:

Current bid:

```text
$100
```

Minimum increment:

```text
$5
```

Next valid bid:

```text
$105
```

Reject:

```text
$101
```

Return a clear error such as:

```text
Your bid must be at least $105.
```

---

# 12. OPTIONAL PROXY/AUTOMATIC BIDDING

Design the architecture so that automatic bidding can be supported.

A buyer can specify a maximum amount.

Example:

Current price:

```text
$100
```

Buyer maximum:

```text
$300
```

The system automatically bids on behalf of the buyer only as necessary according to the auction's configured increment.

Do not expose the buyer's maximum bid to other users.

The maximum bid must be stored securely and never returned through public APIs.

---

# 13. COUNTDOWN TIMER

Implement an accurate auction countdown.

Do not rely solely on:

```javascript
setInterval()
```

for authoritative timing.

The backend must provide authoritative auction timestamps.

The frontend may calculate/display the remaining time, but the server decides whether bidding is still allowed.

Display:

```text
2d 05h 42m 17s
```

As the auction approaches the end:

```text
ENDING SOON
```

When it expires:

```text
AUCTION ENDED
```

The backend must automatically finalize expired auctions even if nobody is viewing the page.

Use a reliable background worker/job system.

---

# 14. AUCTION ENDING

Implement a server-side auction finalization process.

When an auction ends:

1. Stop accepting bids.
2. Verify the auction has truly expired.
3. Determine the highest valid bid.
4. Determine the winning bidder.
5. Update the auction state atomically.
6. Create a winning record.
7. Create an order if applicable.
8. Notify the winner.
9. Notify the seller.
10. Record the event in the audit log.
11. Trigger payment workflow.
12. Prevent further bidding.

Make finalization idempotent so the process can safely retry without creating duplicate winners/orders.

---

# 15. OPTIONAL ANTI-SNIPING FEATURE

Allow the platform to support configurable auction extensions.

Example:

If someone places a valid bid within the final 30 seconds, extend the auction by 2 minutes.

This should be configurable per auction/platform.

The backend must perform the extension atomically.

The frontend countdown must immediately reflect the new ending time.

---

# 16. REAL-TIME ARCHITECTURE

Implement real-time auction updates using:

- WebSockets.
- Socket.IO.
- Server-Sent Events where appropriate.

When a valid bid is accepted, connected clients watching that auction should receive:

- New current bid.
- Bid count.
- New minimum bid.
- Updated countdown/end time if extended.
- Auction status.
- Relevant notifications.

Example event:

```text
auction.bid.accepted
```

Never broadcast private information such as:

- User email.
- Password.
- Payment information.
- Private maximum proxy bid.
- Internal security information.

---

# 17. WEBSOCKET SECURITY

WebSocket connections must be authenticated and authorized.

Implement:

- Authentication during connection.
- Authorization for subscriptions.
- Rate limiting.
- Connection limits.
- Message validation.
- Payload size limits.
- Origin validation where appropriate.
- Automatic disconnect for abusive clients.
- Server-side validation of every event.
- Protection against event injection.
- Protection against unauthorized auction subscriptions.

A user must not be able to subscribe to private administrative channels merely by guessing a channel name.

---

# 18. DATABASE DESIGN

Use a relational database such as:

- PostgreSQL.

Create properly normalized tables.

At minimum include:

```text
users
roles
permissions
user_roles
categories
listings
listing_images
auctions
bids
proxy_bids
watchlists
favorites
orders
payments
shipments
notifications
disputes
dispute_messages
reports
reviews
audit_logs
security_events
sessions
refresh_tokens
password_reset_tokens
email_verification_tokens
```

Add appropriate indexes and foreign keys.

Use database constraints to prevent invalid states.

---

# 19. IMPORTANT DATABASE RELATIONSHIPS

Example:

```text
User
 ├── Listings
 ├── Bids
 ├── Orders
 ├── Notifications
 ├── Disputes
 ├── Reviews
 └── Watchlists

Listing
 └── Auction

Auction
 ├── Bids
 ├── Watchers
 └── Winner

Order
 ├── Payment
 ├── Shipment
 └── Dispute
```

Do not duplicate important data unnecessarily.

Use foreign keys and appropriate cascading rules.

Be careful with deletion of financial/audit records.

Prefer soft deletion where legal/business requirements require historical preservation.

---

# 20. MONEY AND CURRENCY

Never use floating-point arithmetic for financial calculations.

Use:

```text
DECIMAL / NUMERIC
```

or integer minor units such as:

```text
1000 = GHS 10.00
```

Choose one consistent financial representation and document it.

Every monetary value should include its currency.

Never assume all auctions use one currency.

Prevent:

- Negative prices.
- Invalid decimal precision.
- Currency manipulation.
- Client-side price manipulation.

The backend must calculate the authoritative amount.

---

# 21. AUTHENTICATION

Implement secure authentication.

Support:

- Email/password registration.
- Login.
- Logout.
- Email verification.
- Password reset.
- Session management.
- Optional social login architecture.
- Two-factor authentication.

Passwords must be hashed using a modern password hashing algorithm such as:

```text
Argon2id
```

or another strong password hashing mechanism.

Never store plaintext passwords.

---

# 22. SESSION SECURITY

Use secure session/token architecture.

Protect against:

- Session fixation.
- Token theft.
- Token replay.
- CSRF where applicable.
- XSS.
- Credential stuffing.

Use:

- Secure cookies.
- HttpOnly cookies.
- SameSite settings.
- Short-lived access credentials where appropriate.
- Refresh-token rotation if using refresh tokens.
- Session revocation.
- Device/session management.

Do not store sensitive authentication tokens insecurely in browser storage without a strong architectural reason.

---

# 23. MULTI-FACTOR AUTHENTICATION

Allow users to enable MFA.

Support:

- TOTP authenticator applications.
- Backup recovery codes.

For sensitive operations, consider step-up authentication.

Examples:

- Changing email.
- Changing password.
- Changing MFA.
- Withdrawing money.
- High-risk account changes.
- Administrative actions.

---

# 24. AUTHORIZATION

Implement Role-Based Access Control.

Do not simply hide admin pages in the frontend.

Every protected API endpoint must verify authorization on the backend.

Example:

```text
GET /admin/users
```

must verify:

```text
authenticated
+
permission = users.read
```

Example:

```text
DELETE /listings/:id
```

must verify the requesting user owns the listing or has the required administrative permission.

---

# 25. API DESIGN

Create a versioned REST API or a clearly documented equivalent.

Example:

```text
/api/v1/auth/register
/api/v1/auth/login
/api/v1/auth/logout
/api/v1/auth/verify-email

/api/v1/users/me
/api/v1/users/me/security

/api/v1/listings
/api/v1/listings/:id

/api/v1/auctions
/api/v1/auctions/:id

/api/v1/auctions/:id/bids
/api/v1/auctions/:id/bids/history

/api/v1/watchlists

/api/v1/orders
/api/v1/payments

/api/v1/notifications

/api/v1/disputes

/api/v1/admin/users
/api/v1/admin/listings
/api/v1/admin/auctions
/api/v1/admin/disputes
/api/v1/admin/audit-logs
```

Document the API using OpenAPI/Swagger.

---

# 26. API SECURITY

Implement:

- Input validation.
- Schema validation.
- Authentication.
- Authorization.
- Rate limiting.
- Request size limits.
- Pagination.
- Filtering validation.
- Output encoding.
- Secure error handling.
- Request IDs.
- Logging.
- CORS configuration.
- Security headers.

Never return raw database errors to clients.

Bad:

```text
PostgresError: duplicate key constraint...
```

Good:

```text
This email address is already registered.
```

Detailed internal errors should be logged securely on the server.

---

# 27. INPUT VALIDATION

Validate every input.

Examples:

- Email.
- Username.
- Password.
- Prices.
- Dates.
- Auction IDs.
- User IDs.
- Search parameters.
- File uploads.
- Messages.
- Review text.

Use a schema validation library such as:

```text
Zod
```

or equivalent.

Never assume frontend validation is sufficient.

---

# 28. SQL INJECTION PROTECTION

Never construct SQL queries using unsafe string concatenation.

Use:

- Parameterized queries.
- ORM/database query builders.
- Strict validation.

Example principle:

```text
NEVER:
SELECT * FROM users WHERE email = '${email}'
```

Use parameterized database operations instead.

---

# 29. XSS PROTECTION

User-generated content includes:

- Item descriptions.
- Reviews.
- Seller names.
- Messages.
- Dispute messages.

Treat all user-generated content as untrusted.

Implement:

- Output encoding.
- Sanitization.
- Content Security Policy.
- Safe rendering.
- No unsafe HTML injection.

Do not use dangerous HTML rendering unless content has been securely sanitized.

---

# 30. CSRF PROTECTION

For cookie-based authentication:

Implement appropriate CSRF protection.

Use:

- SameSite cookies.
- CSRF tokens where necessary.
- Origin/Referer validation where appropriate.

All state-changing operations must be protected.

---

# 31. RATE LIMITING

Implement rate limiting at multiple levels.

Examples:

Authentication:

```text
Login attempts per IP
Login attempts per account
Password reset requests
Verification requests
```

Bidding:

```text
Maximum bid requests per user
Maximum bid requests per IP
Maximum WebSocket messages
```

API:

```text
Requests per user/IP
```

Use Redis or an equivalent distributed rate-limiting store where appropriate.

---

# 32. BOT AND BID ABUSE PROTECTION

Design mechanisms to detect:

- Extremely rapid bidding.
- Automated bidding abuse.
- Multiple accounts manipulating auctions.
- Suspicious IP behavior.
- Account takeover patterns.
- Repeated failed authentication.
- Abnormal device behavior.

Do not automatically accuse users solely based on IP addresses.

Use risk scoring and allow administrators to investigate.

---

# 33. ANTI-FRAUD ARCHITECTURE

Create a fraud/risk engine that can assign a risk score.

Potential signals:

- Account age.
- Failed login activity.
- Unusual bidding frequency.
- Multiple accounts using suspicious patterns.
- Sudden account changes.
- Payment anomalies.
- Repeated disputes.
- Unusual device changes.

Store security events separately from normal application logs.

---

# 34. AUDIT LOGGING

Create immutable or append-only audit records for sensitive actions.

Record:

- Actor.
- Action.
- Resource.
- Timestamp.
- Request ID.
- IP address where appropriate.
- User agent where appropriate.
- Previous state where necessary.
- New state where necessary.

Examples:

```text
USER_SUSPENDED
LISTING_APPROVED
LISTING_REJECTED
BID_ACCEPTED
BID_REJECTED
AUCTION_ENDED
AUCTION_EXTENDED
DISPUTE_OPENED
DISPUTE_RESOLVED
PAYMENT_COMPLETED
PASSWORD_CHANGED
MFA_ENABLED
ROLE_CHANGED
```

Administrators must not be able to silently erase audit history through normal UI operations.

---

# 35. ADMIN DASHBOARD

Build a professional administration panel.

Dashboard should show:

- Total users.
- Active users.
- Suspended users.
- Active auctions.
- Auctions ending soon.
- Completed auctions.
- Total bids.
- Transactions.
- Open disputes.
- Reports.
- Security alerts.
- Suspicious activity.

---

# 36. ADMIN USER MANAGEMENT

Administrators can:

- Search users.
- View user profiles.
- View account status.
- Suspend users.
- Unsuspend users.
- Assign roles.
- Revoke sessions.
- Require password reset.
- Review security events.

Dangerous operations should require confirmation and be logged.

For high-risk actions, require administrator re-authentication.

---

# 37. LISTING MODERATION

Administrators/moderators can:

- Review pending listings.
- Approve listings.
- Reject listings.
- Request changes.
- Suspend listings.
- Remove prohibited listings.
- View listing reports.

Include moderation reasons.

Never allow a listing to be silently removed without an audit record.

---

# 38. DISPUTE SYSTEM

Create a complete dispute management system.

Buyer can open a dispute.

Seller can respond.

Admin can investigate.

Dispute categories could include:

```text
Item not received
Item significantly different from description
Damaged item
Payment problem
Seller issue
Buyer issue
Fraud concern
Other
```

Include:

- Evidence upload.
- Messages.
- Status.
- Timeline.
- Admin notes.
- Resolution.
- Refund/adjustment workflow where applicable.

Dispute states:

```text
OPEN
UNDER_REVIEW
WAITING_FOR_BUYER
WAITING_FOR_SELLER
RESOLVED
ESCALATED
CLOSED
```

---

# 39. NOTIFICATION SYSTEM

Implement notifications through:

- In-app notifications.
- Email.
- Optional SMS/push notifications.

Events include:

- Welcome.
- Email verification.
- Auction approved.
- Auction rejected.
- Bid accepted.
- Someone outbid you.
- Auction ending soon.
- You won.
- You lost.
- Payment required.
- Payment received.
- Shipment update.
- Dispute opened.
- Dispute updated.
- Dispute resolved.
- Security alert.

Notifications should be processed asynchronously where appropriate.

---

# 40. EMAIL SECURITY

Never put sensitive secrets in email.

Use secure links with:

- Random tokens.
- Expiration.
- One-time usage.
- Server-side validation.

Examples:

```text
Verify email
Reset password
Confirm sensitive action
```

Never put passwords or authentication secrets directly in emails.

---

# 41. PAYMENT ARCHITECTURE

Design a payment abstraction layer.

Do not tightly couple the entire application to one payment provider.

Support a structure such as:

```text
PaymentProvider
 ├── createPayment()
 ├── verifyPayment()
 ├── refundPayment()
 └── handleWebhook()
```

This allows future payment providers to be added.

For Ghana-focused deployment, design the architecture so providers such as Paystack or Mobile Money-compatible payment services can be integrated where appropriate.

Never trust a frontend payment-success response.

Payment status must be confirmed server-to-server.

---

# 42. PAYMENT WEBHOOK SECURITY

Webhook endpoints must:

- Verify provider signatures.
- Validate event structure.
- Prevent replay attacks where supported.
- Be idempotent.
- Store event IDs.
- Reject invalid events.
- Log webhook processing.
- Never blindly trust request payloads.

Example:

```text
payment.completed
```

must not automatically mark an order as paid unless the payment provider's webhook/signature verification succeeds.

---

# 43. ORDER MANAGEMENT

After an auction is won:

Create an order containing:

- Buyer.
- Seller.
- Auction.
- Winning bid.
- Currency.
- Payment status.
- Shipping status.
- Order status.

Example statuses:

```text
AWAITING_PAYMENT
PAID
PROCESSING
SHIPPED
DELIVERED
COMPLETED
CANCELLED
DISPUTED
REFUNDED
```

---

# 44. SHIPPING

Create a flexible shipping architecture.

Support:

- Seller shipping.
- Buyer pickup.
- Delivery tracking.
- Shipping address.
- Shipping status.

Protect addresses and other personally identifiable information.

Only authorized parties should access private delivery information.

---

# 45. SEARCH

Implement efficient search.

Search by:

- Item title.
- Description.
- Category.
- Seller.
- Auction status.

Support filters:

- Minimum price.
- Maximum price.
- Ending soon.
- Category.
- Condition.
- Location where appropriate.
- Seller rating.

Use database indexes and, if necessary, Elasticsearch/OpenSearch later.

---

# 46. WATCHLIST

Users can:

- Add auctions to watchlist.
- Remove auctions.
- View watched auctions.
- Receive ending-soon notifications.

Prevent duplicate watchlist entries with a database uniqueness constraint.

---

# 47. REVIEWS AND RATINGS

After a completed transaction:

Buyer can rate seller.

Seller can optionally rate buyer.

Prevent:

- Multiple reviews for the same transaction.
- Reviews from users who were not involved in the transaction.
- Reviews before completion.

Implement moderation/reporting.

---

# 48. SECURITY HEADERS

Configure appropriate HTTP security headers.

Consider:

```text
Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

Configure CSP carefully based on actual application dependencies.

Do not blindly copy insecure CSP configurations.

---

# 49. HTTPS

Production must use HTTPS.

Redirect HTTP to HTTPS.

Use valid TLS certificates.

Do not send passwords, tokens, payment information, or private data over unencrypted HTTP.

---

# 50. SECRETS MANAGEMENT

Never place secrets in:

- GitHub.
- Frontend source code.
- JavaScript bundles.
- Database records unnecessarily.
- Screenshots.
- Documentation.

Use:

```text
.env
```

for local development and a proper secrets-management solution for production.

Include:

```text
.env.example
```

containing placeholders only.

---

# 51. ENVIRONMENT CONFIGURATION

Separate:

```text
development
staging
production
```

Example:

```text
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
SESSION_SECRET=
PAYMENT_SECRET=
EMAIL_API_KEY=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Never include real values in the repository.

---

# 52. BACKEND ARCHITECTURE

Use a maintainable architecture such as:

```text
Frontend
     |
API Gateway / Backend
     |
 ┌───┼───────────────┐
Auth Auction Orders Notifications
     |
 PostgreSQL
     |
 Redis
     |
Background Workers
```

Recommended backend components:

```text
API Server
Authentication Service
Auction Service
Bidding Service
Order Service
Payment Service
Notification Service
Moderation Service
Dispute Service
Background Worker
WebSocket Server
```

These may initially exist within one modular backend but should have clear service boundaries.

Do not prematurely create dozens of microservices if a modular monolith is more appropriate.

---

# 53. BACKGROUND JOB SYSTEM

Use a job queue such as:

```text
Redis + BullMQ
```

or an equivalent production-ready queue.

Jobs can include:

```text
FinalizeAuction
SendOutbidNotification
SendAuctionEndingNotification
ProcessPaymentWebhook
SendEmail
GenerateThumbnail
RunFraudCheck
ExpireTokens
CleanSessions
```

Jobs must be retryable and idempotent.

---

# 54. REDIS

Use Redis where appropriate for:

- Rate limiting.
- Caching.
- Job queues.
- Temporary session data.
- Real-time coordination.

Do not use Redis as the permanent source of truth for financial records or bids.

PostgreSQL should remain authoritative for auction/bid data.

---

# 55. DATABASE TRANSACTIONS

Use transactions for operations such as:

- Accepting a bid.
- Ending an auction.
- Selecting a winner.
- Creating an order.
- Processing payment state changes.
- Resolving disputes where multiple records must change together.

Ensure the system cannot enter a partially updated state.

---

# 56. DATA BACKUPS

Production database must have:

- Automated backups.
- Point-in-time recovery where supported.
- Backup retention policies.
- Encrypted backups.
- Backup monitoring.

Regularly test restoration.

A backup that has never been restored/tested should not be considered reliable.

---

# 57. LOGGING

Implement structured logging.

Log:

- Request ID.
- Timestamp.
- Endpoint.
- Status.
- Latency.
- Error category.
- User ID where appropriate.
- Security events.

Never log:

- Passwords.
- Authentication tokens.
- Payment card information.
- Private keys.
- Full sensitive personal data.

---

# 58. MONITORING

Add monitoring for:

- CPU.
- Memory.
- Database usage.
- Redis.
- API latency.
- Error rates.
- WebSocket connections.
- Queue failures.
- Failed payments.
- Auction worker failures.
- Suspicious authentication activity.

Set alerts for critical failures.

---

# 59. ERROR HANDLING

Create centralized error handling.

Use consistent API responses.

Example:

```json
{
  "success": false,
  "error": {
    "code": "BID_TOO_LOW",
    "message": "Your bid is below the minimum accepted amount."
  },
  "requestId": "..."
}
```

Do not reveal internal implementation details.

---

# 60. FRONTEND SECURITY

The frontend must:

- Avoid storing secrets.
- Sanitize user-generated content.
- Handle authentication safely.
- Handle expired sessions.
- Validate user input.
- Display safe error messages.
- Avoid exposing private API responses.
- Prevent unauthorized admin UI access.

Remember:

**Frontend restrictions are for user experience, not security.**

The backend must enforce everything important.

---

# 61. ADMIN SECURITY

Administrators are high-value targets.

Implement:

- Mandatory MFA.
- Strong passwords.
- Session expiration.
- Login rate limiting.
- IP/device anomaly detection where appropriate.
- Re-authentication for sensitive actions.
- Detailed audit logging.
- Separate administrative permissions.
- Optional IP allowlisting for high-security deployments.

Do not expose the admin dashboard through an unprotected public route.

---

# 62. SECURITY AGAINST COMMON ATTACKS

The application must be designed and tested against:

```text
SQL Injection
XSS
CSRF
Broken Access Control
IDOR
Authentication attacks
Session hijacking
Session fixation
Credential stuffing
Brute-force attacks
Rate-limit bypass
Replay attacks
WebSocket abuse
File upload attacks
Path traversal
Command injection
SSRF
Open redirects
Clickjacking
CORS misconfiguration
API abuse
Race conditions
Price manipulation
Bid manipulation
Auction manipulation
Privilege escalation
Mass assignment
Information leakage
```

Follow OWASP guidance and conduct a security review before production deployment.

---

# 63. IDOR / BROKEN ACCESS CONTROL

Never assume that knowing an ID gives permission.

For example:

```text
GET /api/v1/orders/123
```

must verify that the requesting user owns the order or has authorized administrative permission.

Do not rely solely on:

```text
if userId == URL userId
```

Build proper authorization policies.

---

# 64. MASS ASSIGNMENT PROTECTION

Never blindly accept entire request objects.

Bad:

```text
User.update(req.body)
```

Instead explicitly select permitted fields.

For example:

```text
allowed:
name
phone
profileImage
```

but never allow users to submit:

```text
role
isAdmin
accountStatus
balance
verified
```

unless specifically authorized.

---

# 65. AUCTION MANIPULATION PROTECTION

Prevent sellers from:

- Bidding on their own auctions.
- Artificially increasing prices.
- Editing bids.
- Deleting valid bids.
- Changing the winner.
- Changing auction end time without authorization.
- Changing starting price after bidding begins.

Any administrative override must be logged.

---

# 66. BID IMMUTABILITY

Once a valid bid is accepted, do not silently edit it.

If a bid must be invalidated by authorized staff due to fraud or policy violations:

- Mark it invalid/revoked.
- Record the reason.
- Record who performed the action.
- Record the timestamp.
- Preserve the original record.

Do not simply delete historical bid data.

---

# 67. TESTING

Create automated tests.

## Unit tests

Test:

- Bid validation.
- Auction state transitions.
- Bid increments.
- Winner determination.
- Proxy bidding.
- Currency calculations.
- Permission checks.

## Integration tests

Test:

- Authentication.
- Database operations.
- Bid transactions.
- Auction finalization.
- Notifications.
- Payments.

## End-to-end tests

Test:

```text
Register
Login
Create listing
Approve listing
Start auction
Place bid
Outbid
Auction ends
Winner selected
Payment
Order completion
Dispute
Admin resolution
```

---

# 68. CONCURRENCY TESTING

Specifically test multiple users bidding simultaneously.

Simulate:

```text
10 users
50 users
100 users
```

placing bids at nearly the same time.

Verify:

- No duplicate winners.
- No incorrect current bid.
- No lost bids.
- No invalid bid acceptance.
- Database remains consistent.
- Auction ends correctly.

---

# 69. SECURITY TESTING

Perform security testing including:

- Dependency scanning.
- Static analysis.
- Secret scanning.
- API security testing.
- Authentication testing.
- Authorization testing.
- Rate-limit testing.
- File upload testing.
- XSS testing.
- SQL injection testing.
- CSRF testing.
- WebSocket testing.
- Race-condition testing.

Where possible, integrate tools such as:

```text
OWASP ZAP
SAST tools
Dependency scanners
Secret scanners
Container scanners
```

Do not perform destructive penetration testing against third-party systems.

Only test infrastructure that you own or are explicitly authorized to test.

---

# 70. CI/CD

Create a CI/CD pipeline.

On every pull request:

```text
Install dependencies
Lint
Type-check
Run unit tests
Run integration tests
Run security/dependency checks
Build application
```

On approved production deployment:

```text
Build
Test
Create deployment artifact
Deploy
Run database migrations safely
Run health checks
Monitor
Rollback if necessary
```

---

# 71. DOCKER

Provide Docker support.

Create appropriate:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

Development environment may include:

```text
Frontend
Backend
PostgreSQL
Redis
```

Do not run production containers as root unless absolutely necessary.

Use minimal production images.

---

# 72. DEPLOYMENT ARCHITECTURE

Prepare the application for cloud deployment.

A production architecture could be:

```text
                    Internet
                       |
                    Cloudflare
                       |
                    HTTPS/WAF
                       |
                Load Balancer
                       |
             ┌─────────┴─────────┐
             |                   |
         App Server          App Server
             |                   |
             └─────────┬─────────┘
                       |
                 PostgreSQL
                       |
                    Redis
                       |
                 Job Workers
                       |
                 Object Storage
```

The exact infrastructure provider can be selected later.

Support deployment to platforms such as:

- AWS.
- Azure.
- Google Cloud.
- DigitalOcean.
- Railway.
- Render.
- Vercel for frontend where appropriate.

Choose the deployment strategy based on the architecture.

---

# 73. PRODUCTION NETWORK SECURITY

Where cloud infrastructure is used:

- Put databases in private networks where possible.
- Do not expose PostgreSQL publicly.
- Restrict firewall rules.
- Restrict Redis access.
- Use private service communication.
- Use HTTPS.
- Use a WAF where appropriate.
- Restrict administrative access.
- Use security groups/firewall rules.
- Rotate credentials.
- Monitor exposed services.

---

# 74. CLOUDFLARE / WAF

Where appropriate, place the public application behind a CDN/WAF such as Cloudflare.

Use it for:

- DNS.
- TLS.
- DDoS protection.
- WAF.
- Rate limiting.
- CDN caching.

Do not assume a CDN/WAF eliminates the need for application-level security.

---

# 75. DDoS AND ABUSE RESILIENCE

Design the system to degrade safely under excessive traffic.

Use:

- CDN.
- WAF.
- Rate limits.
- Connection limits.
- Queue-based processing.
- Caching.
- Autoscaling where appropriate.

Protect expensive endpoints especially:

```text
Search
Login
Bidding
File upload
Admin APIs
WebSocket connections
```

---

# 76. DATABASE PERFORMANCE

Add indexes for frequently queried fields such as:

```text
auction.status
auction.end_time
auction.start_time
auction.category_id
bid.auction_id
bid.user_id
listing.seller_id
order.buyer_id
order.seller_id
notification.user_id
```

Use query analysis before adding unnecessary indexes.

Avoid N+1 queries.

Implement pagination.

Never return thousands of records unnecessarily.

---

# 77. PAGINATION

All potentially large collections should be paginated.

Examples:

- Auctions.
- Bids.
- Users.
- Orders.
- Notifications.
- Audit logs.
- Disputes.

Prefer cursor-based pagination for large/high-frequency datasets where appropriate.

---

# 78. API DOCUMENTATION

Generate OpenAPI documentation.

Document:

- Authentication.
- Endpoints.
- Request bodies.
- Responses.
- Error codes.
- Authorization requirements.
- Rate limits.
- WebSocket events.

Include examples.

---

# 79. PROJECT STRUCTURE

Create a professional project structure.

Example:

```text
auction-platform/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   ├── types/
│   └── tests/
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── listings/
│   │   │   ├── auctions/
│   │   │   ├── bids/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── notifications/
│   │   │   ├── disputes/
│   │   │   ├── moderation/
│   │   │   └── admin/
│   │   │
│   │   ├── middleware/
│   │   ├── database/
│   │   ├── jobs/
│   │   ├── websocket/
│   │   ├── security/
│   │   └── config/
│   │
│   └── tests/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   ├── terraform/
│   └── deployment/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── security/
│   └── deployment/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

Adjust this structure according to the selected technology stack.

---

# 80. UI/UX REQUIREMENTS

Design a trustworthy marketplace interface.

The design should communicate:

- Security.
- Reliability.
- Transparency.
- Professionalism.

Use clear visual states:

```text
LIVE
ENDING SOON
SOLD
ENDED
CANCELLED
SUSPENDED
```

Make the current bid visually obvious.

Make the countdown prominent.

The bid button should clearly communicate the minimum valid bid.

Show clear feedback after every bid attempt.

---

# 81. ACCESSIBILITY

Follow WCAG accessibility principles.

Include:

- Keyboard navigation.
- Proper labels.
- Semantic HTML.
- Accessible form errors.
- Sufficient contrast.
- Focus states.
- Screen-reader support.
- Accessible countdown information.
- Accessible notifications.

Do not rely solely on color to communicate status.

---

# 82. RESPONSIVE DESIGN

Mobile users should be able to:

- Browse.
- Search.
- View auctions.
- Place bids.
- Receive notifications.
- Manage account.

The bidding interface should remain usable on small screens.

---

# 83. REAL-TIME USER EXPERIENCE

When another user places a bid:

Display something similar to:

```text
New highest bid: GHS 1,250
```

If the current user has been outbid:

```text
You have been outbid.
Minimum next bid: GHS 1,300
```

Do not reveal confidential bidder information.

---

# 84. DATA PRIVACY

Implement privacy-conscious design.

Only collect information required for platform operation.

Protect:

- Email.
- Phone.
- Address.
- Payment-related information.
- Identity information.
- Account security data.

Provide:

- Privacy policy.
- Terms of service.
- Account deletion workflow where legally appropriate.
- Data export/deletion mechanisms where applicable.

Do not expose private information in public auction pages.

---

# 85. SECURITY INCIDENT RESPONSE

Create a basic incident-response process.

When suspicious activity occurs:

1. Record the security event.
2. Assign a severity.
3. Alert administrators.
4. Investigate.
5. Contain the affected account/service.
6. Revoke sessions if required.
7. Preserve relevant audit logs.
8. Resolve the incident.
9. Document the incident.

---

# 86. HEALTH CHECKS

Create endpoints such as:

```text
/health
/ready
```

Health checks should verify appropriate dependencies.

Example:

```text
Application
Database
Redis
Queue
```

Do not expose sensitive internal information through public health endpoints.

---

# 87. GRACEFUL FAILURE

If Redis becomes unavailable:

- The application should fail safely.
- Do not accept bids if the architecture cannot guarantee bidding consistency.
- Do not silently continue with potentially inconsistent auction state.

If the database becomes unavailable:

- Return a controlled error.
- Do not falsely tell users their bid succeeded.

For financially important operations:

**Never report success unless the authoritative operation succeeded.**

---

# 88. OBSERVABILITY

Every important request should have a request/correlation ID.

Use it across:

```text
Frontend request
API
Database operation
Background job
Notification
Audit log
```

This makes debugging production incidents much easier.

---

# 89. SOURCE CONTROL

Use Git.

Recommended branches:

```text
main
develop
feature/*
fix/*
security/*
```

Use pull requests.

Require CI checks before merging.

Never commit:

```text
.env
private keys
API secrets
database passwords
production credentials
```

---

# 90. DOCUMENTATION

Create a comprehensive README.

Include:

- Project overview.
- Architecture.
- Features.
- Tech stack.
- Installation.
- Environment variables.
- Database setup.
- Local development.
- Testing.
- Docker.
- Deployment.
- Security.
- API documentation.
- WebSocket documentation.
- Troubleshooting.

Create separate security documentation.

---

# 91. SEED DATA

Create development seed data.

Include:

- Demo users.
- Demo seller.
- Demo auctions.
- Demo categories.
- Demo bids.

Never use real personal information.

Never include production credentials in seed data.

---

# 92. DEMO ADMIN ACCOUNT

If creating a demo administrator:

Use clearly fake credentials.

Force password change on first login.

Do not hard-code a real production admin account.

---

# 93. ENVIRONMENT VARIABLES

Generate:

```text
.env.example
```

with placeholders such as:

```text
DATABASE_URL=
REDIS_URL=
SESSION_SECRET=
JWT_SECRET=
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
```

Never place real credentials in the generated source code.

---

# 94. DEPLOYMENT CHECKLIST

Before production deployment, verify:

```text
Database backups enabled
HTTPS enabled
Secrets configured
Debug mode disabled
Secure cookies enabled
CORS configured
Rate limiting enabled
WAF configured
Security headers configured
Database not publicly exposed
Redis not publicly exposed
Admin MFA enabled
Logging enabled
Monitoring enabled
Alerts enabled
Payment webhooks verified
Email configured
Object storage secured
Automated tests passing
Security tests passing
Migration tested
Rollback procedure tested
Backup restoration tested
```

---

# 95. PRODUCTION SECURITY PRINCIPLE

The application should follow this fundamental rule:

**Assume every request is malicious until proven otherwise.**

Never trust:

- Browser input.
- Query parameters.
- Request bodies.
- Cookies.
- WebSocket messages.
- Uploaded files.
- User IDs.
- Bid amounts.
- Payment responses.
- Client-side timestamps.
- Frontend authorization state.

The server must independently verify all critical actions.

---

# 96. ACCEPTANCE CRITERIA

The application is not considered complete until all of the following work:

### Authentication

- Registration works.
- Email verification works.
- Login works.
- Logout works.
- Password reset works.
- MFA works.
- Sessions can be revoked.

### Auctions

- Seller can create auction.
- Listing can be moderated.
- Auction can be scheduled.
- Auction automatically starts.
- Auction accepts valid bids.
- Invalid bids are rejected.
- Countdown works.
- Auction automatically ends.
- Winner is selected correctly.

### Real-time

- New bids appear without refresh.
- Outbid notifications work.
- Countdown updates correctly.
- Auction ending state propagates to connected clients.

### Security

- Unauthorized users cannot access protected resources.
- Buyers cannot manipulate auction state.
- Sellers cannot manipulate bids.
- Users cannot access other users' private records.
- Admin functions are protected.
- Rate limiting works.
- Input validation works.
- File uploads are secured.
- Secrets are not exposed.

### Orders

- Winner receives order.
- Payment workflow works.
- Seller sees sale.
- Order status updates.
- Dispute workflow works.

### Administration

- Admin dashboard works.
- User management works.
- Listing moderation works.
- Auction management works.
- Disputes work.
- Audit logs work.
- Security events work.

---

# 97. DEVELOPMENT ORDER

Do not attempt to build everything randomly.

Implement in this order:

## Phase 1 — Architecture

Create:

- System architecture.
- Database schema.
- API specification.
- Security model.
- Permission model.
- Project structure.

## Phase 2 — Foundation

Build:

- Repository.
- Frontend.
- Backend.
- Database.
- Redis.
- Docker.
- Environment configuration.
- CI pipeline.

## Phase 3 — Authentication

Build:

- Registration.
- Login.
- Verification.
- Password reset.
- Sessions.
- MFA.

## Phase 4 — Marketplace

Build:

- Categories.
- Listings.
- Images.
- Search.
- Seller profiles.

## Phase 5 — Auction Engine

Build:

- Auction creation.
- Scheduling.
- Auction states.
- Bid engine.
- Bid history.
- Countdown.
- Automatic ending.

## Phase 6 — Real-Time

Build:

- WebSockets.
- Live bid updates.
- Outbid notifications.
- Live auction state.

## Phase 7 — Orders and Payments

Build:

- Winner workflow.
- Orders.
- Payment integration.
- Webhooks.
- Shipping.

## Phase 8 — Notifications

Build:

- Email.
- In-app notifications.
- Auction alerts.

## Phase 9 — Administration

Build:

- Admin dashboard.
- Moderation.
- User management.
- Disputes.
- Audit logs.
- Security monitoring.

## Phase 10 — Security Hardening

Perform:

- OWASP review.
- Authentication review.
- Authorization review.
- API security testing.
- Race-condition testing.
- WebSocket testing.
- Dependency scanning.
- Secret scanning.

## Phase 11 — Performance

Perform:

- Load testing.
- Concurrent bidding testing.
- Database optimization.
- WebSocket scaling tests.

## Phase 12 — Deployment

Configure:

- Production environment.
- HTTPS.
- Database.
- Redis.
- Object storage.
- Workers.
- Monitoring.
- Backups.
- WAF.

## Phase 13 — Final Verification

Run the complete end-to-end test suite.

Do not declare the application production-ready until critical security and consistency tests pass.

---

# 98. IMPORTANT IMPLEMENTATION RULE FOR AI BUILDERS

If you are an AI coding agent or AI application builder, **do not generate the entire application as one giant unstructured file.**

Build it incrementally.

Before writing major code:

1. Define the architecture.
2. Define the database schema.
3. Define API contracts.
4. Define authentication.
5. Define authorization.
6. Define auction state machine.
7. Define bidding transaction logic.
8. Define real-time events.
9. Define security controls.
10. Then implement each module.

After implementing each major module:

- Run tests.
- Check types.
- Check linting.
- Review security.
- Fix errors.
- Continue to the next module.

Do not replace working code with placeholders.

Do not create fake API responses where real functionality is required.

Do not use hard-coded auction results.

Do not simulate successful payments.

Do not fake real-time bidding.

---

# 99. FINAL SECURITY REQUIREMENT

This platform will process user accounts, competitive bidding, potentially valuable goods, and potentially financial transactions.

Therefore, treat it as a security-sensitive production application.

The goal is not to make the application "impossible to hack" because no internet-connected application can honestly guarantee that.

Instead, build it according to **defense-in-depth principles** so that:

- An individual frontend manipulation does not compromise the auction.
- A stolen session has limited usefulness.
- Invalid bids cannot become winning bids.
- Race conditions cannot corrupt auction state.
- Unauthorized users cannot access private resources.
- Payment confirmations cannot be forged through the frontend.
- Malicious uploads cannot execute server-side.
- Database attacks are mitigated.
- Automated abuse is rate-limited.
- Administrative actions are heavily protected.
- Security events are detected and logged.
- Backups allow recovery.
- Monitoring detects failures.
- Infrastructure is isolated.
- Secrets are protected.
- Security patches can be applied quickly.

---

# 100. FINAL DELIVERABLE

Produce a complete production-oriented repository containing:

```text
Frontend
Backend
Database schema
Database migrations
Seed scripts
Authentication
Authorization
Auction engine
Bidding engine
Proxy bidding architecture
Real-time WebSocket system
Countdown system
Notifications
Orders
Payment abstraction
Dispute system
Admin dashboard
Audit logging
Security logging
Rate limiting
File upload security
Automated tests
Docker configuration
CI/CD configuration
API documentation
Environment template
Security documentation
Deployment documentation
README
```

The final application must be:

**Secure, scalable, responsive, maintainable, testable, observable, production-oriented, and deployable.**

Most importantly, **auction results and financial/business-critical decisions must always be determined by the secure backend and database—not by the frontend.**

Build the application from the ground up as if it will eventually serve thousands or millions of users and handle simultaneous bids during high-demand auctions.