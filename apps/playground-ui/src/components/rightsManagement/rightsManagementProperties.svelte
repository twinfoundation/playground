<script lang="ts">
	// Copyright 2024 IOTA Stiftung.
	// SPDX-License-Identifier: Apache-2.0.
	import { goto } from '$app/navigation';
	import { BaseError, Is, ObjectHelper, type IValidationFailure } from '@twin.org/core';
	import { JsonLdDataTypes, JsonLdHelper } from '@twin.org/data-json-ld';
	import { OdrlDataTypes, type IOdrlPolicy } from '@twin.org/standards-w3c-odrl';
	import {
		Button,
		Card,
		Error,
		Heading,
		i18n,
		Label,
		P,
		Select,
		Span,
		ValidatedForm,
		ValidationError,
		Textarea
	} from '@twin.org/ui-components-svelte';
	import { onMount } from 'svelte';
	import { policyGet, policyCreate, policyUpdate } from '$stores/rightsManagement';

	export let itemId: string | undefined = undefined;
	export let returnUrl: string;

	const isUpdate = Is.stringValue(itemId);
	let validationErrors: {
		[field in 'policyObject']?: IValidationFailure[] | undefined;
	} = {};
	let busy = false;
	let progress: string | undefined;
	let error: string;
	let policyId: string | undefined;
	let policyObject: IOdrlPolicy | undefined = undefined;
	let selectedType = '';
	let textAreaValue = '';
	let userSelectedType = false;
	const policyObjectExamples: IOdrlPolicy[] = [
		{
			uid: '',
			'@type': 'Set',
			'@context': 'https://www.w3.org/ns/odrl/2/',
			permission: [{ target: 'http://example.com/asset/1', action: 'use' }]
		},
		{
			uid: '',
			'@type': 'Offer',
			'@context': 'https://www.w3.org/ns/odrl/2/',
			permission: [
				{
					target: 'http://example.com/asset/2',
					action: 'display',
					constraint: [
						{
							leftOperand: 'payAmount',
							operator: 'eq',
							rightOperand: { '@value': '10', '@type': 'xsd:decimal' }
						}
					]
				}
			]
		},
		{
			uid: '',
			'@type': 'Agreement',
			'@context': 'https://www.w3.org/ns/odrl/2/',
			permission: [
				{
					target: 'http://example.com/asset/3',
					action: 'distribute',
					assignee: 'http://example.com/party/1',
					constraint: [
						{
							leftOperand: 'dateTime',
							operator: 'lt',
							rightOperand: { '@value': '2025-12-31T23:59:59Z', '@type': 'xsd:dateTime' }
						}
					]
				}
			]
		}
	];

	$: {
		if (userSelectedType && selectedType) {
			const example = policyObjectExamples.find(ex => ex['@type'] === selectedType);
			if (example) {
				const uid = isUpdate && Is.stringValue(itemId) ? itemId : '';

				example.uid = uid;
				policyObject = ObjectHelper.clone(example);
				textAreaValue = JSON.stringify(policyObject, null, 2);
				userSelectedType = false;
			}
		}
	}

	async function validate(validationFailures: IValidationFailure[]): Promise<void> {
		busy = true;

		if (!Is.json(textAreaValue)) {
			validationFailures.push({
				property: 'policyObject',
				reason: 'rightsManagement.policyObjectRequired'
			});
			return;
		}

		const parsedPolicy: IOdrlPolicy = JSON.parse(textAreaValue);

		if (!Is.object(parsedPolicy)) {
			validationFailures.push({
				property: 'policyObject',
				reason: 'rightsManagement.policyObjectRequired'
			});
			return;
		}

		try {
			await JsonLdHelper.validate(parsedPolicy, validationFailures);
		} catch (validationError) {
			const errorMessage = BaseError.fromError(validationError);
			validationFailures.push({
				property: 'policyObject',
				reason: errorMessage.message,
				properties: errorMessage.properties
			});
		}

		if (validationFailures.length === 0) {
			policyObject = parsedPolicy;
		} else {
			busy = false;
		}
	}

	async function close(): Promise<void> {
		await goto(returnUrl);
	}

	async function action(): Promise<string | undefined> {
		if (!Is.object(policyObject)) {
			return undefined;
		}

		progress = $i18n(`pages.rightsManagementProperties.progress${isUpdate ? 'Update' : ''}`);
		let result;
		if (isUpdate && Is.stringValue(itemId)) {
			policyObject.uid = itemId;
			result = await policyUpdate(policyObject);
		} else {
			result = await policyCreate(policyObject);
			policyObject.uid = result?.uid || '';
		}
		progress = '';

		if (Is.stringValue(result?.error)) {
			return result?.error;
		}

		policyId = policyObject.uid;
		busy = false;

		return undefined;
	}

	async function loadData(loadId: string): Promise<void> {
		busy = true;
		error = '';

		const result = await policyGet(loadId);
		if (Is.stringValue(result?.error)) {
			error = result.error;
		} else if (Is.objectValue(result?.item)) {
			policyObject = result.item;
			selectedType = policyObject['@type'] || '';
			textAreaValue = JSON.stringify(policyObject, null, 2);
		}

		busy = false;
	}

	$: {
		if (!textAreaValue.trim()) {
			policyObject = undefined;
		} else if (Is.json(textAreaValue)) {
			policyObject = JSON.parse(textAreaValue);
		} else {
			policyObject = undefined;
		}
	}

	onMount(async () => {
		OdrlDataTypes.registerRedirects();
		OdrlDataTypes.registerTypes();
		JsonLdDataTypes.registerTypes();
		if (Is.stringValue(itemId)) {
			await loadData(itemId);
		} else {
			busy = false;
		}
	});
