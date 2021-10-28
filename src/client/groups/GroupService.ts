import { HDict, HGrid, HMarker, HRef } from 'haystack-core'
import { ClientServiceConfig } from '../ClientServiceConfig'
import { fetchVal } from '../fetchVal'

interface Group extends HDict {
	id: HRef
	userGroup: HMarker
}

export class GroupService<T extends Group = Group> {
	/**
	 * The client service configuration.
	 */
	readonly #serviceConfig: ClientServiceConfig

	/**
	 * The url for the service.
	 */
	readonly #url: string

	public constructor(serviceConfig: ClientServiceConfig) {
		this.#serviceConfig = serviceConfig
		this.#url = serviceConfig.getHostServiceUrl('groups')
	}

	public async readAll(): Promise<T[]> {
		const groups = await fetchVal<HGrid<T>>(
			`${this.#url}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
			},
			this.#serviceConfig.fetch
		)

		if (groups.isEmpty()) {
			return []
		}

		return groups.getRows()
	}

	public async readGroupById(id: string | HRef): Promise<T> {
		const group = await fetchVal<T>(
			`${this.#url}/${HRef.make(id).value}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
			},
			this.#serviceConfig.fetch
		)

		return group
	}

	public async createGroups(groups: T | T[]): Promise<T> {
		return fetchVal<T>(
			`${this.#url}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
				method: 'POST',
				body: JSON.stringify(HDict.make(groups.toDict()).toJSON()),
			},
			this.#serviceConfig.fetch
		)
	}

	public async deleteGroup(id: string | HRef): Promise<void> {
		await fetchVal<HRef>(
			`${this.#url}/${HRef.make(id).value}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
				method: 'DELETE',
			},
			this.#serviceConfig.fetch
		)
	}

	public async updateGroup(id: string | HRef): Promise<T> {
		return fetchVal<T>(
			`${this.#url}/${HRef.make(id).value}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
				method: 'PATCH',
			},
			this.#serviceConfig.fetch
		)
	}
}
