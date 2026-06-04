import {
  PasswordComparatorAdapter,
  PasswordHasherAdapter,
  TokensGeneratorAdapter,
  IdGeneratorAdapter,
  TokenVerifierAdapter,
} from "../../adapters/index.js";
import {
  CreateUserController,
  DeleteUserController,
  GetUserBalanceController,
  GetUserByIdController,
  UpdateUserController,
  LoginUserController,
  RefreshTokenController,
} from "../../controllers/index.js";

import {
  PostgresCreateUserRepository,
  PostgresDeleteUserRepository,
  PostgresGetUserBalanceRepository,
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateUserRepository,
} from "../../repositories/postgres/index.js";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserBalanceUseCase,
  GetUserByIdUseCase,
  LoginUserUseCase,
  UpdateUserUseCase,
  RefreshTokenUseCase,
} from "../../use-cases/index.js";

export const makeGetUserByIdController = () => {
  const getUserByIdUseRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdUseRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

  return getUserByIdController;
};

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();

  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
    tokensGeneratorAdapter,
  );

  const createUserController = new CreateUserController(createUserUseCase);

  return createUserController;
};

export const makeUpdateUserController = () => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();

  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository,
    idGeneratorAdapter,
  );

  const updateUserController = new UpdateUserController(updateUserUseCase);

  return updateUserController;
};

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  return deleteUserController;
};

export const makeGetUserBalanceController = () => {
  const getUserBalanceRepository = new PostgresGetUserBalanceRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserBalanceUseCase = new GetUserBalanceUseCase(
    getUserBalanceRepository,
    getUserByIdRepository,
  );
  const getUserBalanceController = new GetUserBalanceController(
    getUserBalanceUseCase,
  );

  return getUserBalanceController;
};

export const makeLoginUserController = () => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const passwordComparatorAdapter = new PasswordComparatorAdapter();
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  const loginUserUseCase = new LoginUserUseCase(
    getUserByEmailRepository,
    passwordComparatorAdapter,
    tokensGeneratorAdapter,
  );
  const loginUserController = new LoginUserController(loginUserUseCase);

  return loginUserController;
};

export const makeRefreshTokenController = () => {
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  const tokenVerifierAdapter = new TokenVerifierAdapter();
  const refreshTokenUseCase = new RefreshTokenUseCase(
    tokensGeneratorAdapter,
    tokenVerifierAdapter,
  );
  const refreshTokenController = new RefreshTokenController(
    refreshTokenUseCase,
  );

  return refreshTokenController;
};