</script>

<section class="flex flex-col items-start justify-center gap-5 lg:flex-row">
	<Error {error} />
	{#if !Is.stringValue(policyId)}
		<ValidatedForm
			title={$i18n(`pages.rightsManagementProperties.title${isUpdate ? 'Update' : ''}`)}
			actionButtonLabel={$i18n(`actions.${isUpdate ? 'update' : 'create'}`)}
			actionSuccessLabel={$i18n(
				`pages.rightsManagementProperties.actionSuccess${isUpdate ? 'Update' : ''}`
			)}
			validationMethod={validate}
			actionMethod={action}
			closeMethod={close}
			bind:validationErrors
			bind:busy
		>
			{#snippet fields()}
				<Label>
					{$i18n('pages.rightsManagementProperties.data')}
				</Label>
				<Textarea
					bind:value={textAreaValue}
					class="min-h-40 text-xs"
					color={Is.arrayValue(validationErrors.policyObject) ? 'error' : 'default'}
					disabled={busy}
				></Textarea>
				<ValidationError validationErrors={validationErrors.policyObject} />
				<Label>
					<Span class="text-xs">
						{$i18n('pages.rightsManagementProperties.uidMessage')}
					</Span>
				</Label>
				<Label>
					{$i18n('pages.rightsManagementProperties.selectExample')}
					<Select
						bind:value={selectedType}
						disabled={busy}
						on:change={() => (userSelectedType = true)}
					>
						<option value="">Select an example</option>
						{#each policyObjectExamples as example}
							<option value={example['@type']}>{example['@type']}</option>
						{/each}
					</Select>
				</Label>
			{/snippet}
			{#snippet afterAction()}
				{#if Is.stringValue(progress)}
					<P>{progress}</P>
				{/if}
			{/snippet}
		</ValidatedForm>
	{:else}
		<Card class="flex flex-col gap-5">
			<Heading tag="h5">
				{$i18n(`pages.rightsManagementProperties.resultTitle${isUpdate ? 'Update' : ''}`)}
			</Heading>
			{#if Is.stringValue(policyId)}
				<Label>
					{$i18n('pages.rightsManagementProperties.policyId')}
					<Span>{policyId}</Span>
				</Label>
			{/if}
			<Button on:click={async () => close()}>{$i18n('actions.close')}</Button>
		</Card>
	{/if}
</section>
