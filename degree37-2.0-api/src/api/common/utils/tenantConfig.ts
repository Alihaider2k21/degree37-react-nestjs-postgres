import { TenantConfigurationDetail } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantConfigurationDetail';
import { Repository } from 'typeorm';

/**
 * The function `getTenantConfig` retrieves a tenant configuration detail from a repository based on
 * the provided parameters.
 * @param repository - The `repository` parameter is an instance of a repository class that is used to
 * interact with the database and retrieve the tenant configuration details.
 * @param {bigint} tenantId - The `tenantId` parameter is a unique identifier for a specific tenant. It
 * is of type `bigint`, which typically represents large integers.
 * @param [elementName=bbcs_client_evironment] - The `elementName` parameter is a string that
 * represents the name of the element or configuration setting that you want to retrieve from the
 * tenant configuration. In this case, it is set to `'bbcs_client_evironment'`.
 * @param [secretKey=apiKey] - The `secretKey` parameter is a string that represents the secret key
 * used to retrieve the tenant configuration. In this case, it is set to the value `'apiKey'`.
 * @returns a Promise that resolves to either a TenantConfigurationDetail object or null.
 */
export const getTenantConfig = async (
  repository: Repository<TenantConfigurationDetail>,
  tenantId: bigint,
  elementName = 'bbcs_client_evironment',
  secretKey = 'apiKey'
): Promise<null | TenantConfigurationDetail> => {
  const tenantConfig = await repository.findOneBy({
    tenant_id: {
      id: tenantId,
    } as any,
    element_name: elementName,
    secret_key: secretKey,
  });
  if (tenantConfig !== null) return tenantConfig;
  console.error('Tenant Config not found for BBCS');
  return null;
};
