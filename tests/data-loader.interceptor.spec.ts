import { CallHandler } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { Test } from "@nestjs/testing";
import { DataLoaderInterceptor } from "../index";

describe(DataLoaderInterceptor.name, () => {
  let interceptor: DataLoaderInterceptor
  let handler: CallHandler

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({}).compile();

    interceptor = new DataLoaderInterceptor(testingModule.get(ModuleRef))

    handler = {
      handle: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  describe('when context is GraphQL', () => {
    it('should inject dataloader', () => {
      const gqlExecutionContext = {}
      const executionContextHost =  new ExecutionContextHost([undefined, undefined, gqlExecutionContext])
      
      interceptor.intercept(executionContextHost, handler) 
  
      expect(handler.handle).toHaveBeenCalled()
      // expect(contextIdFactoryMock.create).toHaveBeenCalled()
      expect(gqlExecutionContext['NEST_LOADER_CONTEXT_KEY']).not.toBeUndefined()
    })
  })

  describe('when context is not GraphQL', () => {
    it('should not inject dataloader', () => {
      const executionContextHost =  new ExecutionContextHost([])
      
      interceptor.intercept(executionContextHost, handler) 
  
      expect(handler.handle).toHaveBeenCalled()
    })
  })
})