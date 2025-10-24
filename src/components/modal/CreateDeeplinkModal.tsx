"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";
import { createDeeplink } from "@/utils/action/server";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateDeeplinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export default function CreateDeeplinkModal({ isOpen, onClose, workspaceId }: CreateDeeplinkModalProps) {
  const [slug, setSlug] = useState("");
  const [appParams, setAppParams] = useState('{\n  "screen": "",\n  "id": ""\n}');
  const [socialTitle, setSocialTitle] = useState("");
  const [socialDescription, setSocialDescription] = useState("");
  const [socialThumbnail, setSocialThumbnail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slug) {
      toast.error("Please enter a slug");
      return;
    }

    // slug 유효성 검사 (영문, 숫자, 하이픈, 언더스코어만 허용)
    const slugRegex = /^[a-zA-Z0-9-_]+$/;
    if (!slugRegex.test(slug)) {
      toast.error("Slug can only contain letters, numbers, hyphens, and underscores");
      return;
    }

    // JSON 유효성 검사
    let parsedAppParams;
    try {
      parsedAppParams = JSON.parse(appParams);
    } catch (error) {
      toast.error("App params must be valid JSON");
      return;
    }

    setIsLoading(true);

    try {
      const socialMeta = (socialTitle || socialDescription || socialThumbnail) ? {
        title: socialTitle,
        description: socialDescription,
        thumbnail_url: socialThumbnail
      } : undefined;

      await createDeeplink(workspaceId, {
        slug,
        app_params: parsedAppParams,
        social_meta: socialMeta
      });

      toast.success("Deep link created successfully");
      handleClose();
      router.refresh();
    } catch (error: any) {
      console.error("Error creating deeplink:", error);
      toast.error(error.message || "Failed to create deeplink");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSlug("");
      setAppParams('{\n  "screen": "",\n  "id": ""\n}');
      setSocialTitle("");
      setSocialDescription("");
      setSocialThumbnail("");
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
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-semibold text-white">Create Deep Link</h2>
              <p className="text-sm text-gray-400 mt-1">Create a new deep link for your mobile app</p>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                Slug <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="summer-sale"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Letters, numbers, hyphens, and underscores only
              </p>
            </div>

            {/* App Parameters */}
            <div>
              <label htmlFor="app_params" className="block text-sm font-medium text-gray-300 mb-2">
                App Parameters (JSON) <span className="text-red-400">*</span>
              </label>
              <textarea
                id="app_params"
                value={appParams}
                onChange={(e) => setAppParams(e.target.value)}
                disabled={isLoading}
                rows={6}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 resize-none disabled:opacity-50"
                required
              />
              <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Custom parameters that your app will receive when the deep link is opened. Must be valid JSON.
                </p>
              </div>
            </div>

            {/* Social Meta - Optional Section */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-sm font-medium text-gray-300 mb-4">
                Social Media Metadata <span className="text-gray-500">(Optional)</span>
              </h3>

              {/* Social Title */}
              <div className="mb-4">
                <label htmlFor="social_title" className="block text-sm font-medium text-gray-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="social_title"
                  value={socialTitle}
                  onChange={(e) => setSocialTitle(e.target.value)}
                  placeholder="Summer Sale - 50% Off!"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50"
                />
              </div>

              {/* Social Description */}
              <div className="mb-4">
                <label htmlFor="social_description" className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  id="social_description"
                  value={socialDescription}
                  onChange={(e) => setSocialDescription(e.target.value)}
                  placeholder="Don't miss our biggest sale of the year"
                  disabled={isLoading}
                  rows={2}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 resize-none disabled:opacity-50"
                />
              </div>

              {/* Social Thumbnail */}
              <div>
                <label htmlFor="social_thumbnail" className="block text-sm font-medium text-gray-400 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  id="social_thumbnail"
                  value={socialThumbnail}
                  onChange={(e) => setSocialThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50"
                />
              </div>
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
                {isLoading ? "Creating..." : "Create Deep Link"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
