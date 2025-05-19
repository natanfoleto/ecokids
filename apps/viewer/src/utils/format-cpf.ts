export function formatCPF(value: string) {
  // Remove tudo que não for dígito
  const cpf = value.replace(/\D/g, '')

  // Aplica a máscara conforme o número de dígitos
  if (cpf.length <= 3) {
    return cpf
  } else if (cpf.length <= 6) {
    return cpf.replace(/(\d{3})(\d+)/, '$1.$2')
  } else if (cpf.length <= 9) {
    return cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  } else {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4')
  }
}
