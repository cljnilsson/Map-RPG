/** Shared temporary shapes for the battle prototype. */
export type BattleStatBase = { name: string; description: string };
export type BattleStat = BattleStatBase & { value: number };
export type CombatStat = { name: string; value: number };

export type CombatUnit = {
	name: string;
	amount: number;
	stats: CombatStat[];
};

export type BattleUnit = CombatUnit & {
	icon: string;
	stats: BattleStat[];
};

export type BattleArmy = {
	friendly: boolean;
	units: BattleUnit[];
};

/** The minimum army shape the combat resolver needs. */
export type CombatArmy = { units: CombatUnit[] };

export type UnitLoss = { name: string; lost: number };
export type CombatResult = {
	winner: "attacker" | "defender" | "draw";
	attackerLosses: UnitLoss[];
	defenderLosses: UnitLoss[];
};