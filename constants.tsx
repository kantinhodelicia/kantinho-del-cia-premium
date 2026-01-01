
import { Product, DeliveryZone, Extra } from './types';

export const PIZZAS: Product[] = [
  { id: '1', name: "MARGUERITA", description: "Queijo mussarela, gouda, orégano e molho tomate", prices: { FAMILIAR: 800, MEDIO: 750, PEQ: 500 }, category: 'PIZZAS' },
  { id: '2', name: "4 QUEIJOS", description: "Queijo mussarela, queijo azul, edem e fogo e molho tomate", prices: { FAMILIAR: 950, MEDIO: 850, PEQ: 650 }, category: 'PIZZAS' },
  { id: '3', name: "FIAMBRE", description: "Fiambre, Queijo e molho tomate", prices: { FAMILIAR: 850, MEDIO: 800, PEQ: 600 }, category: 'PIZZAS' },
  { id: '4', name: "FRANGO", description: "Frango, queijo, molho tomate", prices: { FAMILIAR: 850, MEDIO: 850, PEQ: 600 }, category: 'PIZZAS' },
  { id: '5', name: "CHOURIÇO", description: "Chouriço Queijo e molho tomate", prices: { FAMILIAR: 850, MEDIO: 800, PEQ: 550 }, category: 'PIZZAS' },
  { id: '6', name: "BACON", description: "Bacon, queijo, molho tomate", prices: { FAMILIAR: 850, MEDIO: 800, PEQ: 550 }, category: 'PIZZAS' },
  { id: '7', name: "PRESUNTO", description: "Presunto, queijo, molho tomate", prices: { FAMILIAR: 850, MEDIO: 800, PEQ: 550 }, category: 'PIZZAS' },
  { id: '8', name: "LINGUIÇA E TERRA", description: "Linguiça, queijo da terra e molho tomate", prices: { FAMILIAR: 900, MEDIO: 850, PEQ: 600 }, category: 'PIZZAS' },
  { id: '9', name: "CARNE MOIDA", description: "Carne moída, queijo, molho tomate", prices: { FAMILIAR: 900, MEDIO: 850, PEQ: 600 }, category: 'PIZZAS' },
  { id: '10', name: "ATUM", description: "Atum, cebola, queijo, molho tomate", prices: { FAMILIAR: 900, MEDIO: 850, PEQ: 650 }, category: 'PIZZAS' },
  { id: '11', name: "VEGETARIANO", description: "Cebola, tomate, pimentão, cogumelo, queijo, molho tomate", prices: { FAMILIAR: 900, MEDIO: 850, PEQ: 600 }, category: 'PIZZAS' },
  { id: '12', name: "ESPECIAL DA CASA", description: "Bacon, cogumelo, nata, queijo, molho tomate", prices: { FAMILIAR: 900, MEDIO: 850, PEQ: 650 }, category: 'PIZZAS' },
  { id: '13', name: "QUATRO ESTAÇÕES", description: "Cogumelo, Fiambre, Chouriço, atum, queijo e tomate", prices: { FAMILIAR: 1000, MEDIO: 850 }, category: 'PIZZAS' },
  { id: '14', name: "TROPICAL", description: "Frutas da época, queijo, molho tomate", prices: { FAMILIAR: 900, MEDIO: 850, PEQ: 600 }, category: 'PIZZAS' },
  { id: '15', name: "MARISCO", description: "Marisco, queijo, molho tomate", prices: { FAMILIAR: 1200, MEDIO: 1000 }, category: 'PIZZAS' },
  { id: '16', name: "CAMARÃO", description: "Camarão, queijo, molho tomate", prices: { FAMILIAR: 1200, MEDIO: 1000 }, category: 'PIZZAS' },
  { id: '17', name: "MADA", description: "Queijo, tomate, Chouriço, Bacon, Camarão e Ananás", prices: { FAMILIAR: 1500 }, category: 'PIZZAS' },
  { id: '18', name: "CALZONE", description: "Recheio à escolha com queijo e molho tomate", prices: { FAMILIAR: 850 }, category: 'PIZZAS' }
];

