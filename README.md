# 当時の仕様
- 日付に対応するデータの取得 / get --- localhost8000/get_task_data

    入力 : stringの日付

    "20240811"


     出力 : 日付に対応するデータテーブル
    ```
    [{ id: "20240811-01",
        priority: 5,
        contents: "TodoAppの実装",
        progress: 4,

    }, {
        id: "20240811-02",
        priority: 4,
        contents: "選択",
        progress: 3,
    }, {
        id: "20240811-03",
        priority: 1,
        contents: "掃除",
        progress: 1,
    }]
    ```
- Today達成度の変更後のデータ更新 / post --- localhost8000/post_achievement

    入力 : 達成度が変更されたデータ
    ```
    {
        id: "20240811-03",
        priority: 1,
        contents: "掃除",
        progress: 4,

    }
    ```
    出力 : なし

- Tomorrow完了時のデータの送信 / post --- localhost8000/post_tomorrow_task

    入力 : 完了が押されるまでに追加されたデータ
    ```
    {
        id: "20240811-04",
        priority: 3,
        contents: "食事",
        progress: 3,

    }
    ```
    出力 : なし

- Tomorrow削除時のデータの送信 / post --- localhost8000/post_deleted_task

    入力 : 削除されるデータ
    ```
    {
      id: "20240811-02",
      priority: 4,
      contents: "選択",
      progress: 3,

    }
    ```

    出力 : なし

# 変更
## 240821
idをjsのepochミリ秒に変更
## 2408
- table に要素 exec_date を追加。今日のタスクはこれで探す
- jsのエポックミリ秒や、pythonのエポック秒を epoch_to_datetime で exec_date に変換して日時の管理をする
- デバグのためにとりあえず今日のタスクに明日のタスクを出してる


# Todo
- post → get したときにpostした内容がgetできないことがある気がする。usestateのsetが非同期で遅いだけ？整合性の確認をとりあえずは諦める？
- 今日のタスクを優先度でソートして表示。バックエンドでソートして返す
- 今日のタスクの進捗の変更で更新
- ？　午前4時になったら自動更新
- 明日のタスクの更新のタイミングを増やす
    - 更新ボタンは削除
    - タスクの追加でエポックミリ秒のIDだけのtaskをpost
    - 削除でdelete
    - onBlurでcontentsを更新
    - 優先度変更でpriorityを更新
- 日時の管理多分バグってる
- アコーディオン
- グラフ
- 🐈️🦁


