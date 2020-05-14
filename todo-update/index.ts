import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { todoEntity2Todo, retrieveTodo, updateTodo } from "../shared/azure-storage-utils";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const id = context.bindingData.id;
  if (!id || !req.body || req.body.isCompleted === undefined) {
    context.res = {
      status: 400,
      body: 'Bad request.'
    }
  } else {
    const isCompleted = req.body.isCompleted;
    const res = await retrieveTodo(id);
    if (!res) {
      context.res = {
        status: 404,
        body: 'Not found.'
      } 
    } else {
      res['isCompleted']['_'] = isCompleted;
      if (updateTodo(res)) {
        const todo = todoEntity2Todo(res);
        context.res = {
          status: 200,
          body: todo
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
