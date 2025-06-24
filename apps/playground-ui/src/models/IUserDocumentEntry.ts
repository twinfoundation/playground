// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Interface representing information for documents.
 */
export interface IUserDocumentEntry {
	/**
	 * The id for the entry.
	 */
	id: string;

	/**
	 * The documentId for the entry.
	 */
	documentId: string;

	/**
	 * The document revision.
	 */
	revision?: number;

	/**
	 * The date the document was created.
	 */
	dateCreated: string;

	/**
	 * The date when the document was last updated.
	 */
	lastUpdated?: string;
}
