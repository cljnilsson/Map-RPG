// Stolen OSRS formula for placeholder purposes

export function getXPForLevel(level: number): number {
	if (level <= 1) return 0;

	let xp = 0;
	for (let i = 1; i < level; i++) {
		xp += Math.floor(i + 300 * Math.pow(2, i / 7));
	}
	return Math.floor(xp / 4);
}

export function xpToLevel(currentXP: number): number {
	for (let level = 1; level <= 99; level++) {
		if (getXPForLevel(level + 1) > currentXP) {
			return level;
		}
	}
	return 99; // max level
}

export function xpToNextLevel(currentLevel: number, currentXP: number): number {
	const xpForNextLevel = getXPForLevel(currentLevel + 1);
	return xpForNextLevel - currentXP;
}