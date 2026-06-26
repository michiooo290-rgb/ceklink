"use client";

import { Component } from "react";
import { ShieldX, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a1e2e] p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-[#E55C30]/10 flex items-center justify-center mx-auto mb-6">
              <ShieldX size={32} className="text-[#E55C30]" />
            </div>
            <h2 className="font-heading font-bold text-xl text-white mb-3">
              Terjadi Kesalahan
            </h2>
            <p className="text-[#666680] text-sm mb-6">
              Aplikasi mengalami error tak terduga. Silakan muat ulang halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              <RefreshCw size={16} />
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
