import * as AzureStorage from 'azure-storage';

const tableService = AzureStorage.createTableService(process.env['AzureWebJobsStorage']);
const queueService = AzureStorage.createQueueService(process.env['AzureWebJobsStorage']);
queueService.messageEncoder = new AzureStorage.QueueMessageEncoder.TextBase64QueueMessageEncoder();
const blobService = AzureStorage.createBlobService(process.env['AzureWebJobsStorage']);

export function todo2TodoEntity(todo) {
  const todoEntry = {
    PartitionKey: process.env['PartitionKey'],
    RowKey: todo.id,
    createdTime: todo.createdTime,
    taskDescription: todo.taskDescription,
    isCompleted: todo.isCompleted
  }

  return todoEntry;
}

export function todoEntity2Todo(todoEntity) {
  const todo = {
    id: todoEntity.RowKey,
    createdTime: todoEntity.createdTime,
    taskDescription: todoEntity.taskDescription,
    isCompleted: todoEntity.isCompleted
  }

  return todo;
}

export async function queryAllTodos() {
	return new Promise((resolve, reject) => 
		tableService.queryEntities(process.env['TableName'], 
			null, 
			null,
			(err, res) => {
				if (err) {
					console.log('error', err);
				}
				resolve(res)
			}
		)
	)
}

export async function createTodo(todoEntry) {
	return new Promise((resolve, reject) => 
		tableService.insertEntity(process.env['TableName'], 
			todoEntry,
			(err, res) => {
				if (err) {
					console.log('error', err);
				}
				resolve(res)
			}
		)
	)
}

export async function retrieveTodo(id) {
  return new Promise((resolve, reject) => 
    tableService.retrieveEntity(
			process.env['TableName'], 
      process.env['PartitionKey'],
			id,
			(err, res) => {
				if (err) {
					console.log('error', err);
				}
				resolve(res)
			}
		)
	)
}

export async function updateTodo(todoEntity) {
	return new Promise((resolve, reject) => 
		tableService.replaceEntity(
			process.env['TableName'], 
			todoEntity,
			(err, res) => {
				if (err) {
					console.log('error', err);
				}
				resolve(res)
			}
		)
	)
}

export async function deleteTodo(todoEntity) {
  return new Promise((resolve, reject) => 
    tableService.deleteEntity(
			process.env['TableName'], 
      todoEntity,
			(err, res) => {
				if (err) {
					console.log('error', err);
				}
				resolve(res)
			}
		)
	)
}

export async function writeToQueue(todo) {
	const msg = JSON.stringify(todo);
	return new Promise((resolve, reject) => 
		queueService.createMessage(
			process.env['QueueName'], 
      msg,
			(err, res) => {
				if (err) {
					console.log('error', err);
				}
				resolve(res)
			}
		)
	)
}

export async function createContainerIfNotExists(name) {
	return new Promise((resolve, reject) => 
		blobService.createContainerIfNotExists(name, 
			(err, res) => {
				if (err) {
					console.log('error', err);
				}
				resolve(res)
			}
		)
	)
}

export async function writeToBlob(todo) {
	await createContainerIfNotExists(process.env['ContainerName']);
	return new Promise((resolve, reject) => 
		blobService.createAppendBlobFromText(
			process.env['ContainerName'],
			todo.id, 
      todo.taskDescription,
			(err, res) => {
				if (err) {
					console.log('error', err);
				}
				resolve(res)
			}
		)
	)
}