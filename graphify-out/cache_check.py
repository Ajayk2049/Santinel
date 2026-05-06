import json
from graphify.cache import check_semantic_cache
from pathlib import Path

# Try reading with utf-8-sig to handle BOM
try:
    content = Path('graphify-out/.graphify_detect_utf8.json').read_text(encoding='utf-8-sig')
    detect = json.loads(content)
except Exception as e:
    # Fallback to the original file which might be UTF-16
    detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-16'))

all_files = [f for files in detect['files'].values() for f in files]

cached_nodes, cached_edges, cached_hyperedges, uncached = check_semantic_cache(all_files)

if cached_nodes or cached_edges or cached_hyperedges:
    Path('graphify-out/.graphify_cached.json').write_text(json.dumps({'nodes': cached_nodes, 'edges': cached_edges, 'hyperedges': cached_hyperedges}))
else:
    Path('graphify-out/.graphify_cached.json').write_text(json.dumps({'nodes': [], 'edges': [], 'hyperedges': []}))

Path('graphify-out/.graphify_uncached.txt').write_text('\n'.join(uncached))
print(f'Cache: {len(all_files)-len(uncached)} files hit, {len(uncached)} files need extraction')
