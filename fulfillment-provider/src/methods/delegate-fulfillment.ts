import { DelegateFulfillmentRequest, DelegateFulfillmentResponse } from "@shipengine/connect-fulfillment-provider-api";
import { logger, NotImplementedError } from "@shipengine/connect-runtime";

const mapRequest = (request: DelegateFulfillmentRequest): any => { throw new NotImplementedError(); };
const callApi = async (request: any): Promise<any> => { throw new NotImplementedError(); };
const mapResponse = (response: any): DelegateFulfillmentResponse => { throw new NotImplementedError(); };

export const delegateFulfillment = async (request: DelegateFulfillmentRequest): Promise<DelegateFulfillmentResponse> => {
    logger.info('This is a log that I can find using the `connect logs` command after publishing.')
    const thirdPartyRequest = mapRequest(request);
    const response = await callApi(thirdPartyRequest);
    const mappedResponse = mapResponse(response);
    return mappedResponse;
}
