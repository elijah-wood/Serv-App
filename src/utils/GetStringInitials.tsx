export const getInitials = (word: string): string => {
    const bits = word.trim().split(' ')
    return bits
      .map((bit) => bit.charAt(0))
      .join('')
      .toUpperCase()
  }