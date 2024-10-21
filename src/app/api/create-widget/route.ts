import { NextResponse } from 'next/server';
import { searchTool, widgetTool } from '@/modules/ai/chain';

export async function POST(request: Request) {
  try {
    const { prompt, tool_ids } = await request.json();
    const widgetPrompt = prompt;
    const data = {
      prompt: widgetPrompt,
      tool_ids: tool_ids
    };

    const tools = await searchTool(data);
    const prompts = widgetPrompt + tools;
    const code = await widgetTool({ prompt: prompts, tool_ids });

    console.log('Created widget', code);

    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error creating widget:', error);
    return NextResponse.json({ error: 'Failed to create widget' }, { status: 500 });
  }
}
