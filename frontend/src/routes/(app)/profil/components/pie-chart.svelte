<script lang="ts">
	import { convertTimeToBestFormat } from '../../../../utils/time';

	const { data }: { data: { label: string; mins: number }[] } = $props();

	const colors = ['#4d8a2b', '#f57c31', '#444'];
	let lastUsedColorIndex = 0;
	let colorDarkenAmount = 0;

	const size = 400;
	const strokeWidth = 100;
	const center = size / 2;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	function darkenColors() {
		colors.forEach((color, index) => {
			let cleanColor = color.replace('#', '');

			// 1. Expand 3-digit hex (e.g., "4cf" -> "44ccff")
			if (cleanColor.length === 3) {
				cleanColor = cleanColor
					.split('')
					.map((char) => char + char)
					.join('');
			}

			// 2. Darken each RGB component
			const darkenedColor = cleanColor
				.match(/.{2}/g)
				?.map((hex) => {
					const num = parseInt(hex, 16);
					const darkenedNum = Math.max(0, num - colorDarkenAmount);
					return darkenedNum.toString(16).padStart(2, '0');
				})
				.join('');

			if (darkenedColor) colors[index] = `#${darkenedColor}`;
		});
	}

	const totalMins = $derived(data.reduce((sum, d) => sum + d.mins, 0));

	const slices = $derived.by(() => {
		let usedPerc = 0;
		return data.map((d) => {
			const slicePerc = d.mins / totalMins;

			// 1. Calculate the angle for the label (in radians)
			// We subtract 90 degrees (Math.PI / 2) because SVGs start at 3 o'clock
			const startAngle = usedPerc * 2 * Math.PI - Math.PI / 2;
			const middleAngle = startAngle + slicePerc * Math.PI;

			// 2. Position the label in the center of the stroke
			const labelX = center + radius * Math.cos(middleAngle);
			const labelY = center + radius * Math.sin(middleAngle);

			const res = {
				...d,
				strokeValue: slicePerc * circumference,
				offset: usedPerc * circumference * -1,
				labelX,
				labelY,
				percentage: (slicePerc * 100).toFixed(2),
				color: colors[lastUsedColorIndex]
			};

			lastUsedColorIndex = (lastUsedColorIndex + 1) % colors.length;
			if (lastUsedColorIndex === 0) {
				colorDarkenAmount += 35;
				darkenColors();
			}
			usedPerc += slicePerc;
			return res;
		});
	});
</script>

<div class="chart-wrapper">
	<h2 class="font-heading font-bold text-4xl mb-5">Celkový herní čas</h2>

	{#if totalMins === 0}
		<p class="text-2xl font-semibold text-error-400">Zatím jste neodehrál žádné hry</p>
		<a class="btn variant-filled-primary mt-5 text-lg font-semibold w-40" href="/#hry"
			>Jít hrát</a
		>
	{/if}
	<div class="container">
		<svg width={size} height={size} viewBox="0 0 {size} {size}">
			<g transform="rotate(-90 {center} {center})">
				{#each slices as slice}
					<circle
						cx={center}
						cy={center}
						r={radius}
						fill="transparent"
						stroke={slice.color}
						stroke-width={strokeWidth}
						stroke-dasharray="{slice.strokeValue} {circumference}"
						stroke-dashoffset={slice.offset}
					/>
				{/each}
			</g>

			{#each slices as slice}
				<text x={slice.labelX} y={slice.labelY} text-anchor="middle" class="label">
					<tspan x={slice.labelX} dy="-0.2em">{slice.label} </tspan>
					<tspan x={slice.labelX} dy="1.2em" font-weight="bold">
						{convertTimeToBestFormat(slice.mins)}
						{slice.percentage}%
					</tspan>
				</text>
			{/each}

			<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="total">
				{convertTimeToBestFormat(totalMins)}
			</text>
		</svg>
	</div>
</div>

<style>
	.chart-wrapper {
		color: white;
		text-align: center;
	}
	.total {
		fill: white;
		font-size: 1.8rem;
		font-weight: bold;
	}
	.label {
		fill: white;
		font-size: 0.75rem;
		pointer-events: none;
	}
	circle {
		transition: all 0.3s ease;
	}
</style>
