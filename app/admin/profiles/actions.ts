'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function updateUserRole(userId: string, newRole: string) {
  const adminClient = createAdminClient();
  
  const { error } = await adminClient
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
