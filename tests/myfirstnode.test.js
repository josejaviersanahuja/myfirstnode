function palindrome (str) {
  return str.split('').reverse().join('')
}

describe('palidrome', () => {
  test(' de ZITROJJ', () => {
    const result = palindrome('ZITROJJ')

    expect(result).toBe('JJORTIZ')
  })

  test(' de String vacío', () => {
    const result = palindrome('')

    expect(result).toBe('') // expect jestjs.io/docs/en/expect
  })
})
