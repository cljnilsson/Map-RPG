export function costToNextLevel(base: number, level: number): number {
	return Math.floor(base * 2 * 1.38 ** (level - 1)); // Similar but not identical formula to Travian unit upgrades
}