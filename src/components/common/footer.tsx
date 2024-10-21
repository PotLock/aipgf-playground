'use client';

import React, { FC } from 'react';

const Footer: FC = () => {
  return (
    <div className="footer bg-primary text-white" data-testid="footer">
      <div className="container py-5">
        <p className="text-center" data-testid="content">
          Website được thiết kế bởi&nbsp;
          <a className="text-white" href={'#'} target="_blank" rel="noreferrer" data-testid="link">
            Công Ty TNHH Giải Pháp Phần Mềm
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
