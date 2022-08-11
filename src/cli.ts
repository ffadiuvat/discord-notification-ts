#!/usr/bin/env node

import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// config dotenv
dotenv.config();

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .commandDir('cmd')
  .strict().alias({
    h: 'help',
  })
  .argv;

process.on('SIGTERM', () => {
  console.log('terminating process ...');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('terminating process ...');
  process.exit(1);
});
