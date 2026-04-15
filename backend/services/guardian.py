import re
from typing import List, Dict

class GuardianScanner:
    """The silent sentinel that prevents accidental secret leaks."""
    
    PATTERNS = {
        "AWS Key": r"AKIA[0-9A-Z]{16}",
        "Generic Secret": r"(?i)(key|secret|password|token)[-._ ]*[:=][-._ ]*['\"]([a-zA-Z0-9+/=]{16,})['\"]",
        "OpenAI Key": r"sk-[a-zA-Z0-9]{48}",
        "Google API Key": r"AIza[0-9A-Za-z-_]{35}",
        "Private Key": r"-----BEGIN (RSA|OPENSSH|PGP) PRIVATE KEY-----",
    }

    @classmethod
    def scan_file(cls, filename: str, content: str) -> List[Dict]:
        """Scans a single file's content for sensitive information."""
        findings = []
        lines = content.splitlines()
        
        for line_num, line in enumerate(lines, 1):
            for name, pattern in cls.PATTERNS.items():
                if re.search(pattern, line):
                    findings.append({
                        "file": filename,
                        "line": line_num,
                        "type": name,
                        "snippet": line.strip()[:50] + "..." # Masked snippet
                    })
        return findings

    @classmethod
    def scan_project(cls, files_data: Dict[str, str]) -> Dict:
        """
        Scans a dictionary of {filename: content}.
        Returns {"is_safe": bool, "findings": list}
        """
        all_findings = []
        for filename, content in files_data.items():
            findings = cls.scan_file(filename, content)
            all_findings.extend(findings)
        
        return {
            "is_safe": len(all_findings) == 0,
            "findings": all_findings
        }
