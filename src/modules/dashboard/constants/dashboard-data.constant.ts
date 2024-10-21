import { WidgetItem } from '../interfaces/dashboard.interface';

import AvatarImage from '@/assets/images/avatar/avatar-1.jpeg';

export const DASH_BOARD_AGENT_LIST = [
  { name: 'Agent 1', avatar: '/avatar2.png' },
  { name: 'Agent 2', avatar: '/avatar1.png' },
  { name: 'Agent 3', avatar: '/avatar3.png' }
];

export const DASH_BOARD_NOTE_LIST: WidgetItem[] = [
  { id: 1, content: 'add note', size: 'small' },
  { id: 2, content: 'add note', size: 'medium' },
  { id: 3, content: 'add note', size: 'large' }
];
