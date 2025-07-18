<script lang="ts">
	// Copyright 2024 IOTA Stiftung.
	// SPDX-License-Identifier: Apache-2.0.
	import { page } from '$app/stores';
	import { Is, ObjectHelper } from '@twin.org/core';
	import { Icons, AppLayout, type ISideBarGroup, i18n } from '@twin.org/ui-components-svelte';
	import { authenticationState } from '$stores/authentication';
	import { privateProfile } from '$stores/identityProfile';
	import '../app.css';
	import { serverHealthStatus, serverName, serverVersion } from '$stores/information';

	let sidebarGroups: ISideBarGroup[] = [];
	let showAuthBadge = false;
	let finalInitials: string = '';
	const isSecureUrl = !$page.route.id?.startsWith('/public/');

	const loggedInNavigation = [
		{
			label: $i18n('navigation.dashboard'),
			icon: Icons.SwatchbookOutline,
			route: '/secure/dashboard'
		},
		{
			label: $i18n('navigation.blobs'),
			icon: Icons.FileOutline,
			route: '/secure/blob'
		},
		{
			label: $i18n('navigation.documents'),
			icon: Icons.FileDocOutline,
			route: '/secure/document'
		},
		{
			label: $i18n('navigation.attestations'),
			icon: Icons.ShieldCheckOutline,
			route: '/secure/attestation'
		},
		{
			label: $i18n('navigation.nft'),
			icon: Icons.FileImageOutline,
			route: '/secure/nft'
		},
		{
			label: $i18n('navigation.immutable-proof'),
			icon: Icons.ShieldCheckOutline,
			route: '/secure/immutable-proof'
		},
		{
			label: $i18n('navigation.verifiable-storage'),
			icon: Icons.FileShieldOutline,
			route: '/secure/verifiable-storage'
		},
		{
			label: $i18n('navigation.auditable-item-graphs'),
			icon: Icons.TrackingOutline,
			route: '/secure/auditable-item-graph'
		},
		{
			label: $i18n('navigation.auditable-item-streams'),
			icon: Icons.RectangleListOutline,
			route: '/secure/auditable-item-stream'
		},
		{
			label: $i18n('navigation.logging'),
			icon: Icons.BookOpenOutline,
			route: '/secure/logging'
		},
		{
			label: $i18n('navigation.telemetry'),
			icon: Icons.ChartPieOutline,
			route: '/secure/telemetry'
		},
		{
			label: $i18n('navigation.data-processing'),
			icon: Icons.UploadOutline,
			route: '/secure/data-processing'
		},
		{
			label: $i18n('navigation.rights-management'),
			icon: Icons.LockSolid,
			route: '/secure/rights-management'
		},
		{
			label: $i18n('navigation.logout'),
			icon: Icons.LockOpenOutline,
			route: '/authentication/logout'
		}
	];

	const loggedOutNavigation = [
		{
			label: $i18n('navigation.login'),
			icon: Icons.LockOutline,
			route: '/'
		}
	];

	$: {
		sidebarGroups = [];

		if ($authenticationState === 'authenticated') {
			showAuthBadge = true;
			sidebarGroups.push({
				items: loggedInNavigation
			});
		} else if ($authenticationState === 'not-authenticated') {
			showAuthBadge = false;
			sidebarGroups.push({
				items: loggedOutNavigation
			});
		}
	}

	$: {
		const initials: string[] = [];

		if (isSecureUrl) {
			const givenName = ObjectHelper.propertyGet($privateProfile, 'givenName');
			if (Is.stringValue(givenName)) {
				initials.push(givenName[0].toUpperCase());
			}

			const familyName = ObjectHelper.propertyGet($privateProfile, 'familyName');
			if (Is.stringValue(familyName)) {
				initials.push(familyName[0].toUpperCase());
			}

			if (initials.length === 0) {
				const email = ObjectHelper.propertyGet($privateProfile, 'email');
				if (Is.stringValue(email)) {
					initials.push(email[0]);
				}
			}

			finalInitials = initials.join('');
		}
	}
</script>

<AppLayout
	showSideBar={isSecureUrl}
	showFooter={isSecureUrl}
	homeNavRoute={isSecureUrl ? '/' : undefined}
	title={$i18n('app.name')}
	{sidebarGroups}
	authenticated={isSecureUrl && showAuthBadge}
	initials={finalInitials}
	profileNavRoute="/secure/identity-profile"
	serverHealthStatus={$serverHealthStatus === 'ok' ? 'success' : $serverHealthStatus}
	serverName={$serverName}
	serverVersion={$serverVersion}
>
	<slot></slot>
</AppLayout>
