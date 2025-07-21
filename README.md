## How to run

- Clone the repository :
```
git clone https://github.com/nicolasb-pearfiction/auxence-medja.git
```

- Navigate to the location of the file :
```
cd auxence-medja
```

- Go into the pixi-project folder
```
cd pixi-project
```

- Install all the dependencies:
```
npm install
```

- Run the code
```
npm run dev
```

## Information about the game

### Reel set:
    - Band 1: ["leaf", "lemon", "lemon", "bar", "bar", "orange", "bar", "bell", "orange", "seven", "leaf", "seven", "cherries", "bell", "orange", "leaf", "cherries", "orange", "lemon", "leaf"]
    - Band 2: ["bar", "apple", "lemon", "apple", "orange", "orange", "cherries", "orange", "orange", "bell", "lemon", "leaf", "orange", "lemon", "bar", "orange", "apple", "cherries", "lemon", "apple"]
    - Band 3: ["orange", "leaf", "lemon", "cherries", "seven", "leaf", "apple", "leaf", "leaf", "orange", "seven", "orange", "bar", "apple", "seven", "leaf", "bell", "bar", "apple", "cherries"]
    - Band 4: ["leaf", "apple", "seven", "apple", "cherries", "cherries", "seven", "apple", "cherries", "bar", "orange", "bar", "apple", "seven", "apple", "lemon", "leaf", "orange", "seven", "apple"]
    - Band 5: ["lemon", "cherries", "leaf", "seven", "bell", "bar", "seven", "leaf", "leaf", "bell", "bell", "leaf", "apple", "bell", "bar", "apple", "bar", "apple", "bell", "cherries"]

The initial position of the reels should be:

    Positions: 0, 0, 0, 0, 0
    Screen:
      leaf  bar orange leaf lemon
      lemon apple leaf apple cherries
      lemon lemon lemon seven leaf

### Payout table:

     Symbol id | 3 of a kind | 4 of a kind | 5 of a kind 
    -----------|-------------|-------------|-------------
        bar    |      10     |      20     |      50
    -----------|-------------|-------------|-------------
        leaf   |      5      |      10     |      20
    -----------|-------------|-------------|-------------
        seven  |      5      |      10     |      15
    -----------|-------------|-------------|-------------
        bell   |      5      |      10     |      15 
    -----------|-------------|-------------|-------------
       orange  |      2      |      5      |      10 
    -----------|-------------|-------------|-------------
       apple   |      1      |      2      |      5 
    -----------|-------------|-------------|-------------
       lemon   |      1      |      2      |      3 
    -----------|-------------|-------------|-------------
      cherries |      1      |      2      |      3 
    -----------|-------------|-------------|-------------

### Paylines table:

     Pay line id | visual description
    -------------|--------------------
                 |      - - - - -
          1      |      x x x x x
                 |      - - - - -
    -------------|--------------------
                 |      x x x x x
          2      |      - - - - -
                 |      - - - - -
    -------------|--------------------
                 |      - - - - -
          3      |      - - - - -
                 |      x x x x x
    -------------|--------------------
                 |      x x - - -
          4      |      - - x - -
                 |      - - - x x
    -------------|--------------------
                 |      - - - x x
          5      |      - - x - -
                 |      x x - - -
    -------------|-------------------- 
                 |      x - - - x
          6      |      - x - x -
                 |      - - x - -
    -------------|-------------------- 
                 |      - - x - -
          7      |      - x - x -
                 |      x - - - x