"""Read-only public static-resource audit. No cookies, credentials or bodies saved."""
import concurrent.futures, hashlib, json, mimetypes, re
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
from datetime import datetime, timezone
import requests

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).parent
BASES = {'pages': 'https://taipei-tax-lab.github.io/taipei-rental-tax-guide/', 'official': 'https://services.arpa.tpctax.dof.gov.taipei/rentaltax/'}
HEADERS = ['content-type','content-length','content-encoding','content-security-policy','access-control-allow-origin','cache-control','etag','last-modified','x-content-type-options','strict-transport-security','x-frame-options','age','vary','date']
def sha(b): return hashlib.sha256(b).hexdigest()
def refs(text):
    vals = re.findall(r'''(?:src|href|srcset)\s*=\s*["']([^"']+)''', text, re.I)
    vals += re.findall(r'''url\(\s*["']?([^)'"\s]+)''', text)
    vals += re.findall(r'''["']((?:\./|https://)[^"'\s<>]+\.(?:png|webp|svg|jpg|css|js)(?:\?[^"'\s<>]*)?)["']''', text)
    return [v.split()[0] for v in vals if not v.startswith(('data:', '#', 'mailto:', 'tel:'))]
cache = {}
def fetch(url):
    try:
        r = requests.get(url, timeout=35)
        record = {'url':url, 'status':r.status_code, 'final_url':r.url, 'redirects':[{'status':h.status_code,'url':h.url} for h in r.history], 'bytes_decoded':len(r.content), 'sha256_decoded':sha(r.content), 'headers':{h:r.headers[h] for h in HEADERS if h in r.headers}, 'looks_html':r.content.lstrip().lower().startswith((b'<!doctype html',b'<html'))}
        return record, r.content
    except Exception as e: return {'url':url,'status':None,'error':type(e).__name__}, b''

def main():
    manifest=[]
    candidates = [ROOT/'index.html', ROOT/'favicon.svg', ROOT/'hero-v2.png', ROOT/'hero-v2.webp', ROOT/'.nojekyll'] + sorted((ROOT/'assets').rglob('*'))
    localtexts = '\n'.join(p.read_text('utf-8') for p in candidates if p.is_file() and p.suffix in ('.html','.js','.css','.svg'))
    reference_paths=set()
    for label,base in BASES.items():
        record,body=fetch(base); cache[base]=(record,body)
        todo={base}
        for val in refs(body.decode('utf-8',errors='replace')):
            u=urljoin(base,val)
            if urlsplit(u).netloc==urlsplit(base).netloc and urlsplit(u).path.startswith(urlsplit(base).path): todo.add(u)
            elif any(host in urlsplit(u).netloc for host in ('gstatic.com','googleapis.com','googletagmanager.com','fonts.google')): todo.add(u)
        # All local public candidates tested too, including dynamically constructed six-state images.
        todo.update(urljoin(base,p.relative_to(ROOT).as_posix()) for p in candidates if p.is_file())
        seen=set()
        while todo-seen:
            batch=sorted(todo-seen); seen.update(batch)
            with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
                for u,result in zip(batch,pool.map(fetch,batch)):
                    cache[u]=result
                    rec,b=result
                    if rec.get('status')==200 and ('.css' in urlsplit(u).path or '.js' in urlsplit(u).path or u==base):
                        for val in refs(b.decode('utf-8',errors='replace')):
                            # JS DOM src literals resolve against document, CSS url() against CSS.
                            dest=urljoin(base if '.js' in urlsplit(u).path else u,val)
                            if urlsplit(dest).netloc==urlsplit(base).netloc and urlsplit(dest).path.startswith(urlsplit(base).path) and re.search(r'\.(?:html|css|js|json|png|webp|svg|jpe?g|woff2?)(?:\?|$)',dest):
                                todo.add(dest); reference_paths.add(unquote(urlsplit(dest).path[len(urlsplit(base).path):]))
        print(label,len(seen),'resources',flush=True)
    for p in candidates:
        if not p.is_file(): continue
        rel=p.relative_to(ROOT).as_posix()
        referenced=rel in reference_paths or rel in localtexts or (rel.startswith('assets/images/assistant/assistant-') and p.suffix in ('.png','.webp'))
        manifest.append({'path':rel,'bytes':p.stat().st_size,'sha256':sha(p.read_bytes()),'type':mimetypes.guess_type(rel)[0] or 'application/octet-stream','referenced':referenced,'reference_basis':'HTML/CSS/JS literal or constructed assistant state; candidates include unused fallback assets'})
    records=[]
    for u,(r,b) in sorted(cache.items()):
        for label,base in BASES.items():
            if u.startswith(base):
                r['site']=label; rel=unquote(urlsplit(u).path[len(urlsplit(base).path):]) or 'index.html'
                r['relative_path']=rel
                p=ROOT/rel
                if p.is_file():
                    r['equals_local_bytes']=sha(b)==sha(p.read_bytes())
                    if p.suffix in ('.html','.css','.js','.svg'): r['equals_local_normalized_eol']=b.replace(b'\r\n',b'\n')==p.read_bytes().replace(b'\r\n',b'\n')
        records.append(r)
    (OUT/'deployment-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),'utf-8')
    (OUT/'http-resources.json').write_text(json.dumps({'tested_at':datetime.now(timezone.utc).isoformat(),'method':'GET; TLS verified; response bodies/cookies omitted; decoded-byte hashes','resources':records},ensure_ascii=False,indent=2),'utf-8')
    print('failures',[(r.get('site'),r.get('relative_path',r['url']),r['status']) for r in records if r.get('status')!=200],flush=True)
if __name__=='__main__': main()
