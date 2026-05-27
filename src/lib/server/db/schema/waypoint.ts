import { sqliteTable, text, integer, index, check, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { classValues } from "$lib/types/class";
import { user, session, account } from "$lib/server/db/schema/auth";

export const waypoint = sqliteTable("waypoint", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
});

export const waypointNode = sqliteTable("waypointnode", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	x: integer("x").notNull(),
	y: integer("y").notNull(),
});

export const waypointPath = sqliteTable("waypointPath", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	angle: integer("angle").notNull(),
	from: integer("from_waypoint_node_id")
		.notNull()
		.references(() => waypointNode.id),
	to: integer("to_waypoint_node_id")
		.notNull()
		.references(() => waypointNode.id),
	waypoint: integer("waypoint_id")
		.notNull()
		.references(() => waypoint.id),
});

export const waypointRelations = relations(waypoint, ({ many }) => ({
	paths: many(waypointPath),
}));

export const waypointPathRelations = relations(waypointPath, ({ one }) => ({
	waypoint: one(waypoint, {
		fields: [waypointPath.waypoint],
		references: [waypoint.id],
	}),
	from: one(waypointNode, {
		fields: [waypointPath.from],
		references: [waypointNode.id],
	}),
	to: one(waypointNode, {
		fields: [waypointPath.to],
		references: [waypointNode.id],
	}),
}));