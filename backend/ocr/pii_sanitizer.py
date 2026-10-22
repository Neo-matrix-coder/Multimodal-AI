"""
PII Sanitizer for Indian Legal & Commercial Documents

Detects and redacts sensitive Personally Identifiable Information (PII) 
prior to external API transmission, ensuring compliance with privacy requirements.
"""

import re
from typing import Tuple, Dict, Any

# Indian Vehicle Registration Number regex: e.g. DL 01 AB 1234, MH-12-CD-5678, HR26DQ5555
VEHICLE_NUM_REGEX = re.compile(
    r"\b([A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4})\b",
    re.IGNORECASE
)

# Indian 10-digit mobile phone numbers with optional +91 / 0 prefix
PHONE_REGEX = re.compile(
    r"(?:\+91[\-\s]?)?[6-9]\d{9}\b"
)

# Indian Aadhaar number (12 digits, often in 4-4-4 format)
AADHAAR_REGEX = re.compile(
    r"\b[2-9]\d{3}[\s\-]?\d{4}[\s\-]?\d{4}\b"
)

# Indian PAN Card Number: 5 uppercase letters, 4 digits, 1 uppercase letter
PAN_REGEX = re.compile(
    r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b"
)

# Email address
EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
)


def mask_vehicle_number(match: re.Match) -> str:
    raw = match.group(1).strip()
    # Keep state code and last 2 digits, mask the rest
    if len(raw) >= 6:
        state = raw[:2].upper()
        last = raw[-2:]
        return f"{state}-XX-XXXX-{last}"
    return "[VEHICLE_REG_REDACTED]"


def mask_phone_number(match: re.Match) -> str:
    raw = match.group(0).strip()
    digits = re.sub(r"\D", "", raw)
    if len(digits) >= 10:
        return f"+91-XXXXX-{digits[-4:]}"
    return "[PHONE_REDACTED]"


def mask_aadhaar(match: re.Match) -> str:
    raw = match.group(0).strip()
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 12:
        return f"XXXX-XXXX-{digits[-4:]}"
    return "[AADHAAR_REDACTED]"


def mask_pan(match: re.Match) -> str:
    raw = match.group(0).strip()
    if len(raw) == 10:
        return f"{raw[:2]}XXXXX{raw[-2:]}"
    return "[PAN_REDACTED]"


def mask_email(match: re.Match) -> str:
    raw = match.group(0).strip()
    parts = raw.split("@")
    if len(parts) == 2:
        name, domain = parts
        masked_name = name[0] + "***" if len(name) > 1 else "*"
        return f"{masked_name}@{domain}"
    return "[EMAIL_REDACTED]"


def sanitize_pii(text: str) -> Tuple[str, Dict[str, Any]]:
    """
    Sanitizes personal identifiers from document text.
    Returns:
        sanitized_text: The scrubbed string safe for cloud LLMs.
        report: Dict detailing which PII categories were detected & redacted.
    """
    if not text:
        return "", {"redacted_count": 0, "categories": []}

    redacted_categories = []
    count = 0

    def record_and_sub(pattern, repl_func, cat_name, current_text):
        nonlocal count, redacted_categories
        matches = list(pattern.finditer(current_text))
        if matches:
            count += len(matches)
            if cat_name not in redacted_categories:
                redacted_categories.append(cat_name)
            return pattern.sub(repl_func, current_text)
        return current_text

    sanitized = text
    sanitized = record_and_sub(VEHICLE_NUM_REGEX, mask_vehicle_number, "Vehicle Registration", sanitized)
    sanitized = record_and_sub(PHONE_REGEX, mask_phone_number, "Phone Number", sanitized)
    sanitized = record_and_sub(AADHAAR_REGEX, mask_aadhaar, "Aadhaar / ID Number", sanitized)
    sanitized = record_and_sub(PAN_REGEX, mask_pan, "PAN Number", sanitized)
    sanitized = record_and_sub(EMAIL_REGEX, mask_email, "Email Address", sanitized)

    report = {
        "redacted_count": count,
        "categories": redacted_categories,
        "protected": count > 0,
        "privacy_notice": "Personal Identifiable Information (PII) masked locally before analysis."
    }

    return sanitized, report
