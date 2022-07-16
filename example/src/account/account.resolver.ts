import { ModuleRef } from "@nestjs/core";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";
import DataLoader from "dataloader";
import { Loader } from "../../../index";
import { Account } from "./account.entity";
import { AccountLoader } from "./account.loader";

@Resolver("Account")
export class AccountResolver {
  constructor(private moduleRef: ModuleRef) {}

  
  @Query(() => [Account])
  public async getAccounts(
    @Args({ name: "ids", type: () => [ID] }) ids: string[],
    @Loader(AccountLoader)
    accountLoader: DataLoader<Account["id"], Account>
  ): Promise<(Account | Error)[]> {
    return accountLoader.loadMany(ids);
  }
}
