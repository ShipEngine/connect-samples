
const PS_ZERO_DATE = '0000-00-00 00:00:00';

export function isoToDateString(isoDate: string): string {
  return isoDate.substring(0, 10);
}

export function prestashopDateToIsoDate(psDate: string): string {
  if (psDate === PS_ZERO_DATE) {
    return null;
  }

  const date = psDate.substring(0, 10);
  const time = psDate.substring(11);
  // we need to pass ISO formatted date to JS Date to avoid timezone conversion
  // because PrestaShop already returns UTC date
  return new Date(`${date}T${time}.000Z`).toISOString();
}
