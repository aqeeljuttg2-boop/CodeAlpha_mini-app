/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { userService } from '../services/userService';
import { PostCard } from '../components/PostCard';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Loader } from '../components/Loader';
import {
  Calendar,
  Link as LinkIcon,
  MapPin,
  ShieldCheck,
  Grid,
  Image,
  Heart,
  Plus,
  PenTool,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { User, Post } from '../types';

export const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  
  const { user: authUser, updateProfile } = useAuth();
  const { posts, followUser } = useApp();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');
  
  // Edit Profile States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isOwnProfile = !username || (authUser && authUser.username === username);

  // Sync / load profile parameters
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const targetUsername = username || authUser?.username;
      
      if (!targetUsername) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const resp = await userService.getProfile(targetUsername);
        if (resp) {
          setProfileUser(resp);
        } else {
          setProfileUser(null);
        }
      } catch (e) {
        console.error('Error fetching profile detail', e);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, authUser, navigate]);

  // Sync edits inputs when open
  const handleOpenEdit = () => {
    if (profileUser) {
      setEditName(profileUser.name);
      setEditBio(profileUser.bio || '');
      setEditWebsite(profileUser.website || '');
      setEditLocation(profileUser.location || '');
      setIsEditOpen(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setIsSaving(true);
    const success = await updateProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      website: editWebsite.trim(),
      location: editLocation.trim(),
    });

    if (success) {
      // update state
      setProfileUser((prev) => prev ? {
        ...prev,
        name: editName.trim(),
        bio: editBio.trim(),
        website: editWebsite.trim(),
        location: editLocation.trim(),
      } : null);
      setIsEditOpen(false);
    }
    setIsSaving(false);
  };

  const handleFollowToggle = async () => {
    if (profileUser) {
      await followUser(profileUser.username);
      // Toggle local follower triggers count
      const isFollowing = !profileUser.isFollowing;
      setProfileUser((prev) => prev ? {
        ...prev,
        isFollowing: isFollowing,
        followersCount: prev.followersCount + (isFollowing ? 1 : -1)
      } : null);
    }
  };

  if (loading) {
    return <Loader type="spinner" />;
  }

  if (!profileUser) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-150 rounded-2xl select-none">
        <HelpCircle className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Profile Not Found</h4>
        <p className="text-xs text-zinc-400 mt-1 pb-4">The profile matching @{username} does not exist in our system.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  // Filter local posts to matching user
  const authoredPosts = posts.filter((p) => p.user.username === profileUser.username);
  const mediaPosts = authoredPosts.filter((p) => !!p.image);
  const likedPosts = posts.filter((p) => p.isLiked);

  const getFilteredPosts = () => {
    if (activeTab === 'media') return mediaPosts;
    if (activeTab === 'likes') return likedPosts;
    return authoredPosts;
  };

  const activePosts = getFilteredPosts();

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* 1. Header Hero Cover Container Banner */}
      <div className="relative w-full h-40 md:h-52 bg-zinc-150 dark:bg-zinc-900 overflow-hidden shrink-0 select-none rounded-t-2xl border border-b-0 border-zinc-100 dark:border-zinc-850">
        {profileUser.coverImage ? (
          <img
            src={profileUser.coverImage}
            alt="Profile Banner Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-805" />
        )}
      </div>

      {/* 2. User Bio Cards Roster Info */}
      <div className="bg-white dark:bg-zinc-900 border border-t-0 border-zinc-100 dark:border-zinc-850 p-5 rounded-b-2xl shadow-xs relative flex flex-col gap-4">
        
        {/* Absolute Avatar Placement overlay */}
        <div className="absolute -top-12 md:-top-16 left-5 select-none hover:scale-101 transition-transform">
          <Avatar
            src={profileUser.avatar}
            name={profileUser.name}
            size="xl"
            isVerified={profileUser.isVerified}
            className="border-4 border-white dark:border-zinc-900 shadow-lg"
          />
        </div>

        {/* Action Button Trigger Right */}
        <div className="flex justify-end select-none h-10 items-end">
          {isOwnProfile ? (
            <Button
              onClick={handleOpenEdit}
              variant="secondary"
              size="sm"
              className="font-bold border dark:border-zinc-800 rounded-xl flex items-center gap-1.5"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Button>
          ) : (
            <Button
              onClick={handleFollowToggle}
              variant={profileUser.isFollowing ? 'secondary' : 'primary'}
              size="sm"
              className="font-bold rounded-xl"
            >
              {profileUser.isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>

        {/* Main profile strings info */}
        <div className="flex flex-col mt-1 select-text">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {profileUser.name}
            </h1>
            {profileUser.isVerified && (
              <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-500/10 shrink-0" />
            )}
          </div>
          <span className="text-xs text-zinc-450 dark:text-zinc-500 font-semibold tracking-wide">
            @{profileUser.username}
          </span>

          {profileUser.bio && (
            <p className="text-sm text-zinc-705 dark:text-zinc-250 leading-relaxed mt-3 max-w-2xl font-sans whitespace-pre-wrap">
              {profileUser.bio}
            </p>
          )}

          {/* Location / Website / Calendar Fields Row */}
          <div className="flex flex-wrap items-center gap-x-4.5 gap-y-2 mt-4 text-xs text-zinc-500 dark:text-zinc-450 font-medium select-none">
            {profileUser.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{profileUser.location}</span>
              </span>
            )}
            {profileUser.website && (
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                <a
                  href={`https://${profileUser.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {profileUser.website}
                </a>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{profileUser.joinDate}</span>
            </span>
          </div>
        </div>

        {/* Stats Row Block */}
        <div className="flex items-center gap-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-850 mt-1 text-zinc-600 dark:text-zinc-300 font-sans select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {profileUser.followingCount}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-500 font-semibold">Following</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {profileUser.followersCount}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-500 font-semibold">Followers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {authoredPosts.length}
            </span>
            <span className="text-xs text-zinc-450 dark:text-zinc-500 font-semibold">Posts</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Navigation Tabs */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-850 mt-5 mb-4 shrink-0 select-none">
        {[
          { id: 'posts', label: 'Posts', icon: Grid, count: authoredPosts.length },
          { id: 'media', label: 'Media', icon: Image, count: mediaPosts.length },
          { id: 'likes', label: 'Likes', icon: Heart, count: likedPosts.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5
              ${activeTab === tab.id
                ? 'border-blue-600 text-blue-650 dark:border-blue-500 dark:text-blue-400 font-extrabold'
                : 'border-transparent text-zinc-505 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-850 dark:text-zinc-400 ml-1">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 4. Tab Contents rendering */}
      <div className="flex flex-col gap-4.5 animate-in fade-in duration-200">
        {activePosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-2xl text-center gap-3 select-none">
            <span className="text-3xl">📭</span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Tab section empty</h4>
            <p className="text-xs text-zinc-440 dark:text-zinc-500 max-w-xs leading-normal">
              No posts found on this list yet. Author more updates, or explore what other users are liking!
            </p>
          </div>
        ) : (
          activePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* 5. Edit Profile dialog sheet modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Profile Parameters">
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 font-sans select-none">
          
          <Input
            id="editName"
            type="text"
            label="Display Name"
            placeholder="Sarah Jenkins"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
            maxLength={50}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Bio Summary (Max 160 characters)
            </label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value.substring(0, 160))}
              placeholder="Tell other engineering minds what you work on..."
              rows={3}
              className="
                w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950
                text-zinc-905 dark:text-zinc-100 placeholder-zinc-400 p-3 text-sm outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none transition-all
              "
            />
          </div>

          <Input
            id="editWebsite"
            type="text"
            label="Website Address (Exclude https://)"
            placeholder="sarahj.design"
            value={editWebsite}
            onChange={(e) => setEditWebsite(e.target.value)}
            maxLength={100}
          />

          <Input
            id="editLocation"
            type="text"
            label="Geo Location"
            placeholder="San Francisco, CA"
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
            maxLength={50}
          />

          <div className="flex justify-end gap-2.5 mt-2 pt-4 border-t border-zinc-100 dark:border-zinc-850">
            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSaving} disabled={!editName.trim()}>
              Save Modifications
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Profile;
