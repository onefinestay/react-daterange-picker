#!/usr/bin/env bash
set -e

echo "Packaging repo..."
npm pack
pack_exit_code=$?
[[ $pack_exit_code -gt 0 ]] && echo "Failed to run 'npm pack' on this repo" && exit $pack_exit_code

pkg_version=$(cat package.json | grep '"version"' | awk -F'"' '{ print $4 }')
[[ "${pkg_version}" == "" ]] && echo "Can't determine package version from package.json" && exit 1

pkg_name=$(cat package.json | grep '"name"' | head -1 | awk -F'"' '{ print $4 }')
[[ "${pkg_name}" == "" ]] && echo "Can't determine package name from package.json" && exit 1

pack_file="${pkg_name}-${pkg_version}.tgz"
echo "Pushing package ${pack_file} to gemfury"
command="curl -F package=@${pack_file} https://JJafP-b77SzP9tpwm7BE@push.fury.io/nuvi/"
curl -F package=@${pack_file} https://JJafP-b77SzP9tpwm7BE@push.fury.io/nuvi/
curl_exit_code=$?
[[ $curl_exit_code -gt 0 ]] && echo "Failed to push package to gemfury using command:" && echo "${command}" && exit $curl_exit_code

[[ -f $pack_file ]] && rm $pack_file
