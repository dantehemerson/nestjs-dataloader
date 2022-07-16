import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { AppModule } from "./../src/app.module";
import { Factory } from 'typeorm-factory'
import { Account } from "../src/account/account.entity";
import { ApolloDriver } from "@nestjs/apollo";

describe("AppModule", () => {
  let app: INestApplication;
  let apolloClient: ReturnType<typeof createTestClient>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const module: GraphQLModule = moduleFixture.get<GraphQLModule>(
      GraphQLModule
    );

    const adapter = module.graphQlAdapter;

    // apolloServer is protected, we need to cast module to any to get it
    apolloClient = createTestClient((adapter as any).instance);
  });

  afterAll(() => app.close());

  it("defined", () => expect(app).toBeDefined());

  it("/graphql(POST) getAccounts", async () => {
    const f = new Factory(Account).attr('name', 'name')
    const account = await f.create()
    const { query } = apolloClient;
    const result = await query({
      query: gql`
        query q($ids: [ID!]!) {
          getAccounts(ids: $ids) {
            id
          }
        }
      `,
      variables: {
        ids: [account.id],
      },
    });
    expect(result.errors).toBeUndefined()
  });
});
