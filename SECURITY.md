# Security Policy

## Supported Versions

Only the latest major release receives security updates.

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅ Yes    |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please disclose it responsibly by emailing the maintainers at:

> **security-contact**: open a [private security advisory](https://github.com/AminZibayi/Gantt/security/advisories/new) on GitHub.

### What to Include

Please provide as much of the following information as possible to help us understand and address the issue quickly:

- **Type of vulnerability** (e.g., XSS, code injection, information disclosure).
- **Affected component** and version.
- **Step-by-step instructions** to reproduce the issue.
- **Proof-of-concept** or exploit code (if applicable).
- **Impact assessment** — what can an attacker achieve?

### Response Timeline

| Stage                          | Timeline                                                  |
| ------------------------------ | --------------------------------------------------------- |
| Initial acknowledgement        | Within **48 hours**                                       |
| Triage and severity assessment | Within **5 business days**                                |
| Fix development                | Depends on severity (critical: ≤ 7 days, high: ≤ 14 days) |
| Public disclosure              | After a fix is released and users have time to update     |

## Security Best Practices

When integrating this library into your application:

- Always sanitize user-supplied task text before passing it to `gantt.parse()`.
- Set a strict [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) header.
- Keep the library updated to receive security patches.
- Avoid running the library in a privileged execution context.
