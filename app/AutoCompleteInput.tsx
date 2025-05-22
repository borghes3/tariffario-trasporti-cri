"use client";

import usePlacesAutocomplete from "use-places-autocomplete";
import { Input } from "@/components/ui/input";

export default function AutocompleteInput({ onSelect }: { onSelect: (placeId: string, description: string) => void; }) {

  const {
    ready,
    value,
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = (description: string, placeId: string) => {
    setValue(description, false);
    clearSuggestions();
    onSelect(placeId, description);
  };

  return (
    <div className="w-full mb-4 max-w-xl text-sm">
      <Input
        className="rounded-sm text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Inserisci indirizzo"
      />
      <div className={`mt-1 border rounded-sm shadow-md ${data.length <= 0 ? 'hidden' : ''}`}>
        {data.map((suggestion) => (
          <div
            key={suggestion.place_id}
            onClick={() => handleSelect(suggestion.description, suggestion.place_id)}
            className="cursor-pointer px-3 py-1 hover:bg-gray-100"
          >
            {suggestion.description}
          </div>
        ))}
      </div>
    </div>
  );
}
