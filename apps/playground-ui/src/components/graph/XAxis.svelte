<script lang="ts">
	import type { ScaleLinear } from 'd3-scale';

	export let xScale: ScaleLinear<number, number>;
	export let innerHeight: number;
	export let label: string;

	function numberOfTicks(pixelsAvailable: number, pixelsPerTick: number = 60): number {
		return Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);
	}

	$: [xMin, xMax] = xScale.range();

	$: ticks = xScale.ticks(numberOfTicks(xMax - xMin));
</script>

<g transform={`translate(0 ${innerHeight})`}>
	<line x1={xMin} x2={xMax} y1={0} y2={0} stroke="#bdc3c7" />
	{#each ticks as tick}
		<g transform={`translate(${xScale(tick)} 0)`}>
			<line y1={0} y2={6} stroke="#bdc3c7" />
			<text y={10} dy="0.8em" text-anchor="middle" fill="#bdc3c7">
				{tick}
			</text>
		</g>
	{/each}
	<text x={xScale.range()[1] / 2} text-anchor="middle" y={45} fill="#bdc3c7">
		{label}
	</text>
</g>
