import * as React from 'react';
import Turnstone from 'turnstone';
import recentSearchesPlugin from 'turnstone-recent-searches';

import { TURNSTONE_MAX_ITEM } from '@/constants';

export interface AutoCompleteSearchProps
  extends React.HTMLAttributes<HTMLDivElement> {
  listbox: string[];
}

const AutoCompleteSearch = React.forwardRef<
  HTMLDivElement,
  AutoCompleteSearchProps
>(({ listbox, ...props }, ref) => {
  return (
    <Turnstone
      ref={ref}
      id='auto-complete-search'
      name='auto-complete-search'
      autoFocus={true}
      typeahead={true}
      clearButton={true}
      debounceWait={250}
      listboxIsImmutable={true}
      maxItems={TURNSTONE_MAX_ITEM}
      listbox={listbox}
      noItemsMessage="We couldn't find any character that matches your search"
      placeholder='Search for any character in the MCU'
      styles={{
        input: 'w-full border py-2 px-4 text-lg outline-none rounded-md',
        listbox: 'bg-neutral-900 w-full text-slate-50 rounded-md',
        highlightedItem: 'bg-neutral-800',
        query: 'text-oldsilver-800 placeholder:text-slate-600',
        typeahead: 'text-slate-500',
        clearButton:
          'absolute inset-y-0 text-lg right-0 w-10 inline-flex items-center justify-center bg-netural-700 hover:text-red-500',
        noItems: 'cursor-default text-center my-20',
        match: 'font-semibold',
        groupHeading: 'px-5 py-3 text-pink-500',
      }}
      plugins={[recentSearchesPlugin]}
      {...props}
    />
  );
});
AutoCompleteSearch.displayName = 'AutoCompleteSearch';

export { AutoCompleteSearch };
