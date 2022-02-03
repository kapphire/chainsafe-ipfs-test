#! /usr/bin/env node

const { program } = require('commander')
const add = require('./command/add')
const show = require('./command/show')

program
    .command('add <path>')
    .description('add file to ipfs and store the CID to ethereum network')
    .action(add)

program
    .command('show')
    .description('show CID')
    .action(show)

program.parse()