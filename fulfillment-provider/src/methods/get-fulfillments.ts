import { GetFulfillmentsRequest, GetFulfillmentsResponse } from "@shipengine/connect-fulfillment-provider-api";
import { logger, NotImplementedError } from "@shipengine/connect-runtime";

const mapRequest = (request: GetFulfillmentsRequest): any => { throw new NotImplementedError(); };
const callApi = async (request: any): Promise<any> => { throw new NotImplementedError(); };
const mapResponse = (response: any): GetFulfillmentsResponse => { throw new NotImplementedError(); };

export const getFulfillments = async (request: GetFulfillmentsRequest): Promise<GetFulfillmentsResponse> => {
    logger.info('This is a log that I can find using the `connect logs` command after publishing.')
    const thirdPartyRequest = mapRequest(request);
    const response = await callApi(thirdPartyRequest);
    const mappedResponse = mapResponse(response);
    return mappedResponse;
}
