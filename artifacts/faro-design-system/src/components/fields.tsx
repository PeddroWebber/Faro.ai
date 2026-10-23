import {useId,type InputHTMLAttributes,type TextareaHTMLAttributes} from 'react';
export function Input({label,help,...props}:InputHTMLAttributes<HTMLInputElement>&{label:string;help?:string}){const id=useId();return <label htmlFor={id}>{label}<input {...props} id={id} className="input" aria-describedby={help?id+'-help':undefined}/>{help&&<small id={id+'-help'}>{help}</small>}</label>}
export function Textarea({label,...props}:TextareaHTMLAttributes<HTMLTextAreaElement>&{label:string}){const id=useId();return <label htmlFor={id}>{label}<textarea {...props} id={id} className="input"/></label>}
