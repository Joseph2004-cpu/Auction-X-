# AuctionX Platform Security Architecture & Guidelines

## 🛡 Defense-in-Depth Principles

The AuctionX platform enforces strict server-side authoritative controls. Client input is treated as untrusted until verified against server rules.

---

## 🔒 Core Security Controls

### 1. Password Hashing (Argon2id)
Passwords are hashed using `Argon2id` with:
- **Memory Cost**: 64 MB (`2^16`)
- **Time Cost**: 3 iterations
- **Parallelism**: 1 thread

### 2. Concurrency-Safe Bids (`SELECT ... FOR UPDATE`)
All bidding transactions are executed inside PostgreSQL database transactions utilizing row-level locks (`SELECT * FROM auctions WHERE id = $1 FOR UPDATE`). This guarantees that concurrent bids submitted within milliseconds are serialized without race conditions, lost updates, or duplicate winners.

### 3. Session & JWT Management
- **Access Tokens**: Short-lived (15 minutes), signed with high-entropy JWT secrets, stored in `HttpOnly`, `SameSite=Lax` cookies.
- **Refresh Token Rotation**: Used refresh tokens are automatically revoked upon renewal to protect against token replay attacks.

### 4. Rate Limiting
- **Global API**: 300 requests / 15 mins
- **Authentication**: 15 attempts / 15 mins (5 failed logins trigger 15-minute account lockout)
- **Bidding Engine**: 60 bids / minute per IP

### 5. Multi-Factor Authentication (2FA)
- Implements Time-based One-Time Password (TOTP) algorithm (RFC 6238).
- Backup recovery codes for account recovery.

### 6. Audit Logging & Security Event Scoring
- All state-changing operations create append-only audit records in `audit_logs`.
- Failed authentication, unauthorized access attempts, and self-bidding attempts trigger risk score increments in `security_events`.
