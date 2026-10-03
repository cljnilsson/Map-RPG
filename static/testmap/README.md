# Atlas prototype assets

Isolated assets for `/testmap`. Generated with the built-in image-generation tool for this experiment. No existing map assets were replaced.

- `world.png`: illustrated Eldermere world map.
- `city.png`: Alderwick city map.
- `inn.png`: Gilded Lantern interior map.

Smaller locations reuse SVG viewBox crops of these illustrations. No extra downloaded assets or dependencies are used.
Data: `src/lib/data/testmap.ts`. UI: `src/routes/testmap/+page.svelte`. Location types: `src/lib/types/testmap.ts`.

Try Eldermere → Alderwick → The Gilded Lantern → The private study. Select a marker or list entry, then choose **Explore location**. Breadcrumbs jump to any ancestor; the back arrow goes up one level. Zoom before dragging to pan, or use the directional buttons that appear when zoomed. All controls are keyboard-accessible native buttons. Labels can be toggled. State is local to the page and resets on reload; no map controller, gameplay state, or database is changed by the prototype.

There is no fixed nesting limit: each location has its own children and image/viewBox. This demo has four levels. Leaf locations intentionally show an arrival state rather than a nonfunctional enter button. This is navigation only, not a map editor.

## Game UI

`src/routes/testmap/GameHud.svelte` adds the logged-in character HUD and reuses the existing inventory, quests, activity log, skill allocation, and item-interaction windows. The portrait opens a character summary. Window buttons toggle their existing controllers; settings links to the existing settings route. Guests can explore without a character. Existing quest and inventory initialization is reused, including any existing demo data; no new data-loading model is introduced here.

Atlas travel remains local and does not change the original map controller. City resources, units, and map-specific NPC interactions are intentionally not mapped onto these fictional locations. Character actions in the reused windows are live, including skill allocation and existing item effects; these are not sandboxed. No schema or seed changes are needed.

# Generation prompts

## world.png

Use case: stylized-concept. Asset type: background for an interactive fantasy RPG atlas. Create a beautiful landscape 3:2 top-down illustrated world map, no text, no labels, no frames, no UI. Antique ink and watercolor on warm ivory parchment, restrained moss green forests, slate mountains, muted teal ocean and rivers, delicate cartographic details. An island continent occupying most of frame, sea at edges. Snowy mountain range northwest, dense forest northeast, winding river down middle, a fortified city at 48% across 57% down, a harbor town at 73% across 73% down, ancient circular ruins at 70% across 30% down, northern mountain keep at 28% across 28% down. Thin ochre roads connect landmarks. Highly detailed handcrafted premium tabletop campaign map, readable aerial geography, soft natural pigments, no modern elements. Output image for project use and return saved file path.

## city.png

Use case: stylized-concept. Asset type: interactive fantasy game map background. Landscape 3:2 top-down medieval walled river city map. Ink and watercolor on ivory parchment, moss green gardens, ochre stone, rust roof tiles, muted teal water. Intricate handcrafted tabletop atlas aesthetic. City fills frame, circular city walls, winding alleys and a teal river along right edge with bridges. Central market square at 50% across 47% down; a large coaching inn with courtyard at 30% across 62% down; a castle with gardens at 57% across 25% down; docks at 77% across 66% down. Small trees outside walls. True overhead view, visually rich but softly colored, no text no labels no UI no grid no frame. Output image and return saved path.

## inn.png

Use case: stylized-concept. Asset type: interactive fantasy RPG indoor map. Landscape 3:2 top-down cutaway floor plan of a cozy medieval stone-and-timber inn on ivory parchment, hand-inked watercolor tabletop illustration matching an antique fantasy atlas. Interior fills most of frame. Warm honey wood floors, moss green fabrics, muted ochre and brown. Large taproom in left half with fireplace tables and bar, stone kitchen upper right, stairs at right center, private study with bookcases desk rug at 76% across 73% down, courtyard plants bottom left. Architectural walls clearly defined, inviting lived-in detail, true orthographic overhead view, no people no text no labels no grid no frame no UI. Output image and return saved path.
