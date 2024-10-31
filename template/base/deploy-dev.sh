#!/usr/bin/env sh
set -e
docker run --rm -v "$PWD":/usr/src/app -w /usr/src/app guergeiro/pnpm:16-7 bash -c 'pnpm install --registry=http://172.18.1.100:8081/repository/npm-public && pnpm run build'
echo "rm dir" && rm -rf /root/dw-pro/static-admin
echo "cp dir" && cp -fR /codes/dw-pro-ui/dist /root/dw-pro/static-admin
