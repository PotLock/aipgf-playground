import { rest, setupWorker } from 'msw';

import { handlers } from './handlers';

const worker = setupWorker(...handlers);

export { rest, worker };
