import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'loyaltyTransaction',
  title: 'Loyalty Transaction',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Transaction Type',
      type: 'string',
      options: {
        list: [
          { title: 'Earned', value: 'earned' },
          { title: 'Redeemed', value: 'redeemed' },
          { title: 'Expired', value: 'expired' },
          { title: 'Bonus', value: 'bonus' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      description: 'Associated order ID (if applicable)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'When these points expire (for earned points)',
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        defineField({
          name: 'orderTotal',
          title: 'Order Total',
          type: 'number',
        }),
        defineField({
          name: 'eventType',
          title: 'Event Type',
          type: 'string',
        }),
        defineField({
          name: 'previousTier',
          title: 'Previous Tier',
          type: 'string',
        }),
        defineField({
          name: 'newTier',
          title: 'New Tier',
          type: 'string',
        }),
        defineField({
          name: 'remainingPoints',
          title: 'Remaining Points',
          type: 'number',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'description',
      subtitle: 'userId',
      points: 'points',
      type: 'type',
    },
    prepare(selection) {
      const { title, subtitle, points, type } = selection;
      return {
        title: title,
        subtitle: `${subtitle} • ${points > 0 ? '+' : ''}${points} points (${type})`,
      };
    },
  },
});