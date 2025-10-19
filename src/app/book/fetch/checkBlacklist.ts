/* eslint-disable sonarjs/no-ignored-exceptions */
import { NoonaHQ } from 'lib/api'

import { getBlacklistGroupId } from './getCustomerGroups'

interface CheckBlacklistParams {
  email: string
  phone_number: string
  phone_country_code: string
}

// Cache the blacklist group ID to avoid fetching it every time
let cachedBlacklistGroupId: string | null | undefined

/**
 * Check if customer is in blacklist by group ID
 */
const isCustomerInBlacklistById = (customer: any, blacklistGroupId: string): boolean => {
  // Check groups array for matching ID
  if (customer.groups && Array.isArray(customer.groups)) {
    if (customer.groups.includes(blacklistGroupId)) {
      return true
    }
  }

  // Check group_id field
  if (customer.group_id === blacklistGroupId) {
    return true
  }

  // Check customer_group_id field
  return customer.customer_group_id === blacklistGroupId
}

/**
 * Check if customer is in blacklist by group name
 */
const isCustomerInBlacklistByName = (customer: any): boolean => {
  // Check customer_group field
  if (customer.customer_group) {
    if (
      typeof customer.customer_group === 'string' &&
      customer.customer_group.toLowerCase() === 'blacklist'
    ) {
      return true
    }
    if (
      typeof customer.customer_group === 'object' &&
      customer.customer_group.name &&
      customer.customer_group.name.toLowerCase() === 'blacklist'
    ) {
      return true
    }
  }

  // Check customer_groups array
  if (customer.customer_groups && Array.isArray(customer.customer_groups)) {
    const isBlacklisted = customer.customer_groups.some(
      (group: any) =>
        (typeof group === 'string' && group.toLowerCase() === 'blacklist') ||
        (typeof group === 'object' && group.name && group.name.toLowerCase() === 'blacklist'),
    )
    if (isBlacklisted) {
      return true
    }
  }

  // Check customer_group_name field
  if (customer.customer_group_name) {
    if (customer.customer_group_name.toLowerCase() === 'blacklist') {
      return true
    }
  }

  return false
}

/**
 * Check if any customer in the list is blacklisted
 */
const checkCustomersBlacklist = (customers: any[], blacklistGroupId: string | null): boolean => {
  for (const customer of customers) {
    // First, check by group ID if we have the blacklist group ID
    if (blacklistGroupId && isCustomerInBlacklistById(customer, blacklistGroupId)) {
      return true
    }

    // Fallback: Check by name
    if (isCustomerInBlacklistByName(customer)) {
      return true
    }
  }

  return false
}

/**
 * Fetch customer data by email or phone
 */
const fetchCustomerData = async (
  companyId: string,
  email: string,
  phone_number: string,
  phone_country_code: string,
): Promise<any> => {
  try {
    const response = await NoonaHQ.get(
      `/${companyId}/customers?search=${encodeURIComponent(email)}`,
    )
    return response.data
  } catch (_err: any) {
    // Try searching by phone
    const phoneWithCode = `${phone_country_code}${phone_number}`.replace(/\s/g, '')
    try {
      const response = await NoonaHQ.get(
        `/${companyId}/customers?search=${encodeURIComponent(phoneWithCode)}`,
      )
      return response.data
    } catch (_phoneErr: any) {
      // Customer not found at all - not blacklisted (they might be a new customer)
      return null
    }
  }
}

/**
 * Checks if a customer is in the blacklist
 * Returns true if customer is blacklisted
 * Returns false if customer is not blacklisted
 */
export const checkBlacklist = async ({
  email,
  phone_number,
  phone_country_code,
}: CheckBlacklistParams): Promise<boolean> => {
  try {
    const companyId = process.env.NOONA_COMPANY_ID

    if (!companyId) {
      return false
    }

    // Get the blacklist group ID (cached after first call)
    if (cachedBlacklistGroupId === undefined) {
      cachedBlacklistGroupId = await getBlacklistGroupId()
    }

    // Search for customer by email or phone
    const customerData = await fetchCustomerData(companyId, email, phone_number, phone_country_code)

    if (!customerData) {
      return false
    }

    // Handle both array and single object responses
    const customers = Array.isArray(customerData) ? customerData : [customerData]

    return checkCustomersBlacklist(customers, cachedBlacklistGroupId)
  } catch (error: any) {
    console.error('❌ Error checking blacklist:', error)
    console.error('Error details:', error.response?.data || error.message)
    // In case of error, we allow the booking to proceed
    // to avoid blocking legitimate customers due to API issues
    return false
  }
}
