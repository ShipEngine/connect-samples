import { faker } from '@faker-js/faker';
import { ImportTrackingEventsRequest, ImportedTrackingEvent, StandardizedStatusCodes } from "@shipengine/connect-carrier-api";

export async function* ImportTrackingEvents(request: ImportTrackingEventsRequest): AsyncGenerator<ImportedTrackingEvent> {
  //retrieve tracking events using request.connection_id / request.metadata
  const rows = createData(1000);

  for (const row of rows) {
    if (row.error) {
      yield {
        error_messages: ['Error: ' + faker.random.words(3)],
      };
    } else {
      yield {
        tracking_info: {
          standardized_status_code: row.status
        },
      };
    }
  }
}

function createData(count: number) {
  return range(count).map((index) => ({
    seq: index + 1,
    error: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(Object.values(StandardizedStatusCodes))
  }));
}

const range = (count: number) => [...Array(count).keys()];
