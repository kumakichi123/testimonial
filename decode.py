import pathlib
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
text = pathlib.Path(r'app/tokushoho/page.tsx').read_text(encoding='utf-8')

def fix(s: str) -> str:
    return s.encode('cp932', 'ignore').decode('utf-8', 'ignore')

for match in re.findall(r"'([^']*)'", text):
    print(f"{match} -> {fix(match)}")
