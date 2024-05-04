export interface PutTodoRequest {
    todoId: string;
    title: string;
    description: string;
    dueDate: Date;
    isCompleted: boolean;
}
