export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "")
  const limited = numbers.slice(0, 11)

  if (limited.length <= 3) return limited
  if (limited.length <= 6) return `${limited.slice(0, 3)}.${limited.slice(3)}`
  if (limited.length <= 9) return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`
  return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`
}

export function cleanCPF(value: string): string {
  return value.replace(/\D/g, "")
}

export function isValidCPF(cpf: string): boolean {
  const cleaned = cleanCPF(cpf)
  return cleaned.length === 11
}
