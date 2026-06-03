import { Button, Stack, TextInput } from "@sanity/ui";
import { useState, useCallback } from "react";
import { StringInputProps, set, unset, useFormValue } from "sanity";

export function AsinInput(props: StringInputProps) {
  const { elementProps, onChange, value = "" } = props;
  const [isGenerating, setIsGenerating] = useState(false);

  // Get the product name from the current document
  const productName = useFormValue(["name"]) as string;

  const generateAsin = useCallback(() => {
    setIsGenerating(true);

    if (productName) {
      // Extract first 2 words and convert to uppercase
      const words = productName.trim().split(/\s+/);
      const firstTwoWords = words.slice(0, 2).join("").toUpperCase();

      // Generate random numbers for ASIN format
      const randomNumbers = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");

      // Create ASIN: SW (zamzam) + first 2 words + random numbers
      const generatedAsin = `SW${firstTwoWords}${randomNumbers}`;

      // Update the field value
      onChange(set(generatedAsin));
    }

    setIsGenerating(false);
  }, [productName, onChange]);

  return (
    <Stack space={2}>
      <TextInput
        {...elementProps}
        onChange={(event) =>
          onChange(
            event.currentTarget.value ? set(event.currentTarget.value) : unset()
          )
        }
        value={value}
        placeholder="e.g., SWIPHONEPRO123456"
      />
      <Button
        onClick={generateAsin}
        text={isGenerating ? "Generating..." : "Generate ASIN"}
        tone="primary"
        mode="ghost"
        disabled={isGenerating || !productName}
      />
    </Stack>
  );
}
