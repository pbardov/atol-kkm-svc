import {join as pathJoin, extname} from 'node:path';
import {readFileSync, existsSync} from 'node:fs';
import YAML from 'yaml';

export default function loadSettingsFile(filePath: string, root = process.cwd()): unknown {
	const fullPath = pathJoin(root, filePath);
	if (!existsSync(fullPath)) {
		throw new Error(`Settings file not found: ${fullPath}`);
	}

	const ext = extname(fullPath);
	if (ext === '.json') {
		return JSON.parse(readFileSync(fullPath, 'utf8'));
	} else if (ext === '.yaml' || ext === '.yml') {
		return YAML.parse(readFileSync(fullPath, 'utf8'));
	}

	throw new Error(`Unsupported settings file extension: ${ext}`);
}
