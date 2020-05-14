import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { retrieveTodo, deleteTodo } from "../shared/azure-storage-utils";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const id = context.bindingData.id;
  if (!id) {
    context.res = {
      status: 400,
      body: 'Bad request.'
    }
  } else {
    const res = await retrieveTodo(id);
    if (!res) {
      context.res = {
        status: 404,
        body: 'Not found.'
      } 
    } else {
      if (deleteTodo(res)) {
        context.res = {
          status: 200
        } 
      } else {
        context.res = {
          status: 500,
          body: 'Server error'
        }
      }
    }
  }

};

export default httpTrigger;
