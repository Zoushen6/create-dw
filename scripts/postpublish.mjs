#!/usr/bin/env zx
import 'zx/globals'

await $`git add .`

let { version } = JSON.parse(await fs.readFile('./package.json'))

console.log(version);


try {
  await $`git commit -m "version ${version} Update after publish"`
} catch (e) {
  if (!e.stdout.includes('nothing to commit')) {
    throw e
  }
}

await $`git push origin master`