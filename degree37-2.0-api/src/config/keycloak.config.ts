import * as dotenv from 'dotenv';
dotenv.config();

async function keyCloakAuth(realmName: any): Promise<any> {
  const { default: KeycloakAdminClient } = await import(
    '@keycloak/keycloak-admin-client'
  );

  const keycloakAuth = new KeycloakAdminClient({
    baseUrl: process.env.KEYCLOAK_URL,
    realmName: realmName,
  });

  return keycloakAuth;
}

async function keyCloakAdmin(): Promise<any> {
  const kcAuth = await keyCloakAuth(process.env.MASTER_REALM);

  await kcAuth.auth({
    username: process.env.KEYCLOAK_ADMIN_NAME,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD,
    grantType: process.env.KEYCLOAK_GRANT_TYPE,
    clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
  });

  return kcAuth;
}

export { keyCloakAuth, keyCloakAdmin };
