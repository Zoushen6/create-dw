#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'

import prompts from "prompts";

import { red, green, bold } from 'kleur/colors'

import { postOrderDirectoryTraverse } from './utils/directoryTraverse'

import renderTemplate from './utils/renderTemplate'

import getCommand from './utils/getCommand'

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }

  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file),
  )
}

async function init() {

  const defaultProjectName = 'dw-project'

  let targetDir: string;

  const quesTions = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'dw-project',
      onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName),
    },
  ];

  let result: {
    projectName?: string
  } = {}

  try {
    result = await prompts(quesTions);
    // console.log(result);
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }

  const { projectName } = result

  const cwd = process.cwd()
  const root = path.join(cwd, projectName)

  // const targetDir1 = process.argv.slice(2)
  // console.log('cwd：' + cwd);
  // console.log('process.argv： ' + targetDir1);
  if (fs.existsSync(root)) {
    console.log('Directory is exists');
    process.exit(1)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\npreparing ${root}... `);
  
  const pkg = { name: projectName, version: '0.0.0' }
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

  // console.log(__dirname);
  // const templateRoot = new URL('./template', import.meta.url).pathname
  const templateRoot = path.resolve(__dirname, 'template')
  // console.log(path.resolve(templateRoot, 'base')); 
  
  const callbacks = []
  const render = function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName) // __dirname/template/config/**
    renderTemplate(templateDir, root, callbacks)
  }

  render('base')


   // Instructions:
  // Supported package managers: pnpm > yarn > bun > npm
  const userAgent = process.env.npm_config_user_agent ?? ''
  
  const packageManager = /pnpm/.test(userAgent)
    ? 'pnpm'
    : /yarn/.test(userAgent)
      ? 'yarn'
      : /bun/.test(userAgent)
        ? 'bun'
        : 'npm'

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    const cdProjectName = path.relative(cwd, root)
    console.log(
      `  ${bold(green(`cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`))}`,
    )
  }
  console.log(`  ${bold(green(getCommand(packageManager, 'install')))}`)
  console.log(`  ${bold(green(getCommand(packageManager, 'dev')))}`)
  console.log()

}


init().catch((e) => {
  console.error(e)
})