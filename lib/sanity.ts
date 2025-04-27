import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'   
export const client = createClient({
    projectId: 'vuzl9arg',
    dataset: 'production',
    apiVersion: 'v2022-03-07',
    token: "skkSnKk3HT1v5QjMJNmpBHPkbg4khR1y3xDCH0OLxgEV3PdgpXm7LzqiDozc8DR4zuGsShahoMbfjqGVkuu0J3Xb09NGWvPUR7n0r5k2ebPHZuSx2crht0DBniFvNh2l98AfEKFbxTT5NQomMI8s6zPrLL1ZPtpjpnUFCWxqYKueH6Urd6fk",
    useCdn: true
    })

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}