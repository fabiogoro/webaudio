# Psicoacústica: Integração Sequencial
### Autor: Fábio Goródscy
### Para disciplina: CMU5380 - Processamento de Sinais Musicais: Técnicas e Percepção

## Sobre
Baseado no exemplo 17. "Fracasso de trajetórias que se cruzam ao cruzarem perceptualmente" definido por Al Bregman em [Audio demonstrations of auditory scene analysis](http://webpages.mcgill.ca/staff/Group2/abregm1/web/downloadstoc.htm).

Uma fonte de som está descendo e outra subindo, como em um X. Porém, dificilmente os ouvintes conseguem seguir o som de uma única fonte. No momento em que elas obtém a mesma altura, o ouvinte identifica que a que ele estava acompanhando, seja a que começa em baixo ou a que começa em cima se reflete como em um V ou um V invertido. Isso se torna menos forte quando os 2 sons possuem timbres claramente diferentes.

## Experimento
No experimento, temos, assim como Bregman, tons que começam em 400hz e sobem em escala logaritmica até 1600hz, em um total de 7 passos, ou tons. A velocidade com que são tocados pode ser alterada, mas não existe espaço de tempo entre as cada dois tons tocados e sempre terão a mesma duração cada dois tons. No primeiro instante as ondas são senoides, mas há a possibilidade de alterar a forma de onda de uma das sequências de tons tocadas, fazendo com que ela vire uma onda dente de serra.

Link para o experimento: (https://goo.gl/CYU0zn)

## Como Usar
Existem 6 botões e um slider. Descrevendo cada um:
* Tocar inteiro: Uma fonte tocará isolada uma descida, após descer, uma segunda fonte entrará competindo e enquanto uma sobe a outra desce, formando um X.
* Tocar V: Uma única fonte subirá 4 tons e depois voltará a descer, como em um V invertido.
* Tocar Descida: Uma única fonte descerá, tocando os 7 tons.
* Tocar Subida: Uma única fonte subirá, tocando os 7 tons.
* Tocar X: Duas fontes tocaram formando um X. O procedimento se repete 2 vezes.
* Ativar ondas diferentes: Esse botão ativa/desativa uma forma de onda dente de serra para a segunda fonte. 
* Velocidade: Esse slider controla a duração de cada tom, fazendo com que a sequência seja mais rápida ou mais lenta. Quanto mais para a esquerda, menor o tempo de duração de cada tom, portanto, mais rápida e mais curta a sequência.
