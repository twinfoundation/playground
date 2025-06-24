// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { StringHelper } from "@twin.org/core";
import { MetricType } from "@twin.org/telemetry-models";
import { i18n } from "@twin.org/ui-components-svelte";
import { get } from "svelte/store";

/**
 * Get the metric type labels.
 * @returns The metric type labels.
 */
export function getMetricTypeLabels(): { [key: number]: string } {
	const metricTypeLabels: { [key: number]: string } = {};

	for (const [key, value] of Object.entries(MetricType)) {
		metricTypeLabels[value] = get(i18n)(
			`pages.telemetryMetricProperties.metricTypes.${StringHelper.camelCase(key)}`
		);
	}

	return metricTypeLabels;
}

export const metricTypes: MetricType[] = Object.values(MetricType);
