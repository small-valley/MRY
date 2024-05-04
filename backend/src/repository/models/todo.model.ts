export interface GetTodoModel {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
}

export interface PostTodoModel
  extends Omit<GetTodoModel, "id" | "isCompleted"> {}

export interface PutTodoModel extends GetTodoModel {}
