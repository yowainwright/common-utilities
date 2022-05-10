import { resolve } from 'path'
import { copySync, readFileSync, writeFileSync } from 'fs-extra'
import { Options } from './types'

export function writeTextUpdates(name: string, description, dir: string) {
	const readmeFile = readFileSync(`${dir}/README.md`, 'utf8')
	const readmeUpdate = readmeFile
		.replaceAll('NAME', name)
		.replaceAll('DESCRIPTION', description)
	writeFileSync(`${dir}/README.md`, readmeUpdate)
	const camelCaseName = name
		.split('-')
		.map((e, i) =>
			i
				? e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
				: e.toLowerCase(),
		)
		.join('')
	const indexFile = readFileSync(`${dir}/src/index.ts`, 'utf8')
	const indexFileUpdate = indexFile.replaceAll('name', camelCaseName)
	writeFileSync(`${dir}/src/index.ts`, indexFileUpdate)
	const testFile = readFileSync(`${dir}/src/index.test.ts`, 'utf8')
	const testFileUpdate = testFile.replaceAll('name', camelCaseName)
	writeFileSync(`${dir}/src/index.test.ts`, testFileUpdate)
}

/**
 * auditSrcsScript
 * @param {Object} options
 * @param {string} options.name
 * @param {string} options.description
 * @returns {void}
 */
export function createPkg({ description, name }: Options = {}) {
	if (!name) {
		console.log('`Name` is required!')
		process.exit(0)
	}

	const newDir = `packages/${name}`

	// must match to root
	const config = resolve(__dirname, '../pkg')
	copySync(config, newDir)

	// write over initial package.json
	const pkgJSON = resolve(`${newDir}/package.json`)
	// @ts-ignore
	const json = require(pkgJSON)
	json.name = `@common-utilities/${name}`
	json.description = description

	/**
	 * @note update the package json with the prettier config
	 */
	writeFileSync(pkgJSON, JSON.stringify(json, null, 2))
	writeTextUpdates(name, description, newDir)
}

export const script = createPkg
