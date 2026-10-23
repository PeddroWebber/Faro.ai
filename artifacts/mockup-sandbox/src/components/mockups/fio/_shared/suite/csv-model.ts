export function parseCSV(text:string):{rows:string[][];error:string}{
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell.trim());cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell.trim());if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)return {rows:[],error:'Aspas sem fechamento. Corrija o CSV antes de continuar.'};
 row.push(cell.trim());if(row.some(Boolean))rows.push(row);return {rows,error:''};
}
export function validateCSV(text:string,knownEmails:string[]){
 const parsed=parseCSV(text.replace(/^\uFEFF/,'')),headers=parsed.rows[0]?.map(h=>h.toLowerCase())||[],required=['nome','empresa','tipo','email','valor'],missing=required.filter(h=>!headers.includes(h));
 const blocking=parsed.error||(!headers.length?'Cole ou selecione um CSV.':missing.length?`Colunas obrigatórias ausentes: ${missing.join(', ')}.`:new Set(headers).size!==headers.length?'Há nomes de colunas duplicados. Use cada coluna uma única vez.':parsed.rows.length<2?'O CSV contém apenas o cabeçalho. Inclua ao menos um registro.':parsed.rows.length>201?'Limite de 200 linhas neste demo.':new TextEncoder().encode(text).length>100000?'Conteúdo acima de 100 KB. Reduza a amostra.':'');
 const seen=new Set(knownEmails.map(e=>e.trim().toLowerCase()).filter(Boolean));
 const rows=parsed.rows.slice(1).map((cells,i)=>{const value=(key:string)=>cells[headers.indexOf(key)]??'';const email=value('email').toLowerCase();
 const err=cells.length!==headers.length?'Colunas inconsistentes':!value('nome')||!value('empresa')?'Nome/empresa ausente':!['B2B','B2C'].includes(value('tipo'))?'Tipo inválido':!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?'E-mail inválido':!value('valor').trim()||!Number.isFinite(Number(value('valor')))||Number(value('valor'))<0?'Valor inválido':seen.has(email)?'Duplicado':'';
 if(!err)seen.add(email);
 return {id:i,name:value('nome'),company:value('empresa'),type:value('tipo'),email,value:Number(value('valor')),err};});
 return {rows,blocking};
}
