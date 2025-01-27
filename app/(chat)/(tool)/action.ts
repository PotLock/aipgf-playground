'use server'

import { removeToolById } from '@/db/queries';

export async function removeTool(id: string) {
  try {
    const removedTool = await removeToolById(id);
    console.log(`Removed tool with id: ${id}`);
    return { success: true, message: 'Tool removed successfully', tool: removedTool };
  } catch (error) {
    console.error(`Failed to remove tool with id: ${id}`, error);
    return { success: false, message: 'Failed to remove tool' };
  }
}