<script lang="ts">
	// Copyright 2024 IOTA Stiftung.
	// SPDX-License-Identifier: Apache-2.0.
	import { page } from '$app/stores';
	import AuditableItemStreamEntryProperties from '$components/auditableItemStream/auditableItemStreamEntryProperties.svelte';
</script>

<AuditableItemStreamEntryProperties streamId={$page.params.id} entryId={$page.params.entryId} />
