import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Loader2, Search, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import {
  searchBrapi,
  searchCoinGecko,
  searchFixedIncome,
  type AssetSearchResult,
} from "@/lib/asset-search";

interface TickerComboboxProps {
  assetType: "STOCK" | "FII" | "CRYPTO" | "FIXED_INCOME";
  fixedIncomeType?: "PUBLIC" | "PRIVATE";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TickerCombobox({
  assetType,
  fixedIncomeType = "PRIVATE",
  value,
  onChange,
  placeholder,
}: TickerComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<AssetSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Determine the correct placeholder based on the asset type
  const computedPlaceholder =
    placeholder ??
    (assetType === "CRYPTO"
      ? "Ex: bitcoin"
      : assetType === "FIXED_INCOME"
        ? fixedIncomeType === "PUBLIC"
          ? "Ex: Tesouro Selic"
          : "Ex: CDB Prefixado"
        : "Ex: PETR4");

  // ── Search Logic ───────────────────────────────────────────
  const performSearch = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setHasError(false);
      try {
        let data: AssetSearchResult[] = [];

        if (assetType === "FIXED_INCOME") {
          data = searchFixedIncome(query, fixedIncomeType);
        } else if (assetType === "STOCK" || assetType === "FII") {
          data = await searchBrapi(query);
        } else if (assetType === "CRYPTO") {
          data = await searchCoinGecko(query);
        }

        setResults(data);
      } catch {
        setHasError(true);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [assetType, fixedIncomeType]
  );

  // React to debounced search changes
  useEffect(() => {
    performSearch(debouncedSearch);
  }, [debouncedSearch, performSearch]);

  // Pre-load results when the popover opens
  useEffect(() => {
    if (open && results.length === 0 && !isLoading) {
      performSearch("");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset results when asset type changes
  useEffect(() => {
    setResults([]);
    setSearchTerm("");
  }, [assetType, fixedIncomeType]);

  // Find the currently selected result for display
  const selectedLabel =
    results.find((r) => r.value === value)?.label || value || undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between apple-interactive rounded-xl font-normal h-9 px-3",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {selectedLabel ?? computedPlaceholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 apple-card rounded-xl shadow-xl border-border/40"
        align="start"
        sideOffset={6}
      >
        <Command shouldFilter={false} className="rounded-xl">
          <CommandInput
            placeholder={`Buscar ${assetType === "CRYPTO" ? "cripto" : assetType === "FIXED_INCOME" ? "título" : "ticker"}...`}
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-10"
          />
          <CommandList className="max-h-[220px]">
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Buscando ativos...</span>
              </div>
            )}

            {/* Error state */}
            {!isLoading && hasError && (
              <div className="flex flex-col items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <AlertCircle className="h-5 w-5 text-destructive/60" />
                <span>Falha na busca. Tente novamente.</span>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !hasError && results.length === 0 && (
              <CommandEmpty>Nenhum ativo encontrado.</CommandEmpty>
            )}

            {/* Results */}
            {!isLoading && results.length > 0 && (
              <CommandGroup>
                {results.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        value === item.value ? "opacity-100 text-primary" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold truncate">
                        {item.label}
                      </span>
                      {item.subtitle && (
                        <span className="text-[11px] text-muted-foreground truncate">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
