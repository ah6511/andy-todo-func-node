import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { v4 as uuid } from 'uuid';
// import * as appInsights from 'applicationinsights';
import { retrieveBlobStorageConnectioon } from '../shared/azure-keyvalut-utils';

import { todo2TodoEntity, createTodo, writeToQueue } from '../shared/azure-storage-utils';
import { Todo } from '../shared/models';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const taskDescription = req.body && req.body.taskDescription;
  if (!taskDescription) {
		// const client = appInsights.defaultClient;
		// client.trackTrace({message: `Missing task description`, severity: appInsights.Contracts.SeverityLevel.Error});
		
		context.res = {
			status: 400,
			body: 'Missing task description.'
		}
	}	else {
		const todo: Todo = {
			id: uuid(),
			createdTime: new Date(),
			taskDescription,
			isCompleted: false
		}
		
		const conn = await retrieveBlobStorageConnectioon();
		const todoEntity = todo2TodoEntity(todo);

		const res = await createTodo(conn, todoEntity);
		await writeToQueue(todo);
		if (res) {
			context.res = {
				status: 200,
				body: todo
			}
		} else {
			context.res = {
				status: 500,
				body: 'Server error.'
			}
		}
	}

};

export default httpTrigger;
