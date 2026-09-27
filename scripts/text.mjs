import {createHash} from 'node:crypto';

export const normalizeEol = text => text.replace(/\r\n/g, '\n');

export const contentHash = text => createHash('sha256')
  .update(normalizeEol(text))
  .digest('hex')
  .slice(0, 10);
