
import { AzureFunction, Context } from "@azure/functions";
import { writeToBlob } from '../shared/azure-storage-utils';
import { Todo } from './../shared/models';

const queueTrigger: AzureFunction = async function (
  context: Context,
  todo: Todo
): Promise<void> {
  context.log("Queue trigger function processed work item", todo);
  const res = writeToBlob(todo);
  console.log('writeToBlob:', res);
};

export default queueTrigger;
