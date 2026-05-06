import sys, json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text())
try:
    content = Path('graphify-out/.graphify_detect_utf8.json').read_text(encoding='utf-8-sig')
    detection = json.loads(content)
except Exception:
    detection = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-16'))
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text())

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

# LABELS
labels = {
    0: "Service Fleet Management",
    1: "Security & Auth Config",
    2: "Frontend Routing & Protection",
    3: "Core System Rationale",
    4: "Authentication API",
    5: "Telemetry Engine",
    6: "Service Persistence",
    7: "Telemetry Persistence",
    8: "User Persistence",
    9: "Theme & Global State",
    10: "Dashboard Logic",
    11: "Application Entrypoint",
    12: "Data Transfer Objects",
    13: "Fleet Models",
    14: "Telemetry Models",
    15: "User Models",
    16: "Visual Effects",
    17: "Navigation UI",
    18: "UI Components",
    19: "Utility Functions",
    20: "Home Page",
    21: "Project Identity",
    22: "Tooling Config",
    23: "Styling Config",
    24: "Build Config",
    25: "Redux Auth Slice",
    26: "Redux Fleet Slice",
    27: "Redux Store Config",
    28: "Auth Portal Semantic",
    29: "Brand Assets"
}

# Regenerate questions with real community labels
questions = suggest_questions(G, communities, labels)

report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}))
print('Report updated with community labels')
