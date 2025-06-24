<script lang="ts">
	// Copyright 2024 IOTA Stiftung.
	// SPDX-License-Identifier: Apache-2.0.
	import { page } from '$app/stores';
	import DocumentView from '$components/document/documentView.svelte';
</script>

<DocumentView itemId={$page.params.id} />
