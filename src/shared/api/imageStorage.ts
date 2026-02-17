import { supabase } from './supabase';

const BUCKET_NAME = 'uploads';

export const feedImageStorage = {
  async removeAll(userId: string, feedId: number): Promise<void> {
    if (!userId) throw new Error('[Storage] userId is required for deletion');
    if (!feedId) throw new Error('[Storage] feedId is required for deletion');
    
    const path = `${userId}/feeds/${feedId}`;

    try {
      console.log(`[Storage] Deleting images for feed: ${path}`);
      const { data: files, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(path);

      if (error) throw error;
      if (!files || files.length === 0) {
        console.log('[Storage] No files found to delete.');
        return;
      }

      const filesToRemove = files.map((f) => `${path}/${f.name}`);
      console.log(`[Storage] Removing files:`, filesToRemove);

      const { data: removed, error: removeError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filesToRemove);

      if (removeError) throw removeError;
      console.log(`[Storage] Successfully removed ${removed?.length} files.`);
    } catch (e: any) {
      console.warn('[Storage] Failed to delete feed images:', e.message || e);
    }
  },
};

export const profileImageStorage = {
  getProfileImagePath(userId: string) {
    return `${userId}/profile/profile_img.png`;
  },

  async upload(userId: string, file: File): Promise<string> {
    const path = this.getProfileImagePath(userId);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        upsert: true, // ✅ 덮어쓰기
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

    return data.publicUrl;
  },
};
