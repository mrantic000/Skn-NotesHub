
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid"; // Ensure this import is correct
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Profile = {
  id: string;
  username: string;
  about: string | null;
  avatar_url: string | null;
};

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
  ProfileAvatar: React.FC<{ className?: string }>;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  updateProfile: async () => {},
  uploadAvatar: async () => null,
  ProfileAvatar: () => null,
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [localProfileId, setLocalProfileId] = useState<string | null>(
    localStorage.getItem("profileId")
  );

  // Fetch or create profile
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      
      // Try to get profile from localStorage first
      if (localProfileId) {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", localProfileId)
          .single();
          
        if (data && !error) {
          setProfile(data);
          setLoading(false);
          return;
        }
      }
      
      // If authenticated, try to get profile linked to auth
      if (user) {
        // Check if user has a profile
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (data && !error) {
          setProfile(data);
          setLocalProfileId(data.id);
          localStorage.setItem("profileId", data.id);
          setLoading(false);
          return;
        }
        
        // Create new profile for authenticated user
        const newProfile = {
          id: user.id,
          username: user.user_metadata?.username || `user_${uuidv4().slice(0, 8)}`,
          about: null,
          avatar_url: null,
        };
        
        const { error: insertError } = await supabase
          .from("user_profiles")
          .insert(newProfile);
          
        if (!insertError) {
          setProfile(newProfile);
          setLocalProfileId(newProfile.id);
          localStorage.setItem("profileId", newProfile.id);
        } else {
          console.error("Error creating profile:", insertError);
        }
      } else if (!profile) {
        // Create anonymous profile if none exists
        const anonymousId = uuidv4();
        const anonymousProfile = {
          id: anonymousId,
          username: `user_${anonymousId.slice(0, 8)}`,
          about: null,
          avatar_url: null,
        };
        
        const { error } = await supabase
          .from("user_profiles")
          .insert(anonymousProfile);
          
        if (!error) {
          setProfile(anonymousProfile);
          setLocalProfileId(anonymousProfile.id);
          localStorage.setItem("profileId", anonymousProfile.id);
        } else {
          console.error("Error creating anonymous profile:", error);
        }
      }
      
      setLoading(false);
    };

    getProfile();
  }, [user]);
  
  // Update profile last active time
  useEffect(() => {
    if (profile?.id) {
      const updateLastActive = async () => {
        await supabase
          .from("user_profiles")
          .update({ last_active: new Date().toISOString() })
          .eq("id", profile.id);
      };
      
      updateLastActive();
      
      const interval = setInterval(updateLastActive, 5 * 60 * 1000); // Update every 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [profile?.id]);

  const updateProfile = async (data: Partial<Profile>) => {
    if (!profile?.id) return;
    
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(data)
        .eq("id", profile.id);
        
      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...data } : null);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!profile?.id) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const avatar_url = data.publicUrl;
      
      await updateProfile({ avatar_url });
      return avatar_url;
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error("Error uploading avatar");
      return null;
    }
  };
  
  const ProfileAvatar: React.FC<{ className?: string }> = ({ className }) => {
    return (
      <Avatar className={className}>
        {profile?.avatar_url ? (
          <AvatarImage src={profile.avatar_url} alt={profile.username} />
        ) : (
          <AvatarFallback>
            {profile?.username?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        )}
      </Avatar>
    );
  };

  const value = {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    ProfileAvatar,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  return useContext(ProfileContext);
};
