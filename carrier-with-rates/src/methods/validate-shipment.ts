import { ValidateShipmentRequest, ValidateShipmentResponse } from "@shipengine/connect-carrier-api";
import { logger, NotImplementedError } from "@shipengine/connect-runtime";

export const ValidateShipment = async (request: ValidateShipmentRequest): Promise<ValidateShipmentResponse> => {
    logger.info('This is a log that I can find using the `connect logs` command after publishing.')

    throw new NotImplementedError(); 
}
