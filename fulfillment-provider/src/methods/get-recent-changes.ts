import { GetRecentChangesRequest, GetRecentChangesResponse } from "@shipengine/connect-fulfillment-provider-api";
import { logger, NotImplementedError } from "@shipengine/connect-runtime";

const mapRequest = (request: GetRecentChangesRequest): any => { throw new NotImplementedError(); };
const callApi = async (request: any): Promise<any> => { throw new NotImplementedError(); };
const mapResponse = (response: any): GetRecentChangesResponse => { throw new NotImplementedError(); };

export const getRecentChanges = async (request: GetRecentChangesRequest): Promise<GetRecentChangesResponse> => {
    logger.info('This is a log that I can find using the `connect logs` command after publishing.')
    const thirdPartyRequest = mapRequest(request);
    const response = await callApi(thirdPartyRequest);
    const mappedResponse = mapResponse(response);
    return mappedResponse;
}
