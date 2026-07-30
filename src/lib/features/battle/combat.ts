export type Terrain = "Forest" | "Plains" | "City" | "Indoors";
export type Strategy = "Charge" | "Hold the line" | "Flank";

export type UnitStat = { name: string; value: number };
export type CombatUnit = {
	name: string;
	amount: number;
	stats: UnitStat[];
};
export type CombatArmy = { units: CombatUnit[] };
export type UnitLoss = { name: string; lost: number };
export type CombatResult = {
	winner: "attacker" | "defender" | "draw";
	attackerLosses: UnitLoss[];
	defenderLosses: UnitLoss[];
};

type UnitProfile = {
	unit: CombatUnit;
	power: number;
	durability: number;
	mobility: number;
};

const strategyModifiers: Record<Strategy, { power: number; durability: number; mobility: number }> = {
	Charge: { power: 1.2, durability: 0.9, mobility: 1 },
	"Hold the line": { power: 0.9, durability: 1.2, mobility: 0.8 },
	Flank: { power: 1, durability: 0.95, mobility: 1.25 },
};

function stat(unit: CombatUnit, name: string, fallback: number) {
	return unit.stats.find((candidate) => candidate.name.toLowerCase() === name)?.value ?? fallback;
}

function profile(unit: CombatUnit): UnitProfile {
	const health = stat(unit, "health", 1);
	const armor = stat(unit, "armor", 0);
	return {
		unit,
		power: stat(unit, "battle power", 1),
		durability: Math.max(1, health + armor * 2),
		mobility: stat(unit, "mobility", 1),
	};
}

function terrainModifier(terrain: Terrain, mobility: number) {
	if (terrain === "Forest") return 1 + Math.min(mobility, 4) * 0.04;
	if (terrain === "City") return 1 + Math.min(mobility, 3) * 0.03;
	if (terrain === "Indoors") return mobility <= 2 ? 1.08 : 0.92;
	return 1;
}

function armyStrength(units: UnitProfile[], strategy: Strategy, terrain: Terrain) {
	const modifiers = strategyModifiers[strategy];
	return units.reduce((total, unit) => total + unit.unit.amount * unit.power * modifiers.power * terrainModifier(terrain, unit.mobility * modifiers.mobility), 0);
}

function lossesFromDamage(units: UnitProfile[], damage: number, strategy: Strategy): UnitLoss[] {
	const durabilityModifier = strategyModifiers[strategy].durability;
	const totalDurability = units.reduce((total, unit) => total + unit.unit.amount * unit.durability * durabilityModifier, 0);

	return units.map((unit) => {
		const share = (unit.unit.amount * unit.durability * durabilityModifier) / totalDurability;
		const estimatedLosses = (damage * share) / (unit.durability * durabilityModifier);
		return { name: unit.unit.name, lost: Math.min(unit.unit.amount, Math.round(estimatedLosses)) };
	});
}

/**
 * Resolves one exchange. Pass a seeded `random` function when repeatable results are useful.
 */
export function resolveCombat(
	attacker: CombatArmy,
	defender: CombatArmy,
	options: {
		terrain: Terrain;
		attackerStrategy: Strategy;
		defenderStrategy?: Strategy;
		random?: () => number;
	},
): CombatResult {
	const defenderStrategy = options.defenderStrategy ?? "Hold the line";
	const attackerUnits = attacker.units.filter((unit) => unit.amount > 0).map(profile);
	const defenderUnits = defender.units.filter((unit) => unit.amount > 0).map(profile);
	const random = options.random ?? Math.random;
	const attackerStrength = armyStrength(attackerUnits, options.attackerStrategy, options.terrain) * (0.9 + random() * 0.2);
	const defenderStrength = armyStrength(defenderUnits, defenderStrategy, options.terrain) * (0.9 + random() * 0.2);

	return {
		winner: attackerStrength === defenderStrength ? "draw" : attackerStrength > defenderStrength ? "attacker" : "defender",
		attackerLosses: lossesFromDamage(attackerUnits, defenderStrength, options.attackerStrategy),
		defenderLosses: lossesFromDamage(defenderUnits, attackerStrength, defenderStrategy),
	};
}