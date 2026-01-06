<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();

	export let editable = true;

	const DEBUG: boolean = true;

	type Pixel = {
		x: number;
		y: number;
		color: string;
	};

	type Header = {
		width: number;
		height: number;
		generated_at: number;
	};

	type PixelResponse = [Header, Pixel[]];

	// let pixels = [{ x: 1, y: 1, color: 'red' },{ x: 3, y: 1, color: 'blue' },{ x: 100, y: 1, color: 'red' },{ x: 8, y: 6, color: 'blue' }];

	let isPlacing: boolean = false;

	let header: Header | null = null;
	let pixels: Pixel[] = [];

	let error: string = '';

	export let currentColor: string = '#FF0000';

	let sse: EventSource | null = null;

	let offsetX: number = 0;
	let offsetY: number = 0;

	let mounted: boolean = false;
	let isPanning: boolean = false;

	let startX: number, startY: number;

	// canvas setup
	let canvas: HTMLCanvasElement;
	const width = 512; // total grid width
	const height = 512; // total grid height

	export let pixelSize: number = 5;
	const pixelSizeConstant: number = 5;
	let zoom: number = 1;

	// guard value used for sizing/drawing so we never use NaN/Infinity/<=0
	$: safePixelSize = Number.isFinite(pixelSize) && pixelSize > 0 ? pixelSize : 5;

	function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
		const psz = safePixelSize;
		const px = Math.round(x * psz);
		const py = Math.round(y * psz);
		ctx.fillStyle = color;
		ctx.fillRect(px, py, Math.max(1, psz), Math.max(1, psz));
	}

	// redraw scheduling (batch multiple updates into one rAF)
	let redrawScheduled = false;
	function scheduleRedraw() {
		if (redrawScheduled) return;
		redrawScheduled = true;
		requestAnimationFrame(() => {
			redrawScheduled = false;
			redrawAll();
		});
	}

	function redrawAll() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Get viewport dimensions
		const rect = canvas.getBoundingClientRect();

		// Set canvas internal resolution to match CSS size for crisp rendering
		const dpr = window.devicePixelRatio || 1;
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		ctx.scale(dpr, dpr);

		// clear/background (gray for areas outside the canvas)
		ctx.fillStyle = '#e0e0e0';
		ctx.fillRect(0, 0, rect.width, rect.height);

		// Draw the actual canvas area (white background)
		const canvasScreenX = offsetX;
		const canvasScreenY = offsetY;
		const canvasScreenWidth = width * safePixelSize;
		const canvasScreenHeight = height * safePixelSize;

		ctx.fillStyle = 'white';
		ctx.fillRect(canvasScreenX, canvasScreenY, canvasScreenWidth, canvasScreenHeight);

		// Draw border around canvas
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 2;
		ctx.strokeRect(canvasScreenX, canvasScreenY, canvasScreenWidth, canvasScreenHeight);

		// Calculate which grid cells are visible
		const viewLeft = -offsetX / safePixelSize;
		const viewTop = -offsetY / safePixelSize;
		const viewRight = (rect.width - offsetX) / safePixelSize;
		const viewBottom = (rect.height - offsetY) / safePixelSize;

		// clamp to world bounds with buffer
		const minX = Math.max(0, Math.floor(viewLeft) - 1);
		const minY = Math.max(0, Math.floor(viewTop) - 1);
		const maxX = Math.min(width - 1, Math.ceil(viewRight) + 1);
		const maxY = Math.min(height - 1, Math.ceil(viewBottom) + 1);

		// draw only pixels inside the visible rect
		let drawnCount = 0;
		for (const { x, y, color } of pixels) {
			if (x < minX || x > maxX || y < minY || y > maxY) continue;

			// Draw at screen coordinates (offset + world position * pixel size)
			const screenX = offsetX + x * safePixelSize;
			const screenY = offsetY + y * safePixelSize;

			ctx.fillStyle = color;
			ctx.fillRect(screenX, screenY, Math.max(1, safePixelSize), Math.max(1, safePixelSize));
			drawnCount++;
		}

		if (DEBUG) {
			console.log(
				`Drew ${drawnCount} of ${pixels.length} pixels (visible: ${minX},${minY} to ${maxX},${maxY})`
			);
		}
	}

	onMount(async () => {
		try {
			const res = await fetch(`/api/pixels/get`);
			if (!res.ok) throw new Error(`API error: ${res.status}`);
			const json = (await res.json()) as PixelResponse;

			header = json[0];
			pixels = json[1];

			console.log('header:', header);
			console.log('pixels:', pixels);
		} catch (err) {
			error = String(err);
			console.error('Fetch failed:', err);
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		mounted = true;

		canvas.width = width * safePixelSize;
		canvas.height = height * safePixelSize;

		// background
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, width * safePixelSize, height * safePixelSize);

		// draw initial pixels via centralized redraw
		redrawAll();

		sse = new EventSource('/api/pixels/stream');
		sse.onmessage = (e) => {
			try {
				console.log('New stream data:', e.data);
				const msg = JSON.parse(e.data);
				const x = msg.x;
				const y = msg.y;
				const color = msg.color;
				// Update local pixels state so redraws (eg. on zoom) include this pixel
				const found = pixels.findIndex((p) => p.x === x && p.y === y);
				if (found >= 0) {
					pixels[found] = { x, y, color };
					pixels = pixels; // trigger Svelte reactivity
				} else {
					pixels = [...pixels, { x, y, color }];
				}
				// schedule a batched redraw (will coalesce multiple updates)
				scheduleRedraw();
			} catch (err) {
				console.error('SSE parse/draw error', err);
			}
		};

		// don't aggressively close on generic errors during load; let browser retry
		sse.onerror = (e) => {
			console.warn('Stream error (non-fatal):', e, 'readyState=', sse?.readyState);
		};
	});

	onDestroy(() => {
		try {
			sse?.close();
		} catch {}
		sse = null;
	});

	// react to pixelSize, pixels, or offsets changing and schedule redraw
	$: if (mounted && canvas) {
		// reference these so Svelte tracks changes
		void safePixelSize;
		void pixels;
		void offsetX;
		void offsetY;
		scheduleRedraw();
	}

	function canvasToPixel(e: MouseEvent | PointerEvent) {
		const rect = canvas.getBoundingClientRect();

		// Get mouse position relative to canvas viewport
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		// Convert to world coordinates by accounting for offset
		const x = Math.floor((mouseX - offsetX) / safePixelSize);
		const y = Math.floor((mouseY - offsetY) / safePixelSize);

		console.log(`Found x and y: (${x}, ${y})`);

		if (editable == false) {
			console.log(`In read-only canvas mode, so not sending request to place pixel`);
		}

		return { x, y };
	}

	function onMouseDown(event: MouseEvent | PointerEvent) {
		console.log('Ran onMouseDown');
		if (event.button === 2) {
			// 0 is left, 1 is center, 2 is right
			isPanning = true;
			startX = event.clientX;
			startY = event.clientY;
			event.preventDefault();
		} else if (event.button === 0) {
			placePixel(event);
		}
	}

	function onMouseMove(event: MouseEvent | PointerEvent) {
		// console.log('Ran onMouseMove')
		if (isPanning) {
			// console.log('Is onMouseMove AND isPanning')
			const dx = event.clientX - startX;
			const dy = event.clientY - startY;

			offsetX += dx;
			offsetY += dy;

			startX = event.clientX;
			startY = event.clientY;

			console.log(`offsetX: ${offsetX}, offsetY: ${offsetY}`);
			scheduleRedraw();
		}
	}

	function onMouseUp(event: MouseEvent | PointerEvent) {
		isPanning = false;
	}

	function onWheel(event: WheelEvent) {
		event.preventDefault();

		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();

		// Get mouse position relative to canvas viewport
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		// Calculate the world position at the mouse before zoom
		const worldX = (mouseX - offsetX) / safePixelSize;
		const worldY = (mouseY - offsetY) / safePixelSize;

		const oldPixelSize = safePixelSize;

		// Update zoom
		zoom = zoom + 0.001 * -event.deltaY;
		zoom = Math.max(0.2, Math.min(6, zoom));

		// Update pixelSize
		const computed = pixelSizeConstant * zoom;
		pixelSize = Number.isFinite(computed)
			? Math.max(1, Number(computed.toFixed(8)))
			: pixelSizeConstant;

		// Adjust offsets so the same world position stays under the mouse
		offsetX = mouseX - worldX * pixelSize;
		offsetY = mouseY - worldY * pixelSize;

		console.log('New zoom:', zoom, 'pixelSize:', pixelSize);
	}

	async function placePixel(e: MouseEvent | PointerEvent) {
		if (isPlacing) return;

		isPlacing = true;

		const { x, y } = canvasToPixel(e);

		if (x < 0 || y < 0 || x >= width || y >= height) return;

		if (editable == false) {
			return;
		} // Stop user from placing if the canvas is not editable

		const previousPixel = pixels.find((p) => p.x === x && p.y === y);
		const previousColor = previousPixel?.color || '#FFFFFF';

		function undoPlace() {
			const existing = pixels.findIndex((p) => p.x === x && p.y === y);
			if (existing >= 0) {
				pixels[existing] = { x, y, color: previousColor };
				pixels = pixels;
			} else {
				pixels = [...pixels, { x, y, color: previousColor }];
			}
		}

		// place the pixel right away for fast looking ui
		// then wait for backend to approve of it, if not approve then undo

		// Optimistically update local pixels so subsequent redraws include it
		const existing = pixels.findIndex((p) => p.x === x && p.y === y);
		if (existing >= 0) {
			pixels[existing] = { x, y, color: currentColor };
			pixels = pixels;
		} else {
			pixels = [...pixels, { x, y, color: currentColor }];
		}

		// send request to api to place pixel

		try {
			const res = await fetch(`/api/pixels/place`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					x,
					y,
					color: currentColor
				})
			});

			let responseBody = await res.text(); // Consume the body once and store it

			if (DEBUG) {
				console.log('Response status:', res.status);
				console.log('Response body:', responseBody);
			}

			if (res.ok) {
				const responseJson = JSON.parse(responseBody);
				if (responseJson.ok) {
					console.log(`placed pixel at (${x}, ${y})`);
					dispatch('pixelPlaced');
				} else {
					console.log('Server responded with ok: false');
					undoPlace();
				}
			} else {
				console.log('res.ok returned false');
				undoPlace();
			}
		} catch (err) {
			console.error('network error:', err);
		}

		isPlacing = false;
	}
</script>

{#if error}
	<p>Error: {error}</p>
{:else}
	<div>
		<canvas
			bind:this={canvas}
			on:mousedown={onMouseDown}
			on:mousemove={onMouseMove}
			on:mouseup={onMouseUp}
			on:wheel={onWheel}
			style="image-rendering: pixelated; width: 100%; height: 100%;"
			class="canvas">
		</canvas>

		<!-- on:click={placePixel} -->

		<!-- <input bind:value={pixelSize}> -->
	</div>
{/if}
