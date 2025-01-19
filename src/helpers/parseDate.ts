export const formatDate = (date: string) => {
  const parse = date.split('-')
  return `${parse[2]}.${parse[1]}.${parse[0]}`
}
