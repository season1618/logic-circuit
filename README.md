# logic circuit 論理回路シミュレータ

ブラウザ上で論理回路と真理値表を作成する。
https://season1618.github.io/logic-circuit/
https://github.com/season1618/logic-circuit/blob/6733ecd3e0813ebf2549955ebfc32265b8f4e179/public/favicon.png

## 操作

- 論理素子にはNOT, AND, ORのみを用いる。
- 論理回路と真理値表は同期し、一方を変更すると他方も自動的に変換される。

- 論理回路
    + 平行移動: ドラッグ
    + 拡大縮小: ホイール
    + 論理ゲートの移動: ドラッグ
    + 論理ゲートの追加: ダブルクリックしてホイールで選択
    + 論理ゲートの削除: ダブルクリック
    + 配線: 入力側の論理ゲートの右端を押してドラッグ。線分は2回直角に曲がる

- 真理値表
    + 入力/出力の追加/削除: クリック
    + 出力のビット反転: クリック

- ボタン
    + align: 論理回路の整列。各要素のy座標の位置関係を保つ

    + DNF, disjunctive normal form: 選言標準形
    + CNF, conjunctive normal form: 連言標準形
    + minimize: Quine-McCluskey法による論理回路の簡単化。出力が一個のときのみ。

    + .png: 論理回路のpng画像をエクスポート