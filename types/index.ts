export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

export interface Shop {
  _id: string
  name: string
  address: string
  tel?: string
  openTime?: string
  closeTime?: string
}

export interface Masseuse {
  _id: string
  name: string
  telephone?: string
  shop: string
}

export interface Reservation {
  _id: string
  apptDate: string
  user: string
  shop: Shop
  masseuse?: { _id?: string; name: string }
  createdAt: string
}
