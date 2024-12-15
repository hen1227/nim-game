# Chocolate Game!

Be the last person to eat a chocolate and win!

Try it out at: https://nim.henhen1227.com

Backend Code:
https://github.io/hen1227/nim-game-backend


## The Winning Strategy

The goal of this game is to be the last person to eat a chocolate. 
In other words, you want to be the one to reduce the last row down to zero.

Notice that if you take the `XOR` of all the rows, you can get a numerical value that represents the state of the game.
Once the game over, this `XOR` value will always be zero.
And, if a player ends their turn with an `XOR` value other than zero, then they couldn't have possibly won.

The trick comes from this idea.
If you always make the `XOR` value zero, your opponent will have no choice to modify a bit and result in an `XOR` value
that isn't zero.

The last part of the strategy is to realize that a single move is always enough to make the `XOR` value zero.
Consider the following example:

```
Row1: 1 -> 0 0 0 1
Row2: 5 -> 0 1 0 1
Row3: 3 -> 0 0 1 1
------------------
XOR:       0 1 1 1
```
You can only ever remove chocolate, not add.
So, to deal with the largest 1 in the `XOR` value, we have to modify a row that has a 1 in that position.
In this case, we can see that we need to modify `Row2`.

Now, let's take the XOR of the rows without `Row2`:
```
Row1: 1 -> 0 0 0 1
Row2: skipping
Row3: 3 -> 0 0 1 1
------------------
New XOR:   0 0 1 0
```
To make the total `XOR` value zero, we now know that we need `Row2` to be `0 0 1 0`.
So that means we need to eat `Row2 - New XOR` which in our example is `5 - 2 = 3`.

Since we will only ever be eating from a row with the largest bit in the `XOR` value, we know that the `New XOR`'s 
largest bit will be zero, and therefore the `New XOR` will always be smaller than the original `XOR`. 
Thus, we can always make the `XOR` value zero after the move.

## Game Structure

The state of the game is stored with the following states:
``` typescript
type GameRows = number[];

interface BoardState {
    rows: GameRows;
    playerTurn: number;
}
```
When a player moves, I subtract the corresponding row by that number and switch the player turn.
