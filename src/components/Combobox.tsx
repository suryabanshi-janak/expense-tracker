import * as React from 'react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useLoanStore } from '@/store/useLoanStore';

export interface InputProps extends React.HTMLAttributes<HTMLDivElement> {
  field: any;
  onCommandSelect: (value: string) => void;
}

const Combobox = React.forwardRef<HTMLDivElement, InputProps>(
  ({ className, field, onCommandSelect }, ref) => {
    const { loans } = useLoanStore();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [isFocused, setIsFocused] = React.useState(false);

    const commandItems = React.useMemo(() => {
      if (loans?.length) {
        return loans.map((loan) => loan.payee_payor);
      }
      return [];
    }, [loans]);

    return (
      <div className={cn('relative', className)} ref={ref}>
        <Command>
          <CommandInput
            {...field}
            placeholder='Name'
            value={field.value}
            onChangeCapture={field.onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className='px-3 border'
            ref={inputRef}
          />

          {isFocused && field.value && (
            <div className='absolute z-50 w-full bg-white shadow-md top-11'>
              <CommandGroup>
                {commandItems.map((item) => (
                  <CommandItem key={item} onSelect={onCommandSelect}>
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </Command>
      </div>
    );
  }
);
Combobox.displayName = 'Combobox';

export { Combobox };
