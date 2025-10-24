"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Apple } from "lucide-react";
import { createApp } from "@/utils/action/server";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ConnectIOSAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  existingApp?: {
    id: string;
    platform_data: {
      bundle_id: string;
      team_id: string;
      app_id: string;
    };
  };
}

export default function ConnectIOSAppModal({ isOpen, onClose, workspaceId, existingApp }: ConnectIOSAppModalProps) {
  const [bundleId, setBundleId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [appId, setAppId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load existing app data when modal opens
  useEffect(() => {
    if (isOpen && existingApp?.platform_data) {
      setBundleId(existingApp.platform_data.bundle_id || "");
      setTeamId(existingApp.platform_data.team_id || "");
      setAppId(existingApp.platform_data.app_id || "");
    } else if (isOpen && !existingApp) {
      // Reset to empty when opening for new connection
      setBundleId("");
      setTeamId("");
      setAppId("");
    }
  }, [isOpen, existingApp]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bundleId || !teamId || !appId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      await createApp(workspaceId, 'IOS', {
        bundle_id: bundleId,
        team_id: teamId,
        app_id: appId,
      });

      toast.success(existingApp ? "iOS app updated successfully" : "iOS app connected successfully");
      handleClose();
      router.refresh();
    } catch (error: any) {
      console.error("Error connecting iOS app:", error);
      toast.error(error.message || "Failed to connect iOS app");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setBundleId("");
      setTeamId("");
      setAppId("");
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">{existingApp ? "Update iOS App" : "Connect iOS App"}</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Bundle ID */}
            <div>
              <label htmlFor="bundleId" className="block text-sm font-medium text-gray-300 mb-2">
                Bundle ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="bundleId"
                value={bundleId}
                onChange={(e) => setBundleId(e.target.value)}
                placeholder="com.example.myapp"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50 font-mono text-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Your app's unique identifier (e.g., com.company.app)
              </p>
            </div>

            {/* Team ID */}
            <div>
              <label htmlFor="teamId" className="block text-sm font-medium text-gray-300 mb-2">
                Team ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="teamId"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value.toUpperCase())}
                placeholder="ABCD123456"
                disabled={isLoading}
                maxLength={10}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50 font-mono text-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Found in Apple Developer account (10 characters)
              </p>
            </div>

            {/* App ID */}
            <div>
              <label htmlFor="appId" className="block text-sm font-medium text-gray-300 mb-2">
                App ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="appId"
                value={appId}
                onChange={(e) => {
                  let value = e.target.value.trim();
                  // Remove "id" prefix if present (e.g., "id6450730873" → "6450730873")
                  if (value.toLowerCase().startsWith('id')) {
                    value = value.substring(2);
                  }
                  // Allow only numbers
                  setAppId(value.replace(/\D/g, ''));
                }}
                placeholder="6450730873"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50 font-mono text-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Your app's App Store ID (numbers only, not "id6450730873")
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-xs text-gray-300">
                <strong className="text-white">Where to find these values:</strong>
                <br />• Bundle ID: Xcode → Target → General → Identity
                <br />• Team ID: Apple Developer → Membership
                <br />• App ID: App Store Connect → Your App
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white text-black hover:bg-gray-200 border-0"
              >
{isLoading ? (existingApp ? "Updating..." : "Connecting...") : (existingApp ? "Update iOS App" : "Connect iOS App")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
