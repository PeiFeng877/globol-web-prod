/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: profile + optional href + text overrides
 * OUTPUT: Profile card
 * POS: Feature Component
 * CONTRACT: Displays user profile summary with status badges and optional detail link.
 * 职责: 单个用户卡片展示。
 */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserProfileView } from '@/data/profiles';
import { ArrowUpRight, MapPin, User } from 'lucide-react';

interface UserCardProps {
  profile: UserProfileView;
  profileHref?: string;
  viewProfileText?: string;
  seekingText?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  profile,
  profileHref,
  viewProfileText = "View Profile",
  seekingText = "Seeking:"
}) => {
  const cardContent = (
    <>
      {/* Image Section - Rounded corners handled by parent container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
             {profile.avatar ? (
               <Image 
                 src={profile.avatar} 
                 alt={profile.name}
                 fill
                 className="object-cover"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <User size={64} className="opacity-10 text-gray-500" />
               </div>
             )}
        </div>
      </div>

      {/* Content Section - Adjusted for ArticleCard like structure */}
      <div className="p-6 flex flex-col grow justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
              {profile.name}, {profile.age}
          </h3>
          
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2 font-medium">
             <MapPin size={14} className="text-gray-400" />
             <span className="line-clamp-1">{profile.city}, {profile.countryDisplay}</span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {profile.bio}
          </p>
        </div>
        
        {/* Seeking Tag */}
        <div className="flex items-center justify-between mt-auto">
             <span className="px-3 py-1 border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-600">
                {seekingText} {profile.seeking}
             </span>
             {profileHref && (
               <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 transition-colors duration-200 group-hover:text-gray-900">
                  {viewProfileText}
                  <ArrowUpRight size={14} />
               </span>
             )}
        </div>
      </div>
    </>
  );

  if (profileHref) {
    return (
      <Link
        href={profileHref}
        className="group flex flex-col bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="group flex flex-col bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {cardContent}
    </div>
  );
};
