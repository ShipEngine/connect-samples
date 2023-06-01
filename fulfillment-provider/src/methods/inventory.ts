import { GetInventoryRequest, GetInventoryResponse } from "@shipengine/connect-fulfillment-provider-api";
import { logger, NotImplementedError } from "@shipengine/connect-runtime";

const mapRequest = (request: GetInventoryRequest): any => { throw new NotImplementedError(); };
const callApi = async (request: any): Promise<any> => { throw new NotImplementedError(); };
const mapResponse = (response: any): GetInventoryResponse => { throw new NotImplementedError(); };

export const getInventory = async (request: GetInventoryRequest): Promise<GetInventoryResponse> => {
    logger.info('This is a log that I can find using the `connect logs` command after publishing.')
    const thirdPartyRequest = mapRequest(request);
    const response = await callApi(thirdPartyRequest);
    const mappedResponse = mapResponse(response);
    return mappedResponse;
}
