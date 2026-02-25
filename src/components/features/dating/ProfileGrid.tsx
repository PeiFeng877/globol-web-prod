/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: profiles + optional base path + text overrides
 * OUTPUT: Profile grid layout
 * POS: Feature Component
 * CONTRACT: Renders profile cards or empty state for dating listings, with optional detail links.
 * 职责: 国际交友卡片网格与空态。
 */
import React from 'react';
import { UserProfileView } from '@/data/profiles';
import { UserCard } from './UserCard';

interface ProfileGridProps {
  profiles: UserProfileView[];
  profileBasePath?: string;
  viewProfileText?: string;
  seekingText?: string;
  noProfilesTitle?: string;
  noProfilesDesc?: string;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ 
    profiles,
    profileBasePath,
    viewProfileText, 
    seekingText,
    noProfilesTitle = "No profiles found",
    noProfilesDesc = "Try adjusting your filters or check back later."
}) => {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{noProfilesTitle}</h3>
        <p className="text-gray-600">{noProfilesDesc}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {profiles.map((profile) => (
        <UserCard 
            key={profile.id} 
            profile={profile} 
            profileHref={profileBasePath ? `${profileBasePath}/${profile.name.toLowerCase().replace(/\s+/g, '-')}` : undefined}
            viewProfileText={viewProfileText}
            seekingText={seekingText}
        />
      ))}
    </div>
  );
};
