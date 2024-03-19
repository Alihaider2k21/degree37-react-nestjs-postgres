async function keyCloakAuth(realmName) {
  const { default: KeycloakAdminClient } = await import(
    '@keycloak/keycloak-admin-client'
  );

  const keycloakAuth = new KeycloakAdminClient({
    baseUrl: process.env.REACT_APP_KEYCLOAK_URL,
    realmName: realmName,
  });

  return keycloakAuth;
}

async function keyCloakAdmin() {
  const kcAuth = await keyCloakAuth(process.env.REACT_APP_MASTER_REALM);

  await kcAuth.auth({
    username: process.env.REACT_APP_KEYCLOAK_ADMIN_NAME,
    password: process.env.REACT_APP_KEYCLOAK_ADMIN_PASSWORD,
    grantType: process.env.REACT_APP_KEYCLOAK_GRANT_TYPE,
    clientId: process.env.REACT_APP_KEYCLOAK_ADMIN_CLIENT_ID,
  });

  return kcAuth;
}

export { keyCloakAuth, keyCloakAdmin };
