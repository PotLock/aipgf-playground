import { loadEnvConfig } from '@next/env';

const setupEnv = () => {
  loadEnvConfig(process.cwd());
};

export default setupEnv;
