"""Start the local FastAPI inference service.

The project may contain more than one local Python runtime.  Select the
runtime matching the interpreter that launches this file so compiled
packages (notably pydantic-core) cannot be mixed across Python versions.
"""

import os
import sys
from pathlib import Path
from urllib.request import urlopen


BASE_DIR = Path(__file__).resolve().parent
RUNTIME = BASE_DIR / f".runtime{sys.version_info.major}{sys.version_info.minor}"

# Keep support for the original bundled Python 3.12 runtime.
if not RUNTIME.exists() and sys.version_info[:2] == (3, 12):
    RUNTIME = BASE_DIR / ".runtime"


def runtime_matches_interpreter(path: Path) -> bool:
    """Return whether a local runtime has packages for this Python version."""
    fastapi_init = path / "fastapi" / "__init__.py"
    pydantic_core = path / "pydantic_core"
    extension_pattern = f"_pydantic_core.cp{sys.version_info.major}{sys.version_info.minor}-*.pyd"
    return fastapi_init.exists() and any(pydantic_core.glob(extension_pattern))


if runtime_matches_interpreter(RUNTIME):
    sys.path.insert(0, str(RUNTIME))


def service_is_running(port: int) -> bool:
    try:
        with urlopen(f"http://127.0.0.1:{port}/health", timeout=1) as response:
            return response.status == 200
    except Exception:
        return False


import uvicorn  # noqa: E402  (runtime path must be configured first)


if __name__ == "__main__":
    port = int(os.getenv("ML_SERVICE_PORT", "8000"))
    if service_is_running(port):
        print(f"ML service is already running on http://127.0.0.1:{port}")
        raise SystemExit(0)
    uvicorn.run("app:app", host="127.0.0.1", port=port)
