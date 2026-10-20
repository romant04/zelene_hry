import type Phaser from 'phaser';

/*
 * Shared helpers for running the games on both desktop (landscape) and mobile (portrait).
 *
 * Every game is designed for one landscape resolution (e.g. 1280x720). On a portrait screen the
 * game starts with the dimensions swapped (720x1280) and scenes use `isPortrait(scene)` to arrange
 * their objects for the tall layout. The orientation is picked once, when the game starts, so
 * `reloadOnOrientationChange` reloads the page after the device is rotated - the page then rejoins
 * the running game in the new layout.
 */

export function isPortraitScreen() {
	return typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
}

// How much bigger than the designed size one side of the game can get
const MAX_STRETCH = 1.5;

// Use inside the Phaser scale config:
// scale: { mode: FIT, ...getGameSize(1280, 720, document.getElementById('phaser-container')) }
// One side of the game is extended to match the aspect ratio of the container (or the window),
// so the canvas fills it without blank bars. The size never gets smaller than the designed one,
// so the layout always fits - scenes just have to position things relative to width and height.
export function getGameSize(width: number, height: number, parent?: HTMLElement | null) {
	if (typeof window === 'undefined') return { width, height };
	const screenWidth = parent?.clientWidth || window.innerWidth;
	const screenHeight = parent?.clientHeight || window.innerHeight;
	if (screenHeight > screenWidth) [width, height] = [height, width];

	const screenRatio = screenWidth / screenHeight;
	if (screenRatio > width / height) {
		width = Math.round(Math.min(height * screenRatio, width * MAX_STRETCH));
	} else {
		height = Math.round(Math.min(width / screenRatio, height * MAX_STRETCH));
	}
	return { width, height };
}

export function isPortrait(scene: Phaser.Scene) {
	return scene.scale.height > scene.scale.width;
}

// Returns a cleanup function, call it in onDestroy
export function reloadOnOrientationChange() {
	const startedPortrait = isPortraitScreen();
	let timeout: ReturnType<typeof setTimeout>;

	const onResize = () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (isPortraitScreen() !== startedPortrait) {
				location.reload();
			}
		}, 300);
	};

	window.addEventListener('resize', onResize);
	return () => {
		clearTimeout(timeout);
		window.removeEventListener('resize', onResize);
	};
}
