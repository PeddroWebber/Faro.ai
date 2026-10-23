import type {ButtonHTMLAttributes} from 'react';
export function Button({variant='primary',className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'quiet'}){return <button className={'btn '+(variant==='primary'?'':variant)+' '+className} {...props}/>;}
