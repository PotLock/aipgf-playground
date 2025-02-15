'use server';

import { removeModelById } from '@/db/queries';


export async function removeModel(id: string) {
  try {
    const removedModel = await removeModelById(id);
    console.log(`Removed model with id: ${id}`);
    return { success: true, message: 'Model removed successfully', model: removedModel };
  } catch (error) {
    console.error(`Failed to remove model with id: ${id}`, error);
    return { success: false, message: 'Failed to remove model' };
  }
}