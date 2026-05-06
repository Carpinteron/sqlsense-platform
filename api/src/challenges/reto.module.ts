import { Module } from "@nestjs/common";
import { PrismaModule } from "../shared/infrastructure/prisma/prisma.module";
import { RetoRepository } from "./infrastructure/persistance/postgres-reto-repository";
import { CrearRetoUseCase } from "./aplication/use-cases/crear-reto.use-case";
import { GetRetosUseCase } from "./aplication/use-cases/get-retos.use-case";
import { GetRetoByIdUseCase } from "./aplication/use-cases/get-reto-by-id.use-case";
import { GetRetoByTitleUseCase } from "./aplication/use-cases/get-reto-by-title.use-case";
import { UpdateRetoUseCase } from "./aplication/use-cases/update-reto.use-case";
import { DeleteRetoUseCase } from "./aplication/use-cases/delete-reto.use-case";
import { RetosController } from "./infrastructure/controllers/retos.controller";

@Module({
  imports: [PrismaModule],
  controllers: [RetosController],
  providers: [
    {
      provide: "RETO_REPOSITORY",
      useClass: RetoRepository,
    },
    CrearRetoUseCase,
    GetRetosUseCase,
    GetRetoByIdUseCase,
    GetRetoByTitleUseCase,
    UpdateRetoUseCase,
    DeleteRetoUseCase,
  ],
  exports: ["RETO_REPOSITORY"],
})
export class RetoModule {}
