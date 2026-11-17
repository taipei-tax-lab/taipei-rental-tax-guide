// Read-only public download verification. Binary buffers stay in memory, never Git.
import fs from 'node:fs';
import {inflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
assert.notEqual(process.env.NODE_TLS_REJECT_UNAUTHORIZED,'0','TLS verification must remain enabled');
const groups=JSON.parse(fs.readFileSync(new URL('../site/media.json',import.meta.url))).applicationForms;
const sizes={'house-use-change.odt':37559,'house-use-change.pdf':157541,'rental-tax-reduction.odt':45917,'rental-tax-reduction.pdf':234755,'house-use-change-example.pdf':171460,'rental-tax-reduction-example.pdf':189913};
function zipEntry(buffer,wanted){
 const end=buffer.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]));assert.ok(end>=0);
 let pos=buffer.readUInt32LE(end+16);
 for(let i=0;i<buffer.readUInt16LE(end+10);i++){
  assert.equal(buffer.readUInt32LE(pos),0x02014b50);
  const method=buffer.readUInt16LE(pos+10),size=buffer.readUInt32LE(pos+20),nameLength=buffer.readUInt16LE(pos+28),extra=buffer.readUInt16LE(pos+30),comment=buffer.readUInt16LE(pos+32),offset=buffer.readUInt32LE(pos+42);
  const name=buffer.subarray(pos+46,pos+46+nameLength).toString();
  if(name===wanted){assert.equal(buffer.readUInt32LE(offset),0x04034b50);const start=offset+30+buffer.readUInt16LE(offset+26)+buffer.readUInt16LE(offset+28);const data=buffer.subarray(start,start+size);assert.ok(method===0||method===8);return (method===0?data:inflateRawSync(data)).toString();}
  pos+=46+nameLength+extra+comment;
 }
 throw Error('Missing ODT entry '+wanted);
}
const rows=[];
for(const group of groups)for(const form of group.forms)for(const file of form.files){
 const url=new URL(file.href);assert.equal(url.origin,'https://pub-76044a38a6644fc4b5c9d71e06f58b81.r2.dev');
 const response=await fetch(url,{redirect:'error'});assert.equal(response.status,200);
 const data=Buffer.from(await response.arrayBuffer()),name=url.pathname.slice(1);assert.equal(data.length,sizes[name]);
 if(file.format==='PDF')assert.equal(data.subarray(0,4).toString(),'%PDF');
 else {assert.equal(data.readUInt32LE(0),0x04034b50);assert.equal(zipEntry(data,'mimetype'),'application/vnd.oasis.opendocument.text');assert.ok(zipEntry(data,'content.xml').includes('office:document-content'));}
 rows.push({url:url.href,status:response.status,bytes:data.length,mime:response.headers.get('content-type'),sha256:createHash('sha256').update(data).digest('hex'),signature:true,odtStructure:file.format==='ODT'?true:undefined});
}
const out='.preview/forms/public.json';fs.mkdirSync('.preview/forms',{recursive:true});fs.writeFileSync(out,JSON.stringify({normalTLS:true,authenticated:false,rows},null,2));console.log('PASS: six anonymous public HTTPS downloads, exact sizes, PDF signatures and ODT ZIP mimetype/content; no originals saved.');
