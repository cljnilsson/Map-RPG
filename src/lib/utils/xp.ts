// Stolen OSRS formula for placeholder purposes

export function getXPForLevel(level: number): number {
	if (level <= 1) return 0;

	let xp = 0;
	for (let i = 1; i < level; i++) {
		xp += Math.floor(i + 300 * 2 ** (i / 7));
	}
	return Math.floor(xp / 4);
}

export function xpToNextLevel(currentLevel: number, currentXP: number): number {
	const xpForNextLevel = getXPForLevel(currentLevel + 1);
	return xpForNextLevel - currentXP;
}