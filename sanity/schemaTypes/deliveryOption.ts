export default {
  name: 'deliveryOption',
  title: 'Delivery Option',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Location Name',
      type: 'string',
      description: 'e.g., LAUTECH Campus or Ogbomoso Central',
      validation: Rule => Rule.required()
    },
    {
      name: 'value',
      title: 'Unique Value',
      type: 'string',
      description: 'Used in code to identify this option (e.g., "lautech" or "ogbomoso-central")',
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'price',
      title: 'Delivery Price',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Details about this delivery area'
    },
    {
      name: 'customCityTriggers',
      title: 'Custom City Detection',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'When users type these city names, this delivery option will be selected'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      description: 'description'
    },
    prepare({ title, subtitle, description }) {
      const formattedPrice = Number(subtitle).toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
      })

      return {
        title: `${title} - ${formattedPrice}`,
        subtitle: description
      }
    }
  }
}
