import { z } from 'zod';

import { CreateWidgetFormSchema } from '../validations/create-widget-form';

export type CreateWidgetFormData = z.infer<typeof CreateWidgetFormSchema>;
