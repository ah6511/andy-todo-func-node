import { AzureFunction, Context, HttpRequest } from "@azure/functions";
// import * as appInsights from 'applicationinsights';
import { retrieveBlobStorageConnectioon } from '../shared/azure-keyvalut-utils';

import { Todo } from '../shared/models';
import { queryAllTodos } from '../shared/azure-storage-utils';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
	context.log("HTTP trigger function processed a request.");
	const conn = await retrieveBlobStorageConnectioon();
	const res = await queryAllTodos(conn);

	// const client = appInsights.defaultClient;
	// client.trackRequest()
	// client.trackTrace({message: `Missing task description`, severity: appInsights.Contracts.SeverityLevel.Error});
	
	const ret = [];
	if (res && res['entries']) {
		res['entries'].forEach(element => {
			const todo: Todo = {
				id: element.RowKey._,
				createdTime: element.createdTime._,
				taskDescription: element.taskDescription._,
				isCompleted: element.isCompleted._
			};
			ret.push(todo);
		});
	}
  context.res = {
    status: 200,
    body: ret
  };
};

export default httpTrigger;
