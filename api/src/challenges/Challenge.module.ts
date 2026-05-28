import { Module } from "@nestjs/common";
import { PrismaModule } from "../shared/infrastructure/prisma/prisma.module";
import { ExpectedQueryModule } from "../expected-query/expected-query.module";
import { ChallengeRepository } from "./infrastructure/persistance/postgres-reto-repository";
import { CrearChallengeUseCase } from "./aplication/use-cases/crear-challege.use-case";
import { CreateChallengeWithExpectedQueryUseCase } from "./aplication/use-cases/create-challenge-with-expected-query.use-case";
import { GetChallengesUseCase } from "./aplication/use-cases/get-challeges.use-case";
import { GetChallengeByIdUseCase } from "./aplication/use-cases/get-challege-by-id.use-case";
import { GetChallengeByTitleUseCase } from "./aplication/use-cases/get-challege-by-title.use-case";
import { UpdateChallengeUseCase } from "./aplication/use-cases/update-challege.use-case";
import { DeleteChallengeUseCase } from "./aplication/use-cases/delete-challege.use-case";
import { ChallengesController } from "./infrastructure/controllers/challeges.controller";

@Module({
  imports: [PrismaModule, ExpectedQueryModule],
  controllers: [ChallengesController],
  providers: [
    {
      provide: "CHALLENGE_REPOSITORY",
      useClass: ChallengeRepository,
    },
    CrearChallengeUseCase,
    CreateChallengeWithExpectedQueryUseCase,
    GetChallengesUseCase,
    GetChallengeByIdUseCase,
    GetChallengeByTitleUseCase,
    UpdateChallengeUseCase,
    DeleteChallengeUseCase,
  ],
  exports: ["CHALLENGE_REPOSITORY"],
})
export class ChallengeModule {}
