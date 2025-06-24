<script lang="ts">
	// Copyright 2024 IOTA Stiftung.
	// SPDX-License-Identifier: Apache-2.0.
	import { page } from '$app/stores';
	import DocumentProperties from '$components/document/documentProperties.svelte';
</script>

<DocumentProperties itemId={$page.params.id} returnUrl="/secure/document" />
