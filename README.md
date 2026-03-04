# OCPP Simulator UI

Angular UI for operating the OCPP simulator fleet APIs (`/api/v1/*`) and running charger operations end-to-end.

## Current environment (dev)

- UI: `https://ocpp-simulator-dev.electrahub.com:8443/ocpp-simulator-ui`
- Simulator API (used by UI): `https://ocpp-simulator-dev.electrahub.com:8443/ocpp-simulator/api/v1`
- Shared domain API (also valid): `https://dev.electrahub.com:8443/ocpp-simulator/api/v1`
- WebSocket connector service: `https://dev.electrahub.com:8443/ws-connector`

The UI auto-resolves API base URL as:

- `${location.origin}/ocpp-simulator`

So in dev, it works without manual override.

## Run locally

```bash
cd /Users/amolsurjuse/development/projects/ocpi-simulator-ui
npm install
npm start
```

Open:

- `http://localhost:4200`

If simulator is local:

- set **API Base URL** to `http://localhost:8081`

If simulator is through ingress:

- set **API Base URL** to `https://dev.electrahub.com:8443/ocpp-simulator`

## How to use the UI for OCPP operations

### 1) Create charger

In **Charger Fleet → Provision Charger**:

- `chargerId`: `sim-000001`
- `ocppIdentity`: `CP_000001`
- `ocppVersion`: `OCPP 1.6J` (or `OCPP 2.0.1`)
- keep default connector/config values
- click **Create Charger**

Expected:

- charger appears in **Fleet List**
- action log shows `Charger created`

### 2) Connect charger (CP role)

1. Select charger from **Fleet List**
2. In **Connection Lifecycle**, keep default `CSMS URL` (placeholder is fine)
3. Click **Connect**

Expected:

- state moves to `CONNECTING` then `CONNECTED`
- backend sends `BootNotification` through `web-socket-connector`

### 3) Start live events

In **Events & Audit** click **Start Stream**.

Expected periodic sequence from simulator:

- `DMS`
- `START`
- `METER_VALUE`
- `STOP`
- `UNPLUG`

This repeats based on server `EVENT_INTERVAL`.

### 4) Trigger OCPP-style operations from UI

Use these sections after charger is selected:

- **Authorization & Plug and Charge**
  - `Tap / Authorize`
  - `Start PnC`
  - `Stop PnC`
- **Charging & Meter Values**
  - `Start Charging`
  - `Stop Charging`
  - `Send Meter Values`
- **Status & Faults**
  - update connector status
  - inject/clear faults
- **Heartbeat & OCPP**
  - send heartbeat
  - update heartbeat interval
  - send raw OCPP action (example: `BootNotification`)

### 5) Disconnect

In **Connection Lifecycle**:

- click **Disconnect**
- optionally click **Check State**

Expected: state becomes `DISCONNECTED`.

## API examples (current dev)

Create charger:

```bash
curl -k -X POST 'https://dev.electrahub.com:8443/ocpp-simulator/api/v1/chargers' \
  -H 'Content-Type: application/json' \
  -d '{
    "chargerId":"sim-000001",
    "ocppIdentity":"CP_000001",
    "ocppVersion":"OCPP16J",
    "transport":{"role":"CP","csmsUrl":"wss://csms.example.com/ocpp","tls":{"enabled":true,"skipVerify":false}},
    "connectors":[{"connectorId":1,"type":"CCS","maxKw":150}]
  }'
```

Connect charger:

```bash
curl -k -X POST 'https://dev.electrahub.com:8443/ocpp-simulator/api/v1/chargers/sim-000001/connection/connect' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Check connection:

```bash
curl -k 'https://dev.electrahub.com:8443/ocpp-simulator/api/v1/chargers/sim-000001/connection'
```

## Troubleshooting

- `Http failure response ... status 0`:
  - check ingress port-forward is running (`8080/8443`)
  - verify `/etc/hosts` includes `dev.electrahub.com` and `ocpp-simulator-dev.electrahub.com`
- empty/old UI:
  - hard refresh (`Cmd+Shift+R`)
- stream not updating:
  - click **Stop Stream** then **Start Stream**
  - verify charger is in `CONNECTED` state
