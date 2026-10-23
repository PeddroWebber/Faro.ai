import type {ReactNode} from 'react';
export function Notice({children,error=false}:{children:ReactNode;error?:boolean}){return <div className={'notice '+(error?'error':'')} role={error?'alert':'status'}><span aria-hidden="true">{error?'!':'✓'}</span><div>{children}</div></div>}
