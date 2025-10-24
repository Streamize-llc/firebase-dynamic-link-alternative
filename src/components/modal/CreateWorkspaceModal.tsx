"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { createWorkspace } from "@/utils/action/server";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !subDomain) {
      toast.error("Please enter name and subdomain");
      return;
    }

    // 서브도메인 유효성 검사 (영문, 숫자, 하이픈만 허용)
    const subDomainRegex = /^[a-z0-9-]+$/;
    if (!subDomainRegex.test(subDomain)) {
      toast.error("Subdomain can only contain lowercase letters, numbers, and hyphens");
      return;
    }

    setIsLoading(true);

    try {
      const workspace = await createWorkspace(name, subDomain, description);
      toast.success("Workspace created successfully");
      onClose();
      router.push(`/dashboard/${workspace.id}`);
      router.refresh();
    } catch (error: any) {
      console.error("Error creating workspace:", error);
      toast.error(error.message || "Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setSubDomain("");
      setDescription("");
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
            <h2 className="text-xl font-semibold text-white">Create Workspace</h2>
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
            {/* Workspace Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Workspace Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Project"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50"
                required
              />
            </div>

            {/* Subdomain */}
            <div>
              <label htmlFor="subdomain" className="block text-sm font-medium text-gray-300 mb-2">
                Subdomain <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="subdomain"
                  value={subDomain}
                  onChange={(e) => setSubDomain(e.target.value.toLowerCase())}
                  placeholder="my-app"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 disabled:opacity-50"
                  required
                />
                <span className="px-4 py-2 bg-white/5 border border-l-0 border-white/10 rounded-r-lg text-gray-400 text-sm">
                  .depl.link
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Only lowercase letters, numbers, and hyphens allowed
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your workspace"
                disabled={isLoading}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 resize-none disabled:opacity-50"
              />
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
                {isLoading ? "Creating..." : "Create Workspace"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
