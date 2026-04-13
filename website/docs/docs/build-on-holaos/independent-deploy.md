# Independent Deploy

Holaboss runtime can be deployed independently of the Electron desktop app.

This is the same runtime, packaged differently:

- the desktop app starts it for local users
- an independent deployment starts it directly on the target machine

## Deploy shape

The standalone deploy flow is:

1. build a platform-specific runtime bundle
2. archive it as `tar.gz`
3. extract it on the target machine
4. launch `bin/sandbox-runtime`

The runtime bundle includes the runtime app plus its packaged dependencies and runtime binaries. The desktop app uses the same entrypoint and environment contract.

## Required environment

The launcher environment should stay aligned with desktop startup. The important variables are:

| Variable | Purpose |
| --- | --- |
| `HB_SANDBOX_ROOT` | runtime workspace and state root |
| `SANDBOX_AGENT_BIND_HOST` | runtime API bind host |
| `SANDBOX_AGENT_BIND_PORT` | runtime API bind port |
| `SANDBOX_AGENT_HARNESS` | harness selector |
| `HOLABOSS_RUNTIME_WORKFLOW_BACKEND` | workflow backend selector |
| `HOLABOSS_RUNTIME_DB_PATH` | SQLite runtime DB path |
| `PROACTIVE_ENABLE_REMOTE_BRIDGE` | enable remote bridge flows |
| `PROACTIVE_BRIDGE_BASE_URL` | remote bridge base URL |

## Health check

Once the runtime is up, verify it with:

```bash
curl http://127.0.0.1:8080/healthz
```

If you need the runtime to accept connections from other machines, bind to `0.0.0.0` instead of `127.0.0.1`.

## Linux example

```bash
bash runtime/deploy/package_linux_runtime.sh out/runtime-linux
tar -C out -czf out/holaboss-runtime-linux.tar.gz runtime-linux
```

Install and run:

```bash
sudo mkdir -p /opt/holaboss
sudo tar -C /opt/holaboss -xzf holaboss-runtime-linux.tar.gz
sudo ln -sf /opt/holaboss/runtime-linux/bin/sandbox-runtime /usr/local/bin/holaboss-runtime
sudo mkdir -p /var/lib/holaboss

HB_SANDBOX_ROOT=/var/lib/holaboss \
SANDBOX_AGENT_BIND_HOST=127.0.0.1 \
SANDBOX_AGENT_BIND_PORT=8080 \
SANDBOX_AGENT_HARNESS=pi \
HOLABOSS_RUNTIME_WORKFLOW_BACKEND=remote_api \
HOLABOSS_RUNTIME_DB_PATH=/var/lib/holaboss/state/runtime.db \
PROACTIVE_ENABLE_REMOTE_BRIDGE=1 \
PROACTIVE_BRIDGE_BASE_URL=https://your-bridge.example \
holaboss-runtime
```

## macOS example

```bash
bash runtime/deploy/package_macos_runtime.sh out/runtime-macos
tar -C out -czf out/holaboss-runtime-macos.tar.gz runtime-macos
```

Install and run:

```bash
sudo mkdir -p /opt/holaboss
sudo tar -C /opt/holaboss -xzf holaboss-runtime-macos.tar.gz
sudo ln -sf /opt/holaboss/runtime-macos/bin/sandbox-runtime /usr/local/bin/holaboss-runtime
mkdir -p "$HOME/Library/Application Support/HolabossRuntime"

HB_SANDBOX_ROOT="$HOME/Library/Application Support/HolabossRuntime" \
SANDBOX_AGENT_BIND_HOST=127.0.0.1 \
SANDBOX_AGENT_BIND_PORT=8080 \
SANDBOX_AGENT_HARNESS=pi \
HOLABOSS_RUNTIME_WORKFLOW_BACKEND=remote_api \
HOLABOSS_RUNTIME_DB_PATH="$HOME/Library/Application Support/HolabossRuntime/state/runtime.db" \
PROACTIVE_ENABLE_REMOTE_BRIDGE=1 \
PROACTIVE_BRIDGE_BASE_URL=https://your-bridge.example \
holaboss-runtime
```

## Windows example

Build the Windows runtime bundle on a Windows host:

```bash
node runtime/deploy/package_windows_runtime.mjs out/runtime-windows
powershell -Command "Compress-Archive -Path out/runtime-windows -DestinationPath out/holaboss-runtime-windows.zip -Force"
```

Install and run:

```powershell
New-Item -ItemType Directory -Force C:\Holaboss | Out-Null
Expand-Archive -Path .\holaboss-runtime-windows.zip -DestinationPath C:\Holaboss -Force

$env:HB_SANDBOX_ROOT="$env:LOCALAPPDATA\holaboss"
$env:SANDBOX_AGENT_BIND_HOST="127.0.0.1"
$env:SANDBOX_AGENT_BIND_PORT="8080"
$env:SANDBOX_AGENT_HARNESS="pi"
$env:HOLABOSS_RUNTIME_WORKFLOW_BACKEND="remote_api"
$env:HOLABOSS_RUNTIME_DB_PATH="$env:LOCALAPPDATA\holaboss\state\runtime.db"
$env:PROACTIVE_ENABLE_REMOTE_BRIDGE="1"
$env:PROACTIVE_BRIDGE_BASE_URL="https://your-bridge.example"

C:\Holaboss\runtime-windows\bin\sandbox-runtime.cmd
```

## What stays the same

Independent deploy does not change the runtime contract:

- workspace layout is still the same
- `AGENTS.md` is still the instruction surface
- `state/runtime.db` is still the durable runtime registry
- `memory/` is still the durable memory store
- app manifests still drive app lifecycle

The main difference is deployment responsibility. Instead of being launched by the desktop app, the runtime is started directly on the machine that will host workspaces.
