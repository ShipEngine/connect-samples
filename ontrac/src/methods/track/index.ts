import { TrackingRequest, TrackingResponse } from "@shipengine/connect-carrier-api";
import { OntracTrackingRequest, track } from "../../api";
import { mapRequest } from "./map-request";
import { mapResponse } from "./map-response";

export const Track = async (request: TrackingRequest): Promise<TrackingResponse> => {
    const mappedRequest: OntracTrackingRequest = mapRequest(request);
    const response = await track(mappedRequest);
    const mappedResponse: TrackingResponse = mapResponse(response);
    return mappedResponse;
}
