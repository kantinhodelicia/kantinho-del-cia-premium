-- Seeding Database for Kantinho Delícia
USE kantinho_db;

-- Categories
INSERT IGNORE INTO categories (id, name) VALUES ('PIZZAS', 'PIZZAS');
INSERT IGNORE INTO categories (id, name) VALUES ('BEBIDAS', 'BEBIDAS');

-- Pizzas
INSERT IGNORE INTO products (id, name, description, prices, category_id, is_active) VALUES 
('1', 'MARGUERITA', 'Queijo mussarela, gouda, orégano e molho tomate', '{"FAMILIAR": 800, "MEDIO": 750, "PEQ": 500}', 'PIZZAS', 1),
('2', '4 QUEIJOS', 'Queijo mussarela, queijo azul, edem e fogo e molho tomate', '{"FAMILIAR": 950, "MEDIO": 850, "PEQ": 650}', 'PIZZAS', 1),
('3', 'FIAMBRE', 'Fiambre, Queijo e molho tomate', '{"FAMILIAR": 850, "MEDIO": 800, "PEQ": 600}', 'PIZZAS', 1),
('4', 'FRANGO', 'Frango, queijo, molho tomate', '{"FAMILIAR": 850, "MEDIO": 850, "PEQ": 600}', 'PIZZAS', 1),
('5', 'CHOURIÇO', 'Chouriço Queijo e molho tomate', '{"FAMILIAR": 850, "MEDIO": 800, "PEQ": 550}', 'PIZZAS', 1),
('6', 'BACON', 'Bacon, queijo, molho tomate', '{"FAMILIAR": 850, "MEDIO": 800, "PEQ": 550}', 'PIZZAS', 1),
('7', 'PRESUNTO', 'Presunto, queijo, molho tomate', '{"FAMILIAR": 850, "MEDIO": 800, "PEQ": 550}', 'PIZZAS', 1),
('8', 'LINGUIÇA E TERRA', 'Linguiça, queijo da terra e molho tomate', '{"FAMILIAR": 900, "MEDIO": 850, "PEQ": 600}', 'PIZZAS', 1),
('9', 'CARNE MOIDA', 'Carne moída, queijo, molho tomate', '{"FAMILIAR": 900, "MEDIO": 850, "PEQ": 600}', 'PIZZAS', 1),
('10', 'ATUM', 'Atum, cebola, queijo, molho tomate', '{"FAMILIAR": 900, "MEDIO": 850, "PEQ": 650}', 'PIZZAS', 1),
('11', 'VEGETARIANO', 'Cebola, tomate, pimentão, cogumelo, queijo, molho tomate', '{"FAMILIAR": 900, "MEDIO": 850, "PEQ": 600}', 'PIZZAS', 1),
('12', 'ESPECIAL DA CASA', 'Bacon, cogumelo, nata, queijo, molho tomate', '{"FAMILIAR": 900, "MEDIO": 850, "PEQ": 650}', 'PIZZAS', 1),
('13', 'QUATRO ESTAÇÕES', 'Cogumelo, Fiambre, Chouriço, atum, queijo e tomate', '{"FAMILIAR": 1000, "MEDIO": 850}', 'PIZZAS', 1),
('14', 'TROPICAL', 'Frutas da época, queijo, molho tomate', '{"FAMILIAR": 900, "MEDIO": 850, "PEQ": 600}', 'PIZZAS', 1),
('15', 'MARISCO', 'Marisco, queijo, molho tomate', '{"FAMILIAR": 1200, "MEDIO": 1000}', 'PIZZAS', 1),
('16', 'CAMARÃO', 'Camarão, queijo, molho tomate', '{"FAMILIAR": 1200, "MEDIO": 1000}', 'PIZZAS', 1),
('17', 'MADA', 'Queijo, tomate, Chouriço, Bacon, Camarão e Ananás', '{"FAMILIAR": 1500}', 'PIZZAS', 1),
('18', 'CALZONE', 'Recheio à escolha com queijo e molho tomate', '{"FAMILIAR": 850}', 'PIZZAS', 1);

-- Drinks
INSERT IGNORE INTO products (id, name, description, prices, category_id, is_active) VALUES 
('d1', 'ÁGUA', 'Água mineral', '{"UN": 100}', 'BEBIDAS', 1),
('d2', 'COCA-COLA', 'Refrigerante Coca-Cola', '{"UN": 300}', 'BEBIDAS', 1),
('d3', 'FANTA LARANJA', 'Refrigerante Fanta Laranja', '{"UN": 150}', 'BEBIDAS', 1),
('d4', 'CERVEJA', 'Cerveja local', '{"UN": 200}', 'BEBIDAS', 1),
('d5', 'SUMO NATURAL', 'Sumo natural da casa', '{"UN": 200}', 'BEBIDAS', 1),
('d6', 'VINHO TINTO', 'Vinho tinto da região', '{"UN": 500}', 'BEBIDAS', 1);

-- Delivery Zones
INSERT IGNORE INTO delivery_zones (id, name, price, estimated_time) VALUES 
('z1', 'Terra Branca', 50, '15-25 min'),
('z2', 'Tira Chapéu', 100, '15-25 min'),
('z3', 'Bela Vista', 150, '20-30 min'),
('z4', 'Zona Quelém', 150, '20-30 min'),
('z5', 'Fundo Cobom', 150, '20-30 min'),
('z6', 'Várzea', 150, '20-30 min'),
('z7', 'Achadinha', 200, '25-35 min'),
('z8', 'Alto Glória', 200, '25-35 min'),
('z9', 'Achada Santo António', 200, '25-35 min'),
('z10', 'Bairro Craveiro Lopes', 200, '25-35 min'),
('z11', 'Cidadela', 200, '25-35 min'),
('z12', 'Fazenda', 200, '25-35 min'),
('z13', 'Quebra Canela', 200, '25-35 min'),
('z14', 'Monte Vermelho', 200, '25-35 min'),
('z15', 'Palmarejo Grande', 200, '25-35 min'),
('z16', 'Praia Negra', 200, '25-35 min'),
('z17', 'Plateau', 200, '25-35 min'),
('z18', 'Prainha', 200, '25-35 min'),
('z19', 'Achadinha Pires', 250, '30-40 min'),
('z20', 'Campus Unicv', 250, '30-40 min'),
('z21', 'Cova Minhoto', 250, '30-40 min'),
('z22', 'Calabaceira', 250, '30-40 min'),
('z23', 'Coqueiro', 250, '30-40 min'),
('z24', 'Castelão', 250, '30-40 min'),
('z25', 'Lém Ferreira', 200, '25-35 min'),
('z26', 'Ponta Água', 250, '30-40 min'),
('z27', 'Pensamento', 250, '30-40 min'),
('z28', 'Palmarejo', 250, '30-40 min'),
('z29', 'Safende', 250, '30-40 min'),
('z30', 'Vila Nova', 250, '30-40 min'),
('z31', 'Achada São Filipe', 300, '35-45 min'),
('z32', 'Achada Grande Frente', 300, '35-45 min'),
('z33', 'Achada Grande Trás', 300, '35-45 min'),
('z34', 'Achada Eugênio Lima', 300, '35-45 min'),
('z35', 'Achada Mato', 300, '35-45 min'),
('z36', 'São Pedro Latada', 300, '35-45 min');
