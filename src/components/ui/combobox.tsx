'use client';

import * as React from 'react';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Plus, Loader2 } from 'lucide-react';
import { apiConfig } from '@/api/api-config';

type Option = { label: string; value: string | number };

type ComboBoxProps = {
  type: keyof typeof apiConfig;
  value?: string | number | (string | number)[] | null;
  onChange: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
};

export default function ComboBox({
  type,
  value,
  onChange,
  placeholder = 'Select...',
  disabled,
  multiple = false,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<Option[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      if (!apiConfig[type]) return;
      try {
        const data = await apiConfig[type].getAll();
        setOptions(
          data.map((item: { id: number; name: string }) => ({
            value: item.id,
            label: item.name,
          })),
        );
      } catch (error) {
        console.error(`Error fetching ${multiple} ${type}:`, error);
      }
    }
    fetchData();
  }, [type, multiple]);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(input.toLowerCase()),
  );

  // Fungsi untuk menambah data ke API
  const handleCreate = async () => {
    if (!apiConfig[type] || !input.trim()) return;
    setLoading(true);

    try {
      await apiConfig[type].create(input); // Buat data baru

      // Fetch ulang semua data setelah create berhasil
      const updatedOptions = await apiConfig[type].getAll();

      setOptions(
        updatedOptions.map((item) => ({ value: item.id, label: item.name })),
      );

      const newItem = updatedOptions.find((item) => item.name === input);
      if (newItem) {
        if (multiple) {
          onChange([...(value as number[]), newItem.id]);
        } else {
          onChange(newItem.id);
        }
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
    }
    setLoading(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={input}
            onValueChange={setInput}
          />
          <CommandList>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => onChange(option.value)}
                >
                  {option.label}
                  {option.value === value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Tambahkan: {input}
                </Button>
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
