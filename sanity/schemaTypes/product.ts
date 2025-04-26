// schemas/product.js
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true, // Enables image cropping
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              options: {
                isHighlighted: true,
              },
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'price',
      title: 'Price (₦)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: 'discountPrice',
      title: 'Discount Price (₦)',
      type: 'number',
      description: 'Leave empty if no discount',
      validation: (Rule) => Rule.positive().min(0),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Product Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
        {
          type: 'image',
        },
      ],
    },
    {
      name: 'ingredients',
      title: 'Key Ingredients',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'benefits',
      title: 'Skin Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Average rating (1-5)',
      validation: (Rule) => Rule.min(1).max(5).precision(0.1),
    },
    {
      name: 'isNew',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isBestSeller',
      title: 'Best Seller',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'skinType',
      title: 'Recommended Skin Types',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Dry', value: 'dry' },
          { title: 'Oily', value: 'oily' },
          { title: 'Combination', value: 'combination' },
          { title: 'Sensitive', value: 'sensitive' },
          { title: 'Normal', value: 'normal' },
        ],
        layout: 'dropdown',
      },
    },
    {
      name: 'volume',
      title: 'Volume/Size',
      type: 'string',
      description: 'e.g., 50ml, 100g',
    },
    {
      name: 'howToUse',
      title: 'How To Use',
      type: 'text',
      rows: 3,
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price',
      category: 'category.name',
      isNew: 'isNew',
      isBestSeller: 'isBestSeller',
    },
    prepare(selection) {
      const { title, media, price, category, isNew, isBestSeller } = selection;
      const badges = [];
      if (isNew) badges.push('NEW');
      if (isBestSeller) badges.push('BESTSELLER');

      return {
        title,
        media,
        subtitle: `${category} • ₦${price}${badges.length > 0 ? ` • ${badges.join(' • ')}` : ''}`,
      };
    },
  },
};