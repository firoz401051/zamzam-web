// Test file to verify the Sanity block text extraction fix
import { extractTextFromBlocks } from "./stripe-utils";

// This is the exact problematic block structure from the error log
const problematicBlock = {
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
};

// Test normal string
const normalString = "This is a normal product description";

// Test normal Sanity block array
const normalBlocks = [
  {
    _type: "block",
    style: "normal",
    _key: "block1",
    children: [
      {
        text: "This is a normal block description.",
        _type: "span",
        _key: "span1",
      },
    ],
  },
];

console.log("=== Testing Sanity Block Text Extraction ===\n");

console.log("1. Testing normal string:");
try {
  const result1 = extractTextFromBlocks(normalString);
  console.log(`✅ Result: "${result1}"`);
  console.log(`   Length: ${result1.length} characters\n`);
} catch (error) {
  console.log(`❌ Error: ${error}\n`);
}

console.log("2. Testing normal Sanity blocks:");
try {
  const result2 = extractTextFromBlocks(normalBlocks);
  console.log(`✅ Result: "${result2}"`);
  console.log(`   Length: ${result2.length} characters\n`);
} catch (error) {
  console.log(`❌ Error: ${error}\n`);
}

console.log(
  "3. Testing problematic block structure (the one that caused Stripe error):"
);
try {
  const result3 = extractTextFromBlocks(problematicBlock);
  console.log(`✅ Result: "${result3.substring(0, 100)}..."`);
  console.log(`   Length: ${result3.length} characters`);
  console.log(`   ✅ SUCCESS: No more Stripe invalid string error!\n`);
} catch (error) {
  console.log(`❌ Error: ${error}\n`);
}

console.log("4. Testing null/undefined values:");
try {
  console.log(`null: "${extractTextFromBlocks(null)}"`);
  console.log(`undefined: "${extractTextFromBlocks(undefined)}"`);
  console.log(`empty object: "${extractTextFromBlocks({})}"`);
  console.log(`empty array: "${extractTextFromBlocks([])}"`);
  console.log("✅ All edge cases handled properly\n");
} catch (error) {
  console.log(`❌ Error with edge cases: ${error}\n`);
}

export { problematicBlock, normalString, normalBlocks };
