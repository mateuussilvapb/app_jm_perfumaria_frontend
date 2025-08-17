const MB = 1048576;

export const errorMessagesDictionary = {
  required: () => 'Campo obrigatório',
  email: () => 'E-mail inválido',
  mask: () => 'Formato inválido',
  minlength: (value: any) =>
    `Valor do campo é menor que o esperado: ${value.requiredLength} caracteres`,
  maxlength: (value: any) =>
    `Valor excede o tamanho máximo de ${value.requiredLength} caracteres`,
  invalidCpf: () => 'CPF inválido',
  invalidNpu: () => 'Número de processo inválido',
  validDate: () => 'Data inválida',
  pastDate: () => 'A data não pode ser posterior à data atual',
  futureDate: () => 'A data não pode ser anterior à data atual',
  invalidCEP: () => 'CEP inválido',
  minDate: (value) =>
    `A data não pode ser anterior a ${(
      value.min as Date
    ).toLocaleDateString()}`,
  maxDate: (value) =>
    `A data não pode ser posterior a ${(
      value.max as Date
    ).toLocaleDateString()}`,
  invalidFileType: (expectedTypes: string[]) =>
    `Formatos permitidos: ${expectedTypes.join(', ')}`,
  invalidFileSize: (maxSize) =>
    `O arquivo não deve ultrapassar: ${Math.round(maxSize / MB)} MB`,
  dataFuture: () => 'A data deve ser posterior à data atual',
  naoMultiplo: (value: number) => `Deve ser um valor múltiplo de ${value}`,
  qtdDiasDiferentes: () =>
    'A quatidade de dias solicitados difere da quantidade de dias disponíveis',
  diasRestantesSolicitacao: (value) =>
    `Dias restantes na solicitação: ${value}`,
  diasInsuficientesSolicitacao: () => `Dias insuficientes`,
  dataMinimaSolicitacao: (value) =>
    `A data mínima para este período aquisitivo é: ${value}`,
  min: (value) => `O valor mínimo é: ${value}`,
  max: (value) => `O valor máximo é: ${value}`,
  specialCharacters: () => 'Usuário não pode conter espaços ou caracteres especiais',
  lettersAndNumbers: () => 'A senha deve possuir letras e números',
  passwordMismatch: () => 'As senhas não conferem',
};
