
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/context/ProfileContext";
import { Camera } from "lucide-react";
import { toast } from "sonner";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { profile, updateProfile, uploadAvatar, ProfileAvatar } = useProfile();
  const [username, setUsername] = useState(profile?.username || "");
  const [about, setAbout] = useState(profile?.about || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProfile({
        username,
        about: about || null,
      });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large. Maximum size is 2MB.");
        return;
      }

      try {
        setIsUploading(true);
        await uploadAvatar(file);
        toast.success("Avatar updated successfully");
      } catch (error) {
        console.error("Error uploading avatar:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and avatar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative" onClick={handleAvatarClick}>
              <ProfileAvatar className="h-20 w-20 cursor-pointer" />
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer">
                <Camera className="h-4 w-4 text-white" />
              </div>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
