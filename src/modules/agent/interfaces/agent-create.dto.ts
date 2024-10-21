import { z } from 'zod';

import { CreateAgentFormSchema } from '../validations/agent-create-form';

export type AgentCreateFormData = z.infer<typeof CreateAgentFormSchema>;
