
export interface HashComparerParams {
  password: string
  hashedPassword: string
}

export interface HashComparer {
  compare: (data: HashComparerParams) => Promise<boolean>
}
