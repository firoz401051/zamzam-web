// Test utility for extracting text from Sanity blocks
// This file helps test the extractTextFromBlocks function

import { extractTextFromBlocks } from "./stripe-utils";

// Example Sanity block structures for testing
export const testCases = {
  // Simple string
  simpleString: "This is a simple string description",

  // Single block
  singleBlock: {
    _type: "block",
    style: "normal",
    _key: "72be974d25fe",
    children: [
      {
        text: "This is a single block with text content.",
        _type: "span",
        _key: "ada14d958169",
      },
    ],
  },

  // Multiple blocks (array)
  multipleBlocks: [
    {
      _type: "block",
      style: "normal",
      _key: "block1",
      children: [
        {
          text: "First paragraph text. ",
          _type: "span",
          _key: "span1",
        },
      ],
    },
    {
      _type: "block",
      style: "normal",
      _key: "block2",
      children: [
        {
          text: "Second paragraph text.",
          _type: "span",
          _key: "span2",
        },
      ],
    },
  ],

  // Complex nested structure (like the error case)
  complexNested: {
    "0": {
      _type: "block",
      style: "normal",
      _key: "72be974d25fe",
      children: {
        "0": {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod neque quos dolores nisi minima? Quam eos assumenda quo animi ab modi incidunt sunt delectus, aliquid deserunt possimus ex, sit nostrum? Temporibus dolores cum pariatur enim, quasi, aut minima voluptate sapiente eaque cumque esse. Asperiores ea aliquid tempora reiciendis incidunt obcaecati aliquam, voluptate aperiam error, velit doloribus maxime recusandae provident modi ipsum tempore. Architecto consequuntur harum beatae perferendis? Nisi quaerat autem quam perspiciatis veniam harum, quod tenetur corrupti ut. Ipsum molestiae, voluptatum eius cumque fuga, voluptatem consequatur dicta quas non repellendus neque odit, iure ullam accusantium! Exercitationem accusamus velit voluptas quia qui sunt voluptates nihil natus, quaerat dolorum. Quia voluptatem consequuntur, corporis rerum inventore quis deserunt quae at aspernatur amet impedit quod porro harum quibusdam, facere unde asperiores sed eligendi est. Voluptas perferendis corrupti, totam eius optio recusandae iure eum placeat est. Repellat explicabo itaque cumque quod, maxime optio distinctio expedita.",
          _type: "span",
          _key: "ada14d958169",
        },
      },
    },
  },

  // Empty/null cases
  emptyString: "",
  nullValue: null,
  undefinedValue: undefined,
  emptyObject: {},
  emptyArray: [],
};

// Test function to validate all cases
export function runTextExtractionTests() {
  console.log("Testing text extraction from Sanity blocks...\n");

  Object.entries(testCases).forEach(([testName, testData]) => {
    console.log(`Test: ${testName}`);
    try {
      const result = extractTextFromBlocks(testData);
      console.log(`Result: "${result}"`);
      console.log(`Length: ${result.length} characters\n`);
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
      console.log("");
    }
  });

  // Test the specific error case from the log
  console.log("Testing specific error case from Stripe...");
  const errorCaseData = {
    "0": {
      _type: "block",
      style: "normal",
      _key: "72be974d25fe",
      children: {
        "0": {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod neque quos dolores nisi minima?",
          _type: "span",
          _key: "ada14d958169",
        },
      },
    },
  };

  try {
    const result = extractTextFromBlocks(errorCaseData);
    console.log(`Error case result: "${result}"`);
    console.log(`Error case length: ${result.length} characters`);
  } catch (error) {
    console.error("Error in specific case:", error);
  }
}

// Helper function to safely format descriptions for Stripe
export function formatDescriptionForStripe(
  description: any,
  maxLength = 5000
): string {
  const text = extractTextFromBlocks(description);

  // Truncate if too long for Stripe (max 5000 characters)
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  }

  return text;
}

// Usage example:
// import { formatDescriptionForStripe } from './sanity-text-utils';
// const stripeDescription = formatDescriptionForStripe(sanityDescription);
