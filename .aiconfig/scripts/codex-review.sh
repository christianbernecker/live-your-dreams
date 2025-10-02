#!/bin/bash
# Codex Review Script - nur bei +Codex Prefix
# Verwendet: gpt-5-codex mit adaptivem Reasoning (tendiert zu medium/high)

set -e

# Argumente
USER_TASK="${1:-No user task provided}"
CLAUDE_CHANGES="${2:-$(git diff HEAD~1)}"

# Codex CLI Call
codex exec --model gpt-5-codex --full-auto << EOF
DEEP CODE REVIEW

User Task:
${USER_TASK}

Claude Code Änderungen:
${CLAUDE_CHANGES}

Review-Kriterien:
1. Architecture & Design Patterns
2. Security Vulnerabilities
3. Performance Bottlenecks
4. Edge Cases & Error Handling
5. Code Quality & Maintainability
6. Breaking Changes
7. Technical Debt

Gib strukturiertes Feedback mit:
- Kritische Issues (Must-Fix)
- Verbesserungsvorschläge (Should-Fix)
- Optionale Optimierungen (Nice-to-Have)

Nutze adaptive Reasoning - sei gründlich bei komplexen Änderungen.
EOF
