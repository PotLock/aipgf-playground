import { CreateToolFormData } from '../interfaces/create-tool.dto';

export const PROMT_TYPES = {
  NORMAL: 'normal',
  WORKFLOW: 'workflow'
};

export const CREATE_TOOL_FORM_DEFAULT_VALUE: CreateToolFormData = {
  name: '',
  description: '',
  tag: '',
  jsonParameter: ''
};

export const PROMPT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'workflow', label: 'Workflow' }
];
