import * as AzureStorage from 'azure-storage';

let tableService;
let queueService;
let blobService;

function initServices(connStr) {
	if (tableService && queueService && blobService) {
		return
	}
	tableService = AzureStorage.createTableService(connStr);
	queueService = AzureStorage.createQueueService(connStr);
	queueService.messageEncoder = new AzureStorage.QueueMessageEncoder.TextBase64QueueMessageEncoder();
	blobService = AzureStorage.createBlobService(connStr);	
}

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

export async function queryAllTodos(connStr) {
	initServices(connStr);
	
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

export async function createTodo(connStr, todoEntry) {
	initServices(connStr);
	
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

export async function retrieveTodo(connStr, id) {
	initServices(connStr);
	
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

export async function updateTodo(connStr, todoEntity) {
	initServices(connStr);
	
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

export async function deleteTodo(connStr, todoEntity) {
	initServices(connStr);
	
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