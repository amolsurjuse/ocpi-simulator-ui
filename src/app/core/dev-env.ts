const DEV_UI_HOSTNAME = 'ocpp-simulator-dev.electrahub.com';
const DEV_SIMULATOR_BASE_URL = 'https://ocpp-simulator-dev.electrahub.com:8443/ocpp-simulator';
const DEV_OCPP_WS_ORIGIN = 'wss://ocpp-simulator-dev.electrahub.com:8443';

type LocationLike = Pick<Location, 'hostname' | 'origin'> | null | undefined;

export function resolveDefaultApiBaseUrl(locationLike: LocationLike = globalThis?.location): string {
  if (!locationLike || !locationLike.origin || locationLike.origin === 'null') {
    return DEV_SIMULATOR_BASE_URL;
  }

  if (isLocalHost(locationLike.hostname) || locationLike.hostname === DEV_UI_HOSTNAME) {
    return DEV_SIMULATOR_BASE_URL;
  }

  return `${locationLike.origin}/ocpp-simulator`;
}

export function buildDefaultCsmsUrl(ocppVersion: string | null | undefined, identity: string, chargerId: string) {
  const protocol = ocppVersion === 'OCPP201' ? '2.0.1' : '1.6';
  const chargePointId = encodeURIComponent((identity || chargerId || 'sim-000001').trim());
  return `${DEV_OCPP_WS_ORIGIN}/ocpp/${protocol}/${chargePointId}`;
}

function isLocalHost(hostname: string | null | undefined) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}
