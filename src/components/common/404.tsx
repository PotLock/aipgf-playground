import { FC } from 'react';

import Link from 'next/link'

type ErrorInformationType = {
  code: number;
  message?: string;
};

const ErrorInformation: FC<ErrorInformationType> = ({ code, message }) => {

  return (
    <div className="grid min-h-screen place-items-center p-4 sm:p-8">
      <div className="text-center">
        <h1 className="text-bolder mb-5 text-6xl font-bold leading-normal text-primary sm:text-3xl">{code}</h1>
        <p>{message}</p>
        <div className="mb-11"></div>
        <Link
          href={'/'}
          className="inline-flex items-center underline hover:no-underline focus:outline-none sm:text-base"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default ErrorInformation;
