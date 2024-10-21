'use client';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ComponentBaseProps } from '@/common/interfaces';
import DropdownSelect from '@/components/common/dropdown-select';
import { AIChat, ChatMessage } from '../interfaces/chat.interface';

import { usePathname } from 'next/navigation'

type SelectPageProps = ComponentBaseProps;
import {
    SIDEBAR_LIST
} from '../constants/chat.constant';
const SelectPage: FC<SelectPageProps> = ({ className }) => {
    const pathname = usePathname()
    console.log("pathname", pathname)
    const [selectedOption, setSelectedOption] = useState<any>(SIDEBAR_LIST[0]);
    const aiDropdownOptionList = useMemo(
        () =>
            SIDEBAR_LIST.map(item => ({
                value: item.url,
                label: item.name
            })),
        [SIDEBAR_LIST]
    );

    const handleSelectAi = useCallback(
        (value: string) => {
            const selectedAi = SIDEBAR_LIST.find(option => option.id === value);

            if (selectedAi) {
                setSelectedOption(selectedAi);
            }
        },
        [SIDEBAR_LIST]
    );
    return (
        <div className="flex shrink-0 items-center gap-6 border-b-2 border-[#292F36] px-7 py-6 font-semibold">
            <p>Page</p>
            <DropdownSelect
                initialValue={pathname}
                options={aiDropdownOptionList}
                onSelect={handleSelectAi}
            />
        </div>
    )

}
export default SelectPage;