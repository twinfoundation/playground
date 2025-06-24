// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ErrorHelper, Is } from "@twin.org/core";
import { EntityStorageClient } from "@twin.org/entity-storage-rest-client";
import type { IUserAttestationEntry } from "$models/IUserAttestationEntry";

let userAttestationEntryClient: EntityStorageClient<IUserAttestationEntry> | undefined;

/**
 * Initialise the attestations.
 * @param apiUrl The API url.
 */
export async function init(apiUrl: string): Promise<void> {
	userAttestationEntryClient = new EntityStorageClient<IUserAttestationEntry>({
		endpoint: apiUrl,
		pathPrefix: "user-attestation"
	});
}

/**
 * Get an entry from the attestations.
 * @param id The id of the entry to get.
 * @returns The nothing unless there was an error.
 */
export async function attestationsEntryGet(id: string): Promise<
	| {
			error?: string;
			item?: IUserAttestationEntry;
	  }
	| undefined
> {
	if (Is.object(userAttestationEntryClient)) {
		try {
			const result = await userAttestationEntryClient.get(id);
			return {
				item: result as IUserAttestationEntry
			};
		} catch (err) {
			return {
				error: ErrorHelper.formatErrors(err).join("\n")
			};
		}
	}
}

/**
 * Get a list of the attestations.
 * @param cursor The cursor to use for pagination.
 * @returns The list of attestations.
 */
export async function attestationEntryList(cursor?: string): Promise<
	| {
			error?: string;
			items?: IUserAttestationEntry[];
			cursor?: string;
	  }
	| undefined
> {
	if (Is.object(userAttestationEntryClient)) {
		try {
			const result = await userAttestationEntryClient.query(
				undefined,
				undefined,
				undefined,
				undefined,
				cursor
			);
			return {
				items: result.entities as IUserAttestationEntry[],
				cursor: result.cursor
			};
		} catch (err) {
			return {
				error: ErrorHelper.formatErrors(err).join("\n")
			};
		}
	}
}

/**
 * Add an entry to the list of the attestations.
 * @param entry The entry to add.
 * @returns The nothing unless there was an error.
 */
export async function attestationsEntrySet(entry: IUserAttestationEntry): Promise<
	| {
			error?: string;
	  }
	| undefined
> {
	if (Is.object(userAttestationEntryClient)) {
		try {
			await userAttestationEntryClient.set(entry);
			return {};
		} catch (err) {
			return {
				error: ErrorHelper.formatErrors(err).join("\n")
			};
		}
	}
}

/**
 * Remove an entry to the list of the attestations.
 * @param entryId The id of entry to remove.
 * @returns The nothing unless there was an error.
 */
export async function attestationsEntryRemove(entryId: string): Promise<
	| {
			error?: string;
	  }
	| undefined
> {
	if (Is.object(userAttestationEntryClient)) {
		try {
			await userAttestationEntryClient.remove(entryId);
			return {};
		} catch (err) {
			return {
				error: ErrorHelper.formatErrors(err).join("\n")
			};
		}
	}
}
