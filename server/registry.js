import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuid } from 'uuid';
const data = new Map(); const sites = new Map(); const logMap = new Map();
const domain = () => process.env.BASE_DOMAIN || 'trama';
const safe = (value) => value.toLowerCase().replace(/\.zip$/i, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0,  fifty()) || 'site';
function fifty(){ return 50; }
export const registry = {
 create(input){ const existing = data.get(input.id); const name = existing?.siteName || (() => { let n=safe(input.originalFilename), i=0; while(sites.has(n)) n=`${safe(input.originalFilename)}-${++i}`; return n; })(); const d={...existing,...input,siteName:name,publicUrl:`https://${name}.${domain()}`,createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()}; data.set(input.id,d); logMap.set(input.id,[]); this.log(input.id, 'Uploading files...'); return d; },
 get(id){ return data.get(id); }, list(userId){ return [...data.values()].filter(d=>d.userId===userId).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)); },
 update(id, patch){ const d=data.get(id); if(!d)return; Object.assign(d,patch,{updatedAt:new Date().toISOString()}); data.set(id,d); },
 log(id,message,level='info'){ const list=logMap.get(id)||[]; list.push({message,level,createdAt:new Date().toISOString()}); logMap.set(id,list); }, logs(id){ return logMap.get(id)||[]; },
 fail(id,message,error){ this.update(id,{status:'Failed',errorMessage:message}); this.log(id, message, 'error'); if(error) console.error(error); },
 site(name){ const d=[...data.values()].find(x=>x.siteName===name && x.status==='Live'); return d && {name:d.siteName,hostname:new URL(d.publicUrl).hostname,deploymentId:d.id,status:d.status,publicUrl:d.publicUrl}; },
 async remove(id){ const d=data.get(id); if(d?.deploymentPath) await fs.rm(d.deploymentPath,{recursive:true,force:true}); if(d) sites.delete(d.siteName); data.delete(id); logMap.delete(id); }
};
