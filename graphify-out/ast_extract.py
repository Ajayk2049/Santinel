import sys, json
from graphify.extract import _extract_single_file, _resolve_cross_file_imports
from pathlib import Path

try:
    content = Path('graphify-out/.graphify_detect_utf8.json').read_text(encoding='utf-8-sig')
    detect = json.loads(content)
except Exception:
    detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-16'))

code_files = [Path(f) for f in detect.get('files', {}).get('code', [])]

nodes, edges = [], []
if code_files:
    for idx, path in enumerate(code_files):
        try:
            # _extract_single_file takes (args) where args is (index, path_str, cache_root_str)
            _, res = _extract_single_file((idx, str(path), "."))
            nodes.extend(res.get('nodes', []))
            edges.extend(res.get('edges', []))
            print(f'Processed {path.name}')
        except Exception as e:
            print(f'Error processing {path.name}: {e}')

    # Resolve cross-file imports (optional but good)
    try:
        _resolve_cross_file_imports(nodes, edges)
    except Exception as e:
        print(f'Error resolving imports: {e}')

    result = {'nodes': nodes, 'edges': edges, 'input_tokens': 0, 'output_tokens': 0}
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps(result, indent=2))
    print(f'AST: {len(nodes)} nodes, {len(edges)} edges')
else:
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps({'nodes':[],'edges':[],'input_tokens':0,'output_tokens':0}))
    print('No code files - skipping AST extraction')
