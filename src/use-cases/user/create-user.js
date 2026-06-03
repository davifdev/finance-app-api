import { EmailAlreadyInUser } from "../../errors/user.js";
export class CreateUserUseCase {
  constructor(
    getUserByEmailRepository,
    createUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
    tokensGeneratorAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.createUserRepository = createUserRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.tokensGeneratorAdapter = tokensGeneratorAdapter;
  }

  async execute(createUserParams) {
    const userWithProviderEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    );

    if (userWithProviderEmail) {
      throw new EmailAlreadyInUser(createUserParams.email);
    }

    const userId = this.idGeneratorAdapter.execute();
    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    );

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const createrUser = await this.createUserRepository.execute(user);

    const tokens = this.tokensGeneratorAdapter.execute(userId);

    return {
      ...createrUser,
      tokens,
    };
  }
}
