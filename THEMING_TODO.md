# Component theming follow-up

The global Bootstrap theme foundation lives in `src/routes/styles.scss`. The files below still contain component-scoped hard-coded colors, gradients, or inline visual styles and should be migrated gradually to Bootstrap variables or theme custom properties.

## Map, character, and shared components

- `src/lib/components/MapClickBox.svelte`
- `src/lib/components/PlotClickBox.svelte`
- `src/lib/components/character/CharacterStat.svelte`
- `src/lib/components/character/CharacterStatCollection.svelte`
- `src/lib/components/gameobjects.svelte`
- `src/lib/components/itemGrid.svelte`
- `src/lib/components/npcs.svelte`
- `src/lib/components/progressBar.svelte`
- `src/lib/components/resourceCost.svelte`
- `src/lib/components/utils/keybind.svelte`
- `src/lib/components/utils/tabs.svelte`

## Travel and prototype components

- `src/lib/components/scratch.svelte`
- `src/lib/components/travel/create.svelte`
- `src/lib/components/travel/generic/actionButtons.svelte`
- `src/lib/components/travel/generic/dropdown.svelte`
- `src/lib/components/travel/infoPanel.svelte`
- `src/lib/components/travel/loader.svelte`
- `src/lib/components/travel/point.svelte`
- `src/lib/components/travel/travel.svelte`
- `src/lib/utils/ResizeAnchors.svelte`

## Feature UI

- `src/lib/features/battle/army.svelte`
- `src/lib/features/battle/infoWIndow.svelte`
- `src/lib/features/battle/strategyPicker.svelte`
- `src/lib/features/book/bookPage.svelte`
- `src/lib/features/creator/charMenu.svelte`
- `src/lib/features/creator/creator.svelte`
- `src/lib/features/dialogue/dialogue.svelte`
- `src/lib/features/dialogue/dialogueBody.svelte`
- `src/lib/features/die/dieCollection.svelte`
- `src/lib/features/inventory/inventory.svelte`
- `src/lib/features/inventory/inventoryItem.svelte`
- `src/lib/features/miniMenu/iconMenu.svelte`
- `src/lib/features/miniMenu/miniMenu.svelte`
- `src/lib/features/notification/notification.svelte`
- `src/lib/features/tooltip/tooltip.svelte`
- `src/lib/features/window/window.svelte`
- `src/lib/features/window/windowTitle.svelte`

## Building and window feature UI

- `src/lib/features/buildings/adventure-guild/adventure-guild.svelte`
- `src/lib/features/buildings/bank/bank.svelte`
- `src/lib/features/buildings/bank/storage.svelte`
- `src/lib/features/buildings/bank/storageItem.svelte`
- `src/lib/features/buildings/beast-pen/beast-pen.svelte`
- `src/lib/features/buildings/black-market/black-market.svelte`
- `src/lib/features/buildings/market/market.svelte`
- `src/lib/features/buildings/market/resourceSelection.svelte`
- `src/lib/features/buildings/shipyard/shipyard.svelte`
- `src/lib/features/buildings/woodwork/crafting.svelte`
- `src/lib/features/buildings/woodwork/craftingComponentGrid.svelte`
- `src/lib/features/buildings/woodwork/craftingItem.svelte`
- `src/lib/features/buildings/woodwork/craftingMenu.svelte`
- `src/lib/features/buildings/woodwork/woodwork.svelte`
- `src/lib/features/window/windows/container/container.svelte`
- `src/lib/features/window/windows/events/events.svelte`
- `src/lib/features/window/windows/logger/logger.svelte`
- `src/lib/features/window/windows/navigator/navigator.svelte`
- `src/lib/features/window/windows/quest/questDetails.svelte`
- `src/lib/features/window/windows/quest/questDialogue.svelte`
- `src/lib/features/window/windows/quest/questItem.svelte`
- `src/lib/features/window/windows/quest/questProgress.svelte`
- `src/lib/features/window/windows/quest/questRewards.svelte`
- `src/lib/features/window/windows/quest/questSection.svelte`
- `src/lib/features/window/windows/resources/resources.svelte`
- `src/lib/features/window/windows/unit/unitWindow.svelte`
- `src/lib/features/window/windows/vendor/vendor.svelte`

## Route-specific styles

- `src/routes/battle/+page.svelte`
- `src/routes/login/+page.svelte`
- `src/routes/map/[city]/[identifier]/+page.svelte`
- `src/routes/register/+page.svelte`
- `src/routes/test/+page.svelte`
- `src/routes/travel/+page.svelte`

Gameplay-state indicators (item quality, map click boxes, warning/error states) can remain deliberately semantic colors. Migrate structural backgrounds, text, borders, shadows, and form controls first.
