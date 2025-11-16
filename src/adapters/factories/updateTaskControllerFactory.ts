import {
  DbUpdateTask,
  LogErrorMongoRepository,
  TaskMongoRepository,
} from "../../dataSources";
import { UpdateTaskController } from "../controllers/task/updateTask";
import { LogErrorControllerDecorator } from "../decorators/logErrorControllerDecorator";
import { updateTaskValidationCompositeFactory } from "./updateTaskValidationCompositeFactory";

export const updateTaskControllerFactory = () => {
  const taskMongoRepository = new TaskMongoRepository();
  const updateAddTask = new DbUpdateTask(taskMongoRepository);
  const taskController = new UpdateTaskController(
    updateAddTask,
    updateTaskValidationCompositeFactory()
  );
  const logErrorMongoRepository = new LogErrorMongoRepository();
  return new LogErrorControllerDecorator(
    taskController,
    logErrorMongoRepository
  );
};
