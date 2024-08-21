import axios from 'axios';
import { useState } from 'react';
import { prefixApi } from "./Connector";


function GetToday() {
    let today = new Date();
    today.setDate(today.getDate());
    let year = String(today.getFullYear());
    let month = String("0"+(today.getMonth() + 1)).slice(-2);
    let date = String("0"+today.getDate()).slice(-2);
    return year + month + date
}

function GetTommorow() {
    let today = new Date();
    // ここからtodayというよりtomorrow
    today.setDate(today.getDate() + 1);
    let year = String(today.getFullYear());
    let month = String("0"+(today.getMonth() + 1)).slice(-2);
    let date = String("0"+today.getDate()).slice(-2);
    return year + month + date
}


export default function Tomorrow({ tomorrowItems }) {
    // ダミーデータ
    tomorrowItems = [{
        id: "1724236965191",
        exec_date: "2024-08-11",
        priority: 5,
        contents: "TodoAppの実装",
        progress: 4,
    }, {
        id: "1724236965193",
        exec_date: "2024-08-11",
        priority: 4,
        contents: "選択",
        progress: 3,
    }, {
        id: "1724236965192",
        exec_date: "2024-08-11",
        priority: 1,
        contents: "掃除",
        progress: 1,
    }];


    const [tasks, setTasks] = useState(tomorrowItems);//////////とりあえずダミーデータをtasksに入れてる


    const OnchangeTaskTextBox = (index, newContents) => {
        let newTasks = tasks.concat();
        newTasks[index].contents = newContents;
        setTasks(newTasks);
    }

    // タスク名を入力するテキストボックス。
    function TaskTextBox({ index, value, OnchangeTaskTextBox }) {
        // ここでいう event は、テキストボックス（<input> 要素）で発生したイベントを表すオブジェクトです。event.target はイベントが発生した要素、つまりこの場合は <input> 要素を指します。そして、event.target.value はその <input> 要素の現在の値（ユーザーが入力した内容）を取得します。
        return (
            <input style={{ textAlign: "center" }} value={value} onChange={(event) => { OnchangeTaskTextBox(index, event.target.value) }} />
        )
    }

    const OnchangePriority = (index, addPriority) => {
        let newTasks = tasks.concat();
        if (newTasks[index].priority + addPriority > 5) {
            return;
        }
        if (newTasks[index].priority + addPriority < 0) {
            return;
        }
        newTasks[index].priority += addPriority;
        setTasks(newTasks);
    }

    // 優先度を変更するボタンたち。
    function Priority({ index, value, OnchangePriority }) {
        return (
            <>
                <button style={{ textAlign: "center" }} onClick={() => { OnchangePriority(index, -1) }}>-</button>
                {value}
                <button style={{ textAlign: "center" }} onClick={() => { OnchangePriority(index, +1) }}>+</button>
            </>
        );
    }

    function OnDeleteTask(index) {
        let nextTasks = tasks.concat();
        nextTasks.splice(index, 1);
        setTasks(nextTasks);
    }

    // tasksの要素の行。
    function TaskLine({ task, index, changePriority, changeTaskTextBox }) {
        return (
            <div className='TaskLine'>
                <button onClick={() => { OnDeleteTask(index) }}>削除</button>
                {/* タスク名を入力するテキストボックス */}
                <TaskTextBox
                    className="taskTextBox"
                    value={task.contents}
                    changeTaskTextBox={OnchangeTaskTextBox}
                    index={index}
                />
                {/* 優先度を変更するボタンたち */}
                <Priority
                    className="taskPriority"
                    value={task.priority}
                    changePriority={OnchangePriority}
                    index={index}
                />
            </div>
        )
    }

    // タスクの追加ボタンで発火。tasksにidだけのを追加する。
    const handleAddTask = () => {
        // 多分、ただのシャローコーピー
        let newTask = tasks.concat();

        // null回避のための初期化用タスク
        let addedTask = {
            id: Date.now(),
            priority: 0,
            contents: "",
            progress: 0,
        }
        newTask.push(addedTask);

        setTasks(newTask);
    }

    // タスクの完了ボタンで発火。
    const handleButtonPush = () => {
        // タスクのポスト
        // axios.post();
        console.log("🐾handleButtonPush🐾", tasks);///////////
        //console.log(tasks);///////////

        axios.post(`${prefixApi}/post_tomorrow_task/`, tasks)
        .then(response => {
            console.log(response)
            if (response.data) {
                console.log(response.data);
            }
        })
        .catch(error => {
            console.error("🐾There was an error post_tomorrow_task!", error);
        });
    }

    return (
        <div style={{ textAlign: "center" }}>
            <h2>明日のタスク3</h2>
            <button onClick={handleAddTask}>タスクの追加</button>
            {/* tasksを回してるからtasksの要素が増えるとたTaskLineの行が増える */}
            {tasks.map((task, index) => {
                return <TaskLine
                    task={task}
                    index={index}
                    changePriority={OnchangePriority}
                    changeTaskTextBox={OnchangeTaskTextBox}
                    key={task.id}
                />
            })}
            <button onClick={handleButtonPush}>完了</button>
        </div>
    );////////////////
}