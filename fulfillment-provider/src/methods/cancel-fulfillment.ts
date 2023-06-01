import { CancelFulfillmentRequest, CancelFulfillmentResponse } from "@shipengine/connect-fulfillment-provider-api";
import { logger, NotImplementedError } from "@shipengine/connect-runtime";

const mapRequest = (request: CancelFulfillmentRequest): any => { throw new NotImplementedError(); };
const callApi = async (request: any): Promise<any> => { throw new NotImplementedError(); };
const mapResponse = (response: any): CancelFulfillmentResponse => { throw new NotImplementedError(); };

export const cancelFulfillment = async (request: CancelFulfillmentRequest): Promise<CancelFulfillmentResponse> => {
    logger.info('This is a log that I can find using the `connect logs` command after publishing.')
    const thirdPartyRequest = mapRequest(request);
    const response = await callApi(thirdPartyRequest);
    const mappedResponse = mapResponse(response);
    return mappedResponse;
}
