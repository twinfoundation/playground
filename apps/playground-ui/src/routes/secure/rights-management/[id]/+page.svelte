<script lang="ts">
	// Copyright 2024 IOTA Stiftung.
	// SPDX-License-Identifier: Apache-2.0.
	import { page } from '$app/stores';
	import RightsManagementProperties from '$components/rightsManagement/rightsManagementProperties.svelte';
</script>

<RightsManagementProperties itemId={$page.params.id} returnUrl="/secure/rights-management" />
