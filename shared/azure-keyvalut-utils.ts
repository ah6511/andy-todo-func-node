// import * as DefaultAzureCredential from "@azure/identity";
// import * as SecretClient from '@azure/keyvault-secrets';
// const { DefaultAzureCredential } = require("@azure/identity");
//const { ClientSecretCredential } = require("@azure/identity");
// const { SecretClient } = require("@azure/keyvault-secrets");
import { DefaultAzureCredential, ClientSecretCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export async function retrieveSecretValue() {
  const credential = new DefaultAzureCredential();
  //const credential = new ClientSecretCredential(process.env['AZURE_TENANT_ID'], process.env['AZURE_CLIENT_ID'], process.env['AZURE_CLIENT_SECRET']);

  const url = `https://${process.env['KEYVAULT_NAME']}.vault.azure.net`;
  const client = new SecretClient(url, credential);

  const secretName = process.env['KEYVAULT_SECRET_NAME'];
  const secretValue = await client.getSecret(secretName);

  return secretValue;
}
