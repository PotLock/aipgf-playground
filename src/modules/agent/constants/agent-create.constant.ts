import { AgentCreateFormData } from '../interfaces/agent-create.dto';

export const PROMT_TYPES = {
  NORMAL: 'normal',
  WORKFLOW: 'workflow'
};

export const AGENT_CREATE_FORM_DEFAULT_VALUE: AgentCreateFormData = {
  name: '',
  description: '',
  tag: '',
  introMessage: '',
  promtType: PROMT_TYPES.NORMAL,
  prompt: '',
  widget: '',
  tool: ''
};

export const PROMPT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'workflow', label: 'Workflow' }
];
