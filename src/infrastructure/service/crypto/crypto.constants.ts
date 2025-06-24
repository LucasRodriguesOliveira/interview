import { scryptSync } from 'node:crypto';

export const KEY = scryptSync(
    '321aaa13-7747-4dbb-bd49-972fd7268211',
    'salt',
    32,
  );
export const IV = scryptSync('iv-salt', 'salt', 16);
export const ALGORITHM = 'aes-256-cbc';