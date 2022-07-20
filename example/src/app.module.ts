import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AccountModule } from "./account/account.module";
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      debug: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "sample",
      entities: [join(__dirname, "./**/*.entity.[t|j]s")],
      synchronize: true,
    }),
    AccountModule,
  ]
})
export class AppModule {}
