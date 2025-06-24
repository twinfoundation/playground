<script lang="ts">
	// Copyright 2024 IOTA Stiftung.
	// SPDX-License-Identifier: Apache-2.0.
	import { goto } from '$app/navigation';
	import { Is } from '@twin.org/core';
	import type { IRule, IRuleGroup } from '@twin.org/data-processing-models';
	import {
		Button,
		Heading,
		i18n,
		Icons,
		Label,
		ModalYesNo,
		P,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from '@twin.org/ui-components-svelte';
	import { onMount } from 'svelte';
	import { ruleGroupGet, ruleGroupSet } from '$stores/dataProcessing';

	export let itemId: string;
	export let returnUrl: string;

	let ruleGroup: IRuleGroup | undefined;
	let rules: IRule[] | undefined;
	let busy = false;
	let status = '';
	let isError = false;
	let confirmationIndex: number = -1;
	let modalIsBusy = false;

	async function loadData(loadId: string): Promise<void> {
		status = $i18n('pages.dataProcessingRuleGroupRuleList.loading');
		busy = true;
		isError = false;
		const result = await ruleGroupGet(loadId);

		if (Is.stringValue(result?.error)) {
			isError = true;
			status = result.error;
		} else if (Is.object(result?.item)) {
			ruleGroup = result.item;
			rules = result.item.rules;
			status = '';
		}
		busy = false;
	}

	async function removePrompt(index: number): Promise<void> {
		confirmationIndex = index;
	}

	async function removeCancel(): Promise<void> {
		confirmationIndex = -1;
		modalIsBusy = false;
	}

	async function remove(): Promise<void> {
		if (confirmationIndex > -1 && Is.object(ruleGroup) && Is.arrayValue(rules)) {
			modalIsBusy = true;
			rules.splice(confirmationIndex, 1);
			rules = rules.slice();
			await ruleGroupSet({
				...ruleGroup,
				rules
			});
			modalIsBusy = false;
			confirmationIndex = -1;
		}
	}

	onMount(async () => {
		if (Is.stringValue(itemId)) {
			await loadData(itemId);
		}
	});
</script>

<section class="flex flex-col items-start justify-center gap-5">
	<Heading tag="h4"
		>{$i18n('pages.dataProcessingRuleGroupRuleList.title')}: {ruleGroup?.label}</Heading
	>
	<div class="items-left flex flex-col justify-end gap-2 sm:w-full sm:flex-row sm:items-center">
		<div class="flex flex-row gap-2">
			{#if busy}
				<Spinner />
			{/if}
			{#if Is.stringValue(status)}
				<P class={isError ? 'text-red-600' : ''}>{status}</P>
			{/if}
		</div>
	</div>

	<div class="flex w-full justify-end gap-4">
		<Button
			class="w-50"
			on:click={() => goto(`/secure/data-processing/${itemId}/rules/create`)}
			disabled={busy}>{$i18n('pages.dataProcessingRuleGroupRuleList.createRule')}</Button
		>
	</div>

	{#if Is.arrayValue(rules)}
		<Table>
			<TableHead>
				<TableHeadCell>{$i18n('pages.dataProcessingRuleGroupRuleList.source')}</TableHeadCell>
				<TableHeadCell>{$i18n('pages.dataProcessingRuleGroupRuleList.target')}</TableHeadCell>
				<TableHeadCell>{$i18n('pages.dataProcessingRuleGroupRuleList.actions')}</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each rules as item, idx}
					<TableBodyRow>
						<TableBodyCell wrap>{item.source}</TableBodyCell>
						<TableBodyCell wrap>{item.target}</TableBodyCell>
						<TableBodyCell class="flex flex-row gap-2">
							<Button
								size="xs"
								color="plain"
								on:click={() =>
									goto(`/secure/data-processing/${encodeURIComponent(itemId)}/rules/${idx}`)}
								><Icons.EditOutline /></Button
							><Button size="xs" color="plain" on:click={async () => removePrompt(idx)}
								><Icons.TrashBinOutline /></Button
							>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<ModalYesNo
			title={$i18n('pages.dataProcessingRuleGroupRuleList.deleteTitle')}
			open={confirmationIndex > -1}
			message={$i18n('pages.dataProcessingRuleGroupRuleList.deleteMessage')}
			busy={modalIsBusy}
			yesColor="error"
			yesAction={async () => remove()}
			noAction={async () => removeCancel()}
		/>
	{:else}
		<Label>
			{$i18n('pages.dataProcessingRuleGroupRuleList.noItems')}
		</Label>
	{/if}
	<div class="flex flex-row gap-2">
		<Button on:click={() => goto(returnUrl)}>{$i18n('actions.back')}</Button>
	</div>
</section>