export const DRINKS: Product[] = [
  { id: 'd1', name: "ÁGUA", description: "Água mineral", prices: { UN: 100 }, category: 'BEBIDAS' },
  { id: 'd2', name: "COCA-COLA", description: "Refrigerante Coca-Cola", prices: { UN: 300 }, category: 'BEBIDAS' },
  { id: 'd3', name: "FANTA LARANJA", description: "Refrigerante Fanta Laranja", prices: { UN: 150 }, category: 'BEBIDAS' },
  { id: 'd4', name: "CERVEJA", description: "Cerveja local", prices: { UN: 200 }, category: 'BEBIDAS' },
  { id: 'd5', name: "SUMO NATURAL", description: "Sumo natural da casa", prices: { UN: 200 }, category: 'BEBIDAS' },
  { id: 'd6', name: "VINHO TINTO", description: "Vinho tinto da região", prices: { UN: 500 }, category: 'BEBIDAS' }
];

export const ZONES: DeliveryZone[] = [
  { id: 'z1', name: "Terra Branca", price: 50, time: "15-25 min" },
  { id: 'z2', name: "Tira Chapéu", price: 100, time: "15-25 min" },
  { id: 'z3', name: "Bela Vista", price: 150, time: "20-30 min" },
  { id: 'z4', name: "Zona Quelém", price: 150, time: "20-30 min" },
  { id: 'z5', name: "Fundo Cobom", price: 150, time: "20-30 min" },
  { id: 'z6', name: "Várzea", price: 150, time: "20-30 min" },
  { id: 'z7', name: "Achadinha", price: 200, time: "25-35 min" },
  { id: 'z8', name: "Alto Glória", price: 200, time: "25-35 min" },
  { id: 'z9', name: "Achada Santo António", price: 200, time: "25-35 min" },
  { id: 'z10', name: "Bairro Craveiro Lopes", price: 200, time: "25-35 min" },
  { id: 'z11', name: "Cidadela", price: 200, time: "25-35 min" },
  { id: 'z12', name: "Fazenda", price: 200, time: "25-35 min" },
  { id: 'z13', name: "Quebra Canela", price: 200, time: "25-35 min" },
  { id: 'z14', name: "Monte Vermelho", price: 200, time: "25-35 min" },
  { id: 'z15', name: "Palmarejo Grande", price: 200, time: "25-35 min" },
  { id: 'z16', name: "Praia Negra", price: 200, time: "25-35 min" },
  { id: 'z17', name: "Plateau", price: 200, time: "25-35 min" },
  { id: 'z18', name: "Prainha", price: 200, time: "25-35 min" },
  { id: 'z19', name: "Achadinha Pires", price: 250, time: "30-40 min" },
  { id: 'z20', name: "Campus Unicv", price: 250, time: "30-40 min" },
  { id: 'z21', name: "Cova Minhoto", price: 250, time: "30-40 min" },
  { id: 'z22', name: "Calabaceira", price: 250, time: "30-40 min" },
  { id: 'z23', name: "Coqueiro", price: 250, time: "30-40 min" },
  { id: 'z24', name: "Castelão", price: 250, time: "30-40 min" },
  { id: 'z25', name: "Lém Ferreira", price: 200, time: "25-35 min" },
  { id: 'z26', name: "Ponta Água", price: 250, time: "30-40 min" },
  { id: 'z27', name: "Pensamento", price: 250, time: "30-40 min" },
  { id: 'z28', name: "Palmarejo", price: 250, time: "30-40 min" },
  { id: 'z29', name: "Safende", price: 250, time: "30-40 min" },
  { id: 'z30', name: "Vila Nova", price: 250, time: "30-40 min" },
  { id: 'z31', name: "Achada São Filipe", price: 300, time: "35-45 min" },
  { id: 'z32', name: "Achada Grande Frente", price: 300, time: "35-45 min" },
  { id: 'z33', name: "Achada Grande Trás", price: 300, time: "35-45 min" },
  { id: 'z34', name: "Achada Eugênio Lima", price: 300, time: "35-45 min" },
  { id: 'z35', name: "Achada Mato", price: 300, time: "35-45 min" },
  { id: 'z36', name: "São Pedro Latada", price: 300, time: "35-45 min" }
];

export const EXTRAS: Extra[] = [
  { name: "Queijo Extra", price: 100 },
  { name: "Bacon Extra", price: 150 },
  { name: "Ananás", price: 100 },
  { name: "Cogumelo", price: 100 },
  { name: "Nata", price: 70 },
  { name: "Camarão", price: 300 },
  { name: "Ovo", price: 50 }
];

export const ADMOB_CONFIG = {
  app_id: "ca-app-pub-9115437935848433~8216324292",
  banner_id: "ca-app-pub-9115437935848433/7909218446"
};
