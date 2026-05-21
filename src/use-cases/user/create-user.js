import { v4 as uuidv4 } from "uuid";
import { EmailAlreadyInUser } from "../../errors/user.js";
export class CreateUserUseCase {
  constructor(
    getUserByEmailRepository,
    createUserRepository,
    passwordHasherAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.createUserRepository = createUserRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
  }

  async execute(createUserParams) {
    const userWithProviderEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    );

    if (userWithProviderEmail) {
      throw new EmailAlreadyInUser(createUserParams.email);
    }

    const userId = uuidv4();
    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    );

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const createrUser = await this.createUserRepository.execute(user);
    return createrUser;
  }
}
