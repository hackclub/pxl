import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const LOG_FILE = resolve(process.cwd(), 'data/action-log.json');

import { mkdirSync } from 'fs';

function ensureLogDir() {
	const dir = dirname(LOG_FILE);
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readLog(): any[] {
	if (!existsSync(LOG_FILE)) return [];
	try {
		const content = readFileSync(LOG_FILE, 'utf-8').trim();
		if (!content) return [];
		return JSON.parse(content);
	} catch {
		console.error('Corrupted log file, starting fresh.');
		return [];
	}
}

export function log_action(action: string, email: string) {
	const logs = readLog();
	logs.push({
		time: new Date().toISOString(),
		email,
		action
	});
	ensureLogDir();
	writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
}

export function log_pxl(action: string, x: number, y: number, color: string, email: string) {
	const logs = readLog();
	logs.push({
		time: new Date().toISOString(),
		email,
		action,
		x,
		y,
		color
	});
	ensureLogDir();
	writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
}
