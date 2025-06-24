<script lang="ts">
	import * as d3 from 'd3';

	import Crosshair from '$components/graph/Crosshair.svelte';
	import GridLines from '$components/graph/GridLines.svelte';
	import Line from '$components/graph/Line.svelte';
	import Point from '$components/graph/Point.svelte';
	import XAxis from '$components/graph/XAxis.svelte';

	export let stats: { ts: string | number | Date; value: number }[];

	let hoveredPoint: { ts: string | number | Date; value: number } | null = null;

	const margin = {
		top: 50,
		right: 50,
		bottom: 50,
		left: 90
	};

	let width = 200;
	$: height = 0.5 * width;

	$: innerWidth = width - margin.left - margin.right;
	$: innerHeight = height - margin.top - margin.bottom;

	function xAccessor(d: { ts: string | number | Date }): number {
		return new Date(d.ts).getTime();
	}

	function yAccessor(d: { value: number }): number {
		return d.value;
	}

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const bisectX = d3.bisector(xAccessor).left;

	$: xScale = d3
		.scaleLinear()
		.domain(d3.extent(stats, xAccessor) as [number, number])
		.range([0, innerWidth]);

	$: yScale = d3
		.scaleLinear()
		.domain(d3.extent(stats, yAccessor) as [number, number])
		.range([innerHeight, 0])
		.nice();

	$: xAccessorScaled = (d: { ts: string | number | Date }) => xScale(xAccessor(d));

	function yAccessorScaled(d: { value: number }): number {
		return yScale(yAccessor(d));
	}

	function handleMouseMove(event: MouseEvent): void {
		const xCoordinate = xScale.invert(event.offsetX - margin.left);
		const index = bisectX(stats, xCoordinate);
		hoveredPoint = stats[index - 1];
	}

	function handleMouseLeave(): void {
		hoveredPoint = null;
	}
</script>

<div class="wrapper" bind:clientWidth={width}>
	<svg
		role="img"
		aria-label="line chart showing the variation of the provided statistics over time"
		{width}
		{height}
		on:mousemove={handleMouseMove}
		on:mouseleave={handleMouseLeave}
	>
		<g transform={`translate(${margin.left}, ${margin.top})`}>
			<XAxis {xScale} {innerHeight} label="Ts" />
			<GridLines {yScale} {innerWidth} label="Value" />
			<Line {stats} {xAccessorScaled} {yAccessorScaled} />
			{#if hoveredPoint}
				<Crosshair
					xAccessorScaled={xAccessorScaled(hoveredPoint)}
					yAccessorScaled={yAccessorScaled(hoveredPoint)}
					xLabel={xAccessor(hoveredPoint)}
					yLabel={yAccessor(hoveredPoint)}
					{innerHeight}
				/>
				<Point
					x={xAccessorScaled(hoveredPoint)}
					y={yAccessorScaled(hoveredPoint)}
					color="rgb(255 124 21)"
				/>
			{/if}
		</g>
	</svg>
</div>

<style>
	.wrapper {
		position: relative;
		width: 100%;
		max-width: 900px;
	}
</style>
