import { Playfair_Display, Poppins } from 'next/font/google'

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})