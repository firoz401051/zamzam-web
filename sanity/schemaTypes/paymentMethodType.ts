import { CreditCardIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const paymentMethodType = defineType({
  name: "paymentMethod",
  title: "Payment Method",
  type: "document",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "clerkUserId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Clerk user ID to link payment method to user",
    }),
    defineField({
      name: "cardType",
      title: "Card Type",
      type: "string",
      options: {
        list: [
          { title: "Visa", value: "visa" },
          { title: "MasterCard", value: "mastercard" },
          { title: "American Express", value: "amex" },
          { title: "Discover", value: "discover" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "last4",
      title: "Last 4 Digits",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .length(4)
          .regex(/^\d{4}$/),
      description: "Last 4 digits of the card number",
    }),
    defineField({
      name: "expiryMonth",
      title: "Expiry Month",
      type: "string",
      validation: (Rule) => Rule.required().regex(/^(0[1-9]|1[0-2])$/),
      description: "Card expiry month in MM format",
    }),
    defineField({
      name: "expiryYear",
      title: "Expiry Year",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{4}$/)
          .custom((year) => {
            if (!year) return true;
            const currentYear = new Date().getFullYear();
            const inputYear = parseInt(year);
            return (
              inputYear >= currentYear || "Expiry year cannot be in the past"
            );
          }),
      description: "Card expiry year in YYYY format",
    }),
    defineField({
      name: "holderName",
      title: "Cardholder Name",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .max(50)
          .regex(/^[a-zA-Z\s]+$/),
      description: "Name as it appears on the card",
    }),
    defineField({
      name: "isDefault",
      title: "Default Payment Method",
      type: "boolean",
      initialValue: false,
      description: "Set as default payment method for this user",
    }),
    defineField({
      name: "nickname",
      title: "Card Nickname",
      type: "string",
      validation: (Rule) => Rule.max(30),
      description:
        "Optional nickname for the card (e.g., 'Personal Card', 'Work Card')",
    }),
    defineField({
      name: "stripePaymentMethodId",
      title: "Stripe Payment Method ID",
      type: "string",
      description: "Stripe payment method ID for processing payments",
    }),
    defineField({
      name: "billingAddress",
      title: "Billing Address",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Full Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "address",
          title: "Street Address",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "state",
          title: "State/Province",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "zip",
          title: "ZIP/Postal Code",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
          validation: (Rule) => Rule.required(),
          initialValue: "US",
        }),
      ],
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Whether this payment method is active and can be used",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Created Date (newest first)",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Default first",
      name: "defaultFirst",
      by: [
        { field: "isDefault", direction: "desc" },
        { field: "createdAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      holderName: "holderName",
      cardType: "cardType",
      last4: "last4",
      isDefault: "isDefault",
      nickname: "nickname",
    },
    prepare(select) {
      const { holderName, cardType, last4, isDefault, nickname } = select;
      const cardDisplay = `${cardType?.toUpperCase() || "CARD"} •••• ${last4}`;
      const title =
        nickname || `${holderName}'s ${cardType?.toUpperCase() || "Card"}`;
      const subtitle = `${cardDisplay}${isDefault ? " (Default)" : ""}`;

      return {
        title,
        subtitle,
        media: CreditCardIcon,
      };
    },
  },
});
