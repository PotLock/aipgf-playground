import { CreateWidgetFormData } from '../interfaces/create-widget.dto';

export const PROMT_TYPES = {
  NORMAL: 'normal',
  WORKFLOW: 'workflow'
};

export const CREATE_WIDGET_FORM_DEFAULT_VALUE: CreateWidgetFormData = {
  name: '',
  description: '',
  tag: '',
  prompt: '',
  tool: ''
};

export const PROMPT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'workflow', label: 'Workflow' }
];
