'use server'

import { removeToolById, changeToolVisibility } from '@/db/queries';

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
export async function updateToolVisibility(id: string, visibility: boolean) {
    try {
        await changeToolVisibility(id, visibility);
        console.log(`Updated visibility for tool with id: ${id} to ${visibility}`);
        return { success: true, message: 'Tool visibility updated successfully' };
    } catch (error) {
        console.error(`Failed to update visibility for tool with id: ${id}`, error);
        return { success: false, message: 'Failed to update tool visibility' };
    }
}