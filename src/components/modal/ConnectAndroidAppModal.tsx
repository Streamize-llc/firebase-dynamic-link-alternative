"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2 } from "lucide-react";
import { createApp } from "@/utils/action/server";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ConnectAndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  existingApp?: {
    id: string;
    platform_data: {
      package_name: string;
      sha256_list: string[];
    };
  };
}

export default function ConnectAndroidAppModal({ isOpen, onClose, workspaceId, existingApp }: ConnectAndroidAppModalProps) {
  const [packageName, setPackageName] = useState("");
  const [sha256List, setSha256List] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load existing app data when modal opens
  useEffect(() => {
    if (isOpen && existingApp?.platform_data) {
      setPackageName(existingApp.platform_data.package_name || "");
      setSha256List(existingApp.platform_data.sha256_list || [""]);
    } else if (isOpen && !existingApp) {
      // Reset to empty when opening for new connection
      setPackageName("");
      setSha256List([""]);
    }
  }, [isOpen, existingApp]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!packageName) {
      toast.error("Please enter package name");
      return;
    }

    // 빈 SHA-256 제거
    const filteredSha256List = sha256List.filter(sha => sha.trim() !== "");

    if (filteredSha256List.length === 0) {
      toast.error("Please add at least one SHA-256 fingerprint");
      return;
    }

    setIsLoading(true);

    try {
      await createApp(workspaceId, 'ANDROID', {
        package_name: packageName,
        sha256_list: filteredSha256List,
      });

      toast.success(existingApp ? "Android app updated successfully" : "Android app connected successfully");
      handleClose();
      router.refresh();
    } catch (error: any) {
      console.error("Error connecting Android app:", error);
      toast.error(error.message || "Failed to connect Android app");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPackageName("");
      setSha256List([""]);
      onClose();
    }
  };

  const addSha256Field = () => {
    setSha256List([...sha256List, ""]);
  };

  const removeSha256Field = (index: number) => {
    if (sha256List.length > 1) {
      setSha256List(sha256List.filter((_, i) => i !== index));
    }
  };

  const updateSha256 = (index: number, value: string) => {
    const newList = [...sha256List];
    newList[index] = value;
    setSha256List(newList);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-white/5 backdrop-blur-xl z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523,15.3414c-0.5511,0-0.9993,0.4486-0.9993,1c0,0.5515,0.4482,1,0.9993,1c0.5516,0,0.9994-0.4485,0.9994-1C18.5224,15.7899,18.0739,15.3414,17.523,15.3414z M6.4767,15.3414c-0.5511,0-0.9993,0.4486-0.9993,1c0,0.5515,0.4482,1,0.9993,1c0.5516,0,0.9993-0.4485,0.9993-1C7.476,15.7899,7.0282,15.3414,6.4767,15.3414z M16.1606,5.0207L17.4614,3.0272c0.1027-0.1611,0.0565-0.3753-0.1046-0.4784c-0.1611-0.1028-0.3752-0.0565-0.478,0.1046l-1.3172,2.0164c-1.0582-0.4678-2.2324-0.7291-3.4709-0.7291c-1.2381,0-2.4118,0.2614-3.4702,0.7291L7.3033,2.6534C7.2006,2.4923,6.9865,2.446,6.8254,2.5488C6.6643,2.6516,6.6181,2.8658,6.7208,3.0269L8.0216,5.0207C5.0653,6.6105,3,9.9088,3,13.5776h18C21,9.9088,18.9347,6.6105,16.1606,5.0207z"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">{existingApp ? "Update Android App" : "Connect Android App"}</h2>
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
            {/* Package Name */}
            <div>
              <label htmlFor="packageName" className="block text-sm font-medium text-gray-300 mb-2">
                Package Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="packageName"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="com.example.myapp"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50 font-mono text-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Your app's unique identifier (e.g., com.company.app)
              </p>
            </div>

            {/* SHA-256 Fingerprints */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  SHA-256 Fingerprints <span className="text-red-400">*</span>
                </label>
                <Button
                  type="button"
                  onClick={addSha256Field}
                  disabled={isLoading}
                  variant="ghost"
                  className="text-gray-400 hover:text-white text-xs h-auto py-1"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add More
                </Button>
              </div>

              <div className="space-y-2">
                {sha256List.map((sha, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={sha}
                      onChange={(e) => updateSha256(index, e.target.value)}
                      placeholder="AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50 font-mono text-xs"
                    />
                    {sha256List.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSha256Field(index)}
                        disabled={isLoading}
                        className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Add SHA-256 fingerprints for debug and release builds
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-xs text-gray-300">
                <strong className="text-white">How to get SHA-256 fingerprint:</strong>
                <br />• Debug: Run <code className="bg-white/5 px-1 rounded">keytool -list -v -keystore ~/.android/debug.keystore</code>
                <br />• Release: Check your keystore file
                <br />• Or find in Google Cloud Console → API Credentials
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
{isLoading ? (existingApp ? "Updating..." : "Connecting...") : (existingApp ? "Update Android App" : "Connect Android App")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
