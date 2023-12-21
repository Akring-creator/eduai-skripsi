'use client';

import qs from 'query-string';
import { Search, List, FormInput } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

export const SearchInput = () => {
  const [value, setValue] = useState('');
  const [objectType, setObjectType] = useState('Kursus');
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get('categoryId');
  const objectTypeToggle = (value: string) => {
    setObjectType(value);
  };

  useEffect(() => {
    // that some shit bug
    if (debouncedValue !== '') {
      const url = qs.stringifyUrl(
        {
          url: pathname,
          query: {
            categoryId: currentCategoryId,
            title: debouncedValue,
          },
        },
        { skipEmptyString: true, skipNull: true }
      );
      router.push(url);
      console.log('Push' + url);
    }
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="w-full flex gap-x-2 items-center justify-between">
      <div className="relative">
        <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
        <Input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="w-full md:w-[300px] pl-9 outline-none focus-visible:outline-none focus-visible:ring-0"
          placeholder="Cari"
        />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              {objectType === 'Kursus' ? (
                <List className="h-4 w-4 mr-2" />
              ) : (
                <FormInput className="h-4 w-4 mr-2" />
              )}
              <span>{objectType === 'Kursus' ? 'Kursus' : 'Kuis'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => objectTypeToggle('Kursus')}>
              <List className="h-4 w-4 mr-2" />
              <p className="text-sm">Kursus</p>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => objectTypeToggle('Kuis')}>
              <FormInput className="h-4 w-4 mr-2" />
              <p className="text-sm">Kuis</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SearchInput;
