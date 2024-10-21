import { FC } from 'react';

interface IPaginationInfoProps {
  amount?: number;
  text?: string;
}

const PaginationInfo: FC<IPaginationInfoProps> = ({ amount, text }) => {
  if (!amount || !text) return null;

  return (
    <>
      <span>/</span>
      <div className="flex items-end space-x-1.5">
        <span className="font-bold">{amount}</span>
        <span className="whitespace-nowrap">{text}</span>
      </div>
    </>
  );
};

export default PaginationInfo;
