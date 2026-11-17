const titles=['書表下載','填寫範例'];
export function validateForms(groups) {
 if(!Array.isArray(groups)||groups.length!==2)throw Error('Two form groups required');
 const urls=[];
 groups.forEach((g,i)=>{if(g.title!==titles[i]||g.forms?.length!==2)throw Error('Invalid form group');g.forms.forEach(f=>{if(typeof f.title!=='string'||!f.title.trim())throw Error('Missing form title');const formats=i?['PDF']:['ODT','PDF'];if(JSON.stringify(f.files?.map(x=>x.format))!==JSON.stringify(formats))throw Error('Invalid formats');for(const file of f.files){const u=file.href; if(typeof u!=='string'||!( /^https:\/\/[^\s\\]+$/.test(u)||/^\.\/assets\/forms\/[a-zA-Z0-9_-]+\.(pdf|odt)$/.test(u)))throw Error('Unsafe form URL');if(u.startsWith('https:')){const parsed=new URL(u);if(!parsed.hostname||parsed.username||parsed.password||parsed.hash||/(?:^|\/)\.\.(?:\/|$)/.test(decodeURIComponent(u)))throw Error('Unsafe form URL');}if(!u.endsWith('.'+file.format.toLowerCase()))throw Error('Format mismatch');urls.push(u);}});});if(new Set(urls).size!==6)throw Error('Six unique form links required');return groups;
}
