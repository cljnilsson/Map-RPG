import { describe, expect, it } from "vitest";
import { resolveCombat, type CombatArmy } from "$lib/features/battle/combat";

const unit = (name: string, amount: number, power: number): CombatArmy["units"][number] => ({
	name,
	amount,
	stats: [
		{ name: "Battle Power", value: power },
		{ name: "Health", value: 10 },
		{ name: "Armor", value: 1 },
		{ name: "Mobility", value: 2 },
	],
});

describe("resolveCombat", () => {
	it("returns a winner and losses for every unit type", () => {
		const result = resolveCombat(
			{ units: [unit("Knight", 10, 10), unit("Archer", 5, 4)] },
			{ units: [unit("Raider", 10, 4)] },
			{ terrain: "Plains", attackerStrategy: "Charge", random: () => 0.5 },
		);

		expect(result.winner).toBe("attacker");
		expect(result.attackerLosses).toHaveLength(2);
		expect(result.defenderLosses).toEqual([{ name: "Raider", lost: 10 }]);
		expect(result.rewards?.gold).toBeGreaterThan(0);
		expect(result.flavorText).not.toBe("");
	});

	it("takes terrain and strategy into account", () => {
		const attacker = { units: [unit("Scout", 10, 10)] };
		const defender = { units: [unit("Guard", 10, 5)] };
		const plains = resolveCombat(attacker, defender, {
			terrain: "Plains",
			attackerStrategy: "Flank",
			defenderStrategy: "Hold the line",
			random: () => 0.5,
		});
		const indoors = resolveCombat(attacker, defender, {
			terrain: "Indoors",
			attackerStrategy: "Flank",
			defenderStrategy: "Hold the line",
			random: () => 0.5,
		});

		expect(plains.defenderLosses[0].lost).toBeGreaterThan(indoors.defenderLosses[0].lost);
	});
});