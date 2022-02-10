# logic circuit

## MIL論理記号

https://ja.wikipedia.org/wiki/MIL%E8%AB%96%E7%90%86%E8%A8%98%E5%8F%B7
http://www.setsunan.ac.jp/~shikama/LogicCircuits2009/2014LCB_8.pdf

## 論理ゲートの整列

論理ゲートの深さ(depth)を
- 入力: 0
- not: 入力となる論理ゲートのdepthの最大値 + 1
- and, or: 入力となる論理ゲートのdepth + 1(not), depth(and, or)の最大値 + 1
と定義する。

同じ深さの論理ゲートを縦一列に等間隔に配置する。隣り合う列も等間隔に並べる。
同じ論理ゲートに入力される配線が交差しないようにする。Nodeのinputをyの昇順にソートする。

## 論理回路のデータ構造

Nodeのinputは入力の配列。yは連続的に変更されるため、Arrayで管理しsortでソート。
CircuitはNodeの配列。depth, yは変更されるため、Arrayで管理しsortでソート。