import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { retrieveSecretValue } from '../shared/azure-keyvalut-utils';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const body = await retrieveSecretValue();
  context.log("retrieved secret value", body);
  
  const name = body['name'];
  const value = body['value'];
  const ret = {};
  ret[name] = value;

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: ret
  };
};

export default httpTrigger;
