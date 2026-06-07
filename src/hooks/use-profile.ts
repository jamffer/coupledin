import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { useEffect } from "react";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  couple_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  const { data: partnerProfile, isLoading: isPartnerLoading } = useQuery({
    queryKey: ["partnerProfile", profile?.couple_id, user?.id],
    queryFn: async () => {
      if (!profile?.couple_id || !user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .neq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!profile?.couple_id && !!user,
  });

  useEffect(() => {
    if (!user) return;

    // Subscribe to current user's profile changes
    const userChannel = supabase
      .channel(`user-profile-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
        }
      )
      .subscribe();

    // Subscribe to partner's profile changes if in a couple
    let partnerChannel: any = null;
    if (profile?.couple_id) {
      partnerChannel = supabase
        .channel(`partner-profile-${profile.couple_id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `couple_id=eq.${profile.couple_id}`,
          },
          (payload) => {
            const updatedProfile = payload.new as Profile;
            if (updatedProfile.id !== user.id) {
              queryClient.invalidateQueries({ queryKey: ["partnerProfile", profile.couple_id, user.id] });
            }
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(userChannel);
      if (partnerChannel) {
        supabase.removeChannel(partnerChannel);
      }
    };
  }, [user, profile?.couple_id, queryClient]);

  return {
    profile,
    partnerProfile,
    isLoading: isProfileLoading || isPartnerLoading,
  };
}
