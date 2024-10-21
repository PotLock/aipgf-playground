import { FC } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import DashboardAvatar from './dashboard-avatar';

type IDashboardAgentListProps = ComponentBaseProps & {
  items: {
    _id: string;
    name: string;
    avatar: string;
  }[];
  onClick: (item: any) => void;
};

const DashboardAgentList: FC<IDashboardAgentListProps> = ({ className, items, onClick }) => {
  //console.log('items', items);
  return (
    <Carousel opts={{ align: 'start', loop: true }} className={classNames('w-full', className)}>
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem onClick={() => onClick(item)} key={index} className="basis-1/2 md:basis-1/3">
            <div className="flex flex-col items-center gap-2">
              <DashboardAvatar imageUrl={item.avatar} altText={item.name} />
              <p>{item.name}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default DashboardAgentList;
