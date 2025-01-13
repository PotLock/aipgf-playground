'use server'

import { removeAgentById } from '@/db/queries';

export async function removeAgent(id: string) {
  try {
    const removedAgent = await removeAgentById(id);
    console.log(`Removed agent with id: ${id}`);
    return { success: true, message: 'Agent removed successfully', agent: removedAgent };
  } catch (error) {
    console.error(`Failed to remove agent with id: ${id}`, error);
    return { success: false, message: 'Failed to remove agent' };
  }
}