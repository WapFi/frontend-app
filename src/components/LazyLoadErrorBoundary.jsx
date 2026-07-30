import { Component } from "react";
import { useTranslation } from "react-i18next";

const CHUNK_RELOAD_KEY = "wapfi:chunk-reload-at";
const RELOAD_WINDOW_MS = 30000;

function isChunkLoadError(error) {
  const message = error?.message || "";

  return (
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("Loading chunk")
  );
}

function LazyLoadFallback() {
  const { t } = useTranslation();

  const handleRefresh = () => {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          {t("app_error.title")}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {t("app_error.message")}
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          className="mt-4 rounded-md bg-[#B88E00] px-4 py-2 text-sm font-medium text-white"
        >
          {t("app_error.refresh")}
        </button>
      </div>
    </div>
  );
}

class LazyLoadErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (!isChunkLoadError(error)) return;

    const lastReloadAt = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
    const canReload = Date.now() - lastReloadAt > RELOAD_WINDOW_MS;

    if (canReload) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return <LazyLoadFallback />;
    }

    return this.props.children;
  }
}

export default LazyLoadErrorBoundary;