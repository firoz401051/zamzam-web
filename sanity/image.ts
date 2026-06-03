

import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url' // Use named export
import { client } from './lib/client'



// Rename the builder function if necessary for clarity
const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
