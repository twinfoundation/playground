// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Converter, StringHelper, Urn } from "@twin.org/core";
let explorerUrl = "";
let iotaNetwork = "";

/**
 * Initialise the IOTA store.
 * @param envExplorerUrl The url for explorer.
 * @param envIotaNetwork The network of IOTA to use.
 */
export async function init(envExplorerUrl: string, envIotaNetwork: string): Promise<void> {
	explorerUrl = StringHelper.trimTrailingSlashes(envExplorerUrl);
	iotaNetwork = envIotaNetwork;
}

/**
 * Create an explorer URL for a verifiable storage address.
 * @param verifiableStorageId The verifiable storage ID to create the url for.
 * @returns The explorer URL for the address.
 */
export function createExplorerVerifiableStorageUrl(
	verifiableStorageId: string
): string | undefined {
	const parts = verifiableStorageId.split(":");

	if (parts.length >= 4) {
		return createExplorerUrl(`object/${parts[3]}?network=${iotaNetwork}`);
	}
}

/**
 * Create an identity explorer URL.
 * @param identity The identity to create the url for.
 * @returns The identity url.
 */
export function createExplorerIdentityUrl(identity: string): string | undefined {
	const parts = identity.split(":");

	if (parts.length >= 4) {
		return createExplorerUrl(`object/${parts[3]}?network=${iotaNetwork}`);
	}
}

/**
 * Create an nft explorer URL.
 * @param nftId The nft id to create the url for.
 * @returns The nft id url.
 */
export function createExplorerNftUrl(nftId: string): string | undefined {
	const parts = nftId.split(":");
	if (parts.length >= 5) {
		const nftObjectId = parts[4];
		return `${explorerUrl}/object/${nftObjectId}?network=${iotaNetwork}`;
	}
}

/**
 * Create an epoch explorer URL.
 * @param epoch The epoch create the url for.
 * @returns The epoch url.
 */
export function createExplorerEpochUrl(epoch: string): string | undefined {
	return createExplorerUrl(`epoch/${epoch}?network=${iotaNetwork}`);
}

/**
 * Create a digest explorer URL.
 * @param digest The digest create the url for.
 * @returns The digest url.
 */
export function createExplorerDigestUrl(digest: string): string | undefined {
	return createExplorerUrl(`txblock/${digest}?network=${iotaNetwork}`);
}

/**
 * Create an explorer URL.
 * @param resourcePath The resource path.
 * @returns The combined explorer url base and resource path.
 */
export function createExplorerUrl(resourcePath: string): string {
	return `${explorerUrl}/${StringHelper.trimLeadingSlashes(resourcePath)}`;
}

/**
 * Convert an attestation id to an nft id.
 * @param attestationId The attestation id to convert.
 * @returns The address.
 */
export function attestationIdToNftId(attestationId: string): string {
	const attestationUrn = Urn.fromValidString(attestationId);
	const nftId = Urn.fromValidString(
		Converter.bytesToUtf8(Converter.base64ToBytes(attestationUrn.namespaceSpecific(1)))
	);
	return nftId.toString();
}
