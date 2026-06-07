import { IdGeneratorAdapter } from "../../adapters/id-generator.js";
import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionByUserIdController,
  UpdateTransactionController,
} from "../../controllers/index.js";
import {
  PostgresCreateTransactionRepository,
  PostgresGetUserByIdRepository,
  PostgresGetTransactionByUserIdRepository,
  PostgresUpdateTransactionRepository,
  PostgresDeleteTransactionRepository,
  PostgresGetTransactionByIdRepository,
} from "../../repositories/postgres/index.js";

import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  GetTransactionsByUserIdUseCase,
  UpdateTransactionUseCase,
} from "../../use-cases/index.js";

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();

  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository,
    idGeneratorAdapter,
  );

  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  );

  return createTransactionController;
};

export const makeGetTransactionByUserIdController = () => {
  const getTransactionByUserIdRepository =
    new PostgresGetTransactionByUserIdRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getTransactionByUserIdUseCase = new GetTransactionsByUserIdUseCase(
    getTransactionByUserIdRepository,
    getUserByIdRepository,
  );
  const getTransactionByUserIdController = new GetTransactionByUserIdController(
    getTransactionByUserIdUseCase,
  );

  return getTransactionByUserIdController;
};

export const makeUpdateTransactionController = () => {
  const getTransactionByIdRepository =
    new PostgresGetTransactionByIdRepository();
  const updateTransactionRepository = new PostgresUpdateTransactionRepository();
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
    getTransactionByIdRepository,
  );
  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  );

  return updateTransactionController;
};

export const makeDeleteTransactionController = () => {
  const getTransactionByIdRepository =
    new PostgresGetTransactionByIdRepository();
  const deleteTransactionRepository = new PostgresDeleteTransactionRepository();
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    deleteTransactionRepository,
    getTransactionByIdRepository,
  );
  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase,
  );

  return deleteTransactionController;
};
