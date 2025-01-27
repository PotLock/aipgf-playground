'use server'

import { removeAgentById, changeAgentVisibility } from '@/db/queries';

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
export async function updateAgentVisibility(id: string, visibility: boolean) {
  try {
    await changeAgentVisibility(id, visibility);
    console.log(`Updated visibility for agent with id: ${id} to ${visibility}`);
    return { success: true, message: 'Agent visibility updated successfully' };
  } catch (error) {
    console.error(`Failed to update visibility for agent with id: ${id}`, error);
    return { success: false, message: 'Failed to update agent visibility' };
  }
}