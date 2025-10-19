import { NoonaHQ } from 'lib/api'

/**
 * Gets all customer groups for the company
 * Returns the Blacklist group ID if it exists
 */
export const getBlacklistGroupId = async (): Promise<string | null> => {
  try {
    const companyId = process.env.NOONA_COMPANY_ID

    const response = await NoonaHQ.get(`/${companyId}/customer_groups`)
    const groups = response.data

    if (Array.isArray(groups)) {
      const blacklistGroup = groups.find(
        (group: any) =>
          (group.title && group.title.toLowerCase() === 'blacklist') ||
          (group.name && group.name.toLowerCase() === 'blacklist'),
      )

      if (blacklistGroup) {
        return blacklistGroup.id || blacklistGroup._id || null
      }
    }

    return null
  } catch (error: any) {
    console.error('Error fetching customer groups:', error)
    return null
  }
}
