import type { PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { auth } from "#lib/auth.js";
import { db } from "#lib/server/db/index.js";
import { characters, cityData, unit, units } from "#lib/server/db/schema/index.js";
import { battleStat, battleUnitStats } from "#lib/server/db/schema/battle.js";
import type { BattleArmy, BattleUnit } from "#lib/types/battle.js";

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user) return { army: null };

	const character = db.select({ id: characters.id, name: characters.name }).from(characters).where(eq(characters.userId, session.user.id)).get();
	if (!character) return { army: null };

	const playerCity = db.select({ id: cityData.id }).from(cityData).where(eq(cityData.characterId, character.id)).get();
	if (!playerCity) return { army: null };

	const rows = await db
		.select({
			unitId: unit.id,
			unitName: unit.name,
			icon: unit.iconPath,
			amount: units.value,
			statName: battleStat.name,
			statDescription: battleStat.description,
			statValue: battleUnitStats.value,
		})
		.from(units)
		.innerJoin(unit, eq(units.unitId, unit.id))
		.leftJoin(battleUnitStats, eq(battleUnitStats.unitId, unit.id))
		.leftJoin(battleStat, eq(battleUnitStats.battleStatId, battleStat.id))
		.where(eq(units.cityId, playerCity.id));

	const unitsById = new Map<number, BattleUnit>();
	for (const row of rows) {
		let battleUnit = unitsById.get(row.unitId);
		if (!battleUnit) {
			battleUnit = {
				name: row.unitName,
				icon: row.icon,
				amount: row.amount,
				stats: [],
			};
			unitsById.set(row.unitId, battleUnit);
		}

		if (row.statName && row.statDescription && row.statValue !== null) {
			battleUnit.stats.push({
				name: row.statName,
				description: row.statDescription,
				value: row.statValue,
			});
		}
	}

	const army: BattleArmy = {
		friendly: true,
		name: `${character.name}'s army`,
		units: [...unitsById.values()],
	};

	return { army };
};