import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import AugmentedPopup from '@/modules/augmented/components/augmented-popup';

type AptosReceiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  address: string;
};

export default function AptosReceiveModal({ isOpen, onClose, address }: AptosReceiveModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopySuccess(true);
  };
  return (
    <AugmentedPopup visible={isOpen} onClose={onClose} textHeading="Receive APT">
      <div className="flex max-h-[80vh] flex-col items-center gap-4 overflow-y-auto p-8">
        <p className="mb-5 text-white">Scan the QR code or copy the address to receive APT</p>
        <div className="rounded-lg bg-white p-2">
          <QRCodeSVG value={`${process.env.NEXT_PUBLIC_VERCEL_URL}/dashboard?address=${address}`} size={200} />
        </div>
        <div className="flex w-full items-center justify-between rounded-md bg-gray-800 p-3">
          <span className="mr-2 truncate text-sm">{address}</span>

          <Button onClick={copyToClipboard} variant="outline" className="text-white hover:text-black">
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
    </AugmentedPopup>
  );
}
