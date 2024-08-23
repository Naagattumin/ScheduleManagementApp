# ScheduleManagementApp

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
idをepoch秒に変更

# Todo
- 今日のタスクを優先度でソートして表示。バックエンドでソートして返す
- 完了ボタンは更新ボタンにする。
    - 同じものが有ったときはスルー
- 午前4時になったら自動更新
- 