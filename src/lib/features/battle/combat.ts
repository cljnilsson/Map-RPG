import type { BattleReward, CombatArmy, CombatResult, CombatUnit, UnitLoss } from "#lib/types/battle.js";

export type {
	BattleReward,
	CombatArmy,
	CombatResult,
	UnitLoss,
} from "#lib/types/battle.js";

export type Terrain = "Forest" | "Plains" | "City" | "Indoors";
export type Strategy = "Charge" | "Hold the line" | "Flank";

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

export function describeTerrainModifier(terrain: Terrain) {
	if (terrain === "Forest") return "Attack strength gains 4% per Mobility, up to 16%.";
	if (terrain === "City") return "Attack strength gains 3% per Mobility, up to 9%.";
	if (terrain === "Indoors") return "Units with Mobility 2 or less gain 8% attack strength; faster units lose 8%.";
	return "No terrain modifier.";
}

export function describeStrategyModifier(strategy: Strategy) {
	const modifier = strategyModifiers[strategy];
	const percent = (value: number) => `${value >= 1 ? "+" : ""}${Math.round((value - 1) * 100)}%`;
	return `Battle Power ${percent(modifier.power)}, durability ${percent(modifier.durability)}, effective Mobility ${percent(modifier.mobility)}.`;
}

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
		return {
			name: unit.unit.name,
			lost: Math.min(unit.unit.amount, Math.round(estimatedLosses)),
		};
	});
}

function armySize(army: CombatArmy) {
	return army.units.reduce((total, unit) => total + unit.amount, 0);
}

function rewardsForArmy(army: CombatArmy, random: () => number): BattleReward {
	const gold = Math.max(5, Math.round(armySize(army) * (2 + random() * 4)));
	const item = random() < 0.3 ? ["Iron Sword", "Wooden Shield", "Hunting Bow"][Math.floor(random() * 3)] : undefined;
	return { gold, item };
}

function flavorText(winner: CombatResult["winner"], random: () => number) {
	const messages =
		winner === "attacker"
			? [
					"What remained of the opposing warband escaped into the nearby woods.",
					"The surviving defenders scattered, leaving their camp behind.",
					"The enemy broke ranks and fled before nightfall.",
				]
			: winner === "defender"
				? [
						"The attack faltered, and the surviving force withdrew in haste.",
						"What remained of the attackers vanished down the old road.",
						"The battered warband retreated to fight another day.",
					]
				: ["Both armies withdrew as dusk settled over the battlefield.", "Neither side could claim the field; the fighting slowly died away."];
	return messages[Math.floor(random() * messages.length)];
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

	const winner = attackerStrength === defenderStrength ? "draw" : attackerStrength > defenderStrength ? "attacker" : "defender";
	const winningArmy = winner === "attacker" ? attacker : winner === "defender" ? defender : null;

	return {
		winner,
		attackerLosses: lossesFromDamage(attackerUnits, defenderStrength, options.attackerStrategy),
		defenderLosses: lossesFromDamage(defenderUnits, attackerStrength, defenderStrategy),
		rewards: winningArmy ? rewardsForArmy(winningArmy, random) : null,
		flavorText: flavorText(winner, random),
	};
}