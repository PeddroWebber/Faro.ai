export function Brand(){return <div className="brand" aria-label="Faro IA"><svg width="32" height="36" viewBox="0 0 42 46" fill="none" aria-hidden="true"><path d="M11 37V10H32M11 25H25" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="32" cy="35" r="4" fill="currentColor"/></svg><span>faro<span style={{color:'var(--accent)'}}>.</span></span><span style={{fontSize:11,letterSpacing:'.02em',background:'var(--peach)',padding:'5px 6px',borderRadius:6,alignSelf:'center',color:'var(--accent-dark)'}}>IA</span></div>;}
export function Mascot({pose='front'}:{pose?:'front'|'happy'|'wave'}){
 const assets = import.meta.glob('../assets/faro/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
 const source=assets[`../assets/faro/${pose}.png`];
 const description=pose==='happy'?'Faro, cão laranja de olhos verdes com bandana verde F., sorrindo.':pose==='wave'?'Faro, cão laranja de olhos verdes com bandana verde F., acenando.':'Faro, cão laranja sentado com peito creme, olhos verdes e bandana verde F.';
 return <img className={`mascot mascot-${pose}`} src={source} alt={description} loading="lazy"/>;
}
