"""Text Autopsy: stdin JSON {"text": "..."} -> stdout JSON report.

Run directly:  echo '{"text":"hello chaos"}' | python tools/py_analyze.py
"""
import json
import math
import re
import sys
from collections import Counter


def analyse(text: str) -> dict:
    words = re.findall(r"[A-Za-z']+", text.lower())
    counts = Counter(words)
    total = max(1, len(words))
    entropy = -sum((n / total) * math.log2(n / total) for n in counts.values())
    sentences = max(1, len(re.findall(r"[.!?]+", text)))
    return {
        "chars": len(text),
        "words": len(words),
        "unique": len(counts),
        "entropy": round(entropy, 2),
        "reading_seconds": round(len(words) / 3.3, 1),
        "avg_sentence": round(len(words) / sentences, 1),
        "top": counts.most_common(3),
    }


def main() -> int:
    raw = sys.stdin.read() or "{}"
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as error:
        print(json.dumps({"status": "error", "message": str(error)}))
        return 1
    text = str(payload.get("text", ""))[:20000]
    print(json.dumps(analyse(text)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
