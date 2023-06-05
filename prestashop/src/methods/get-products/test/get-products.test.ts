import {
  BadRequestError,
  ExternalServerError,
  UnauthorizedError,
} from '@shipengine/connect-runtime';
import * as client from '../../../client';
import { PsBadRequestError } from '../../../client/error';
import { GetProducts } from '../get-products';
import {
  color,
  getProductParameters,
  getProductParametersWithEmptyIDs,
  getProductParametersWithEmptyKey,
  getProductSuccessResponse,
  response,
} from './__mocks__';

describe('Test_Get_Products', () => {
  let getProductMock = null;
  let getColorOfProductMock = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should_ThrowBadRequestError_When_ThePSReturnsABadRequestError', async () => {
    getProductMock = jest
      .spyOn(client, 'getProduct')
      .mockImplementation(() => Promise.reject(new PsBadRequestError('test')));

    await expect(GetProducts(getProductParameters)).rejects.toThrow(BadRequestError);
    expect(getProductMock).toBeCalled();
  });

  it('Should_ThrowBadRequestError_When_theProductIDsWasNotReceived', async () => {
    await expect(GetProducts(getProductParametersWithEmptyIDs)).rejects.toThrow(BadRequestError);
  });

  it('Should_ThrowExternalServerError_When_ThePSReturnsAServerError', async () => {
    jest
      .spyOn(client, 'getProduct')
      .mockImplementation(() => Promise.reject(new ExternalServerError('test')));

    await expect(GetProducts(getProductParameters)).rejects.toThrow(ExternalServerError);
    expect(getProductMock).toBeCalled();
  });

  it('Should_ThrowUnauthorizedError_On_EmptyUsername', async () => {
    await expect(() => GetProducts(getProductParametersWithEmptyKey))
      .rejects
      .toThrowError(UnauthorizedError);
  });

  it('Should_ReturnTheExpectedData_When_EverythingIsValid', async () => {
    getProductMock = jest
      .spyOn(client, 'getProduct')
      .mockImplementation(() => Promise.resolve(getProductSuccessResponse));
    getColorOfProductMock = jest
      .spyOn(client, 'getColorOfProduct')
      .mockImplementation(() => Promise.resolve(color));

    await expect(GetProducts(getProductParameters)).resolves.toEqual({ products: [response] });

    expect(getProductMock).toBeCalled();
    expect(getColorOfProductMock).toBeCalled();
  });
});
