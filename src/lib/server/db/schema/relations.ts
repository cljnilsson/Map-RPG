import { relations } from "drizzle-orm";
import { user } from "$lib/server/db/schema/auth";
import { characters, items, stats } from "$lib/server/db/schema/character";
import { city } from "$lib/server/db/schema/city";
import { resource } from "$lib/server/db/schema/resource";
import { unit } from "$lib/server/db/schema/unit";
import { cityData, windowPositions, resources, storage, units, plot, loans } from "$lib/server/db/schema";

export const characterRelations = relations(characters, ({ one, many }) => ({
	stats: many(stats),
	user: one(user, {
		fields: [characters.userId],
		references: [user.id],
	}),
	inventory: many(items),
	windowPositions: many(windowPositions),
	cities: many(cityData),
}));

export const cityDataRelations = relations(cityData, ({ many, one }) => ({
	resources: many(resources),
	city: one(city, { fields: [cityData.cityId], references: [city.id] }),
	storage: many(storage),
	units: many(units),
	plots: many(plot),
	loans: many(loans),
	character: one(characters, {
		fields: [cityData.characterId],
		references: [characters.id],
	}),
}));

export const plotRelations = relations(plot, ({ one }) => ({
	city: one(cityData, { fields: [plot.cityId], references: [cityData.id] }),
}));

export const storageRelations = relations(storage, ({ one }) => ({
	city: one(cityData, { fields: [storage.cityId], references: [cityData.id] }),
}));

export const unitsRelations = relations(units, ({ one }) => ({
	city: one(cityData, { fields: [units.cityId], references: [cityData.id] }),
	unit: one(unit, { fields: [units.unitId], references: [unit.id] }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
	city: one(cityData, {
		fields: [resources.cityId],
		references: [cityData.id],
	}),
	resource: one(resource, {
		fields: [resources.resourceId],
		references: [resource.id],
	}),
}));

export const loanRelations = relations(loans, ({ one }) => ({
	city: one(cityData, { fields: [loans.cityId], references: [cityData.id] }),
	resource: one(resource, {
		fields: [loans.resourceId],
		references: [resource.id],
	}),
}));

export const windowPositionRelations = relations(windowPositions, ({ one }) => ({
	character: one(characters, {
		fields: [windowPositions.characterId],
		references: [characters.id],
	}),
}));