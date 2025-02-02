import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'   
export const client = createClient({
    projectId: 'vuzl9arg',
    dataset: 'production',
    apiVersion: 'v2022-03-07',
    token: "skyFb73CDmxbU086OtKAxfsYSHOOdoi7VQ7SPp5m1YosJqU74A1KXFdr271y8iczhqCXsDD84DxRSKvrSInF2D7VQ6BDF0WFhfrrB6vTbiAV5BHAu767CaHd8u227nNZoCPq9yzgoWzcaShq5htIdYHpPgqFGp8F9I7X5mN8dMo4nQK8j1to",
    useCdn: false
    })

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}