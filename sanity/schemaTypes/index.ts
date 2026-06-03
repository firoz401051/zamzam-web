import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { bannerType } from "./bannerType";
import { brandType } from "./brandTypes";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { authorType } from "./authType";
import { addressType } from "./addressType";
import { paymentMethodType } from "./paymentMethodType";
import loyaltyTransaction from "./loyaltyTransaction";
import { reviewType } from "./reviewType";

import { collectionType } from "./collectionType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    productType,
    orderType,
    bannerType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
    paymentMethodType,
    loyaltyTransaction,
    reviewType,
    collectionType,
  ],
};
