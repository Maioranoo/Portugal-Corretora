export function buildLeadMessage(args: {
  nome: string;
  cidade?: string;
  productName: string;
  detalhes: string[];
}): string {
  const origem = args.cidade ? `, de ${args.cidade}` : '';
  const extra = args.detalhes.length ? ` (${args.detalhes.join(', ')})` : '';
  return `Olá! Sou ${args.nome}${origem}. Vim pelo site e quero falar sobre ${args.productName}${extra}.`;
}

export function buildGenericMessage(productName?: string): string {
  return productName
    ? `Olá! Vim pelo site da Portugal Corretora e quero falar sobre ${productName}.`
    : 'Olá! Vim pelo site da Portugal Corretora e gostaria de atendimento.';
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
