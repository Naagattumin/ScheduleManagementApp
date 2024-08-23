import axios from 'axios';
import { useEffect, useState } from 'react';
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
    let tomorrow = today.setDate(today.getDate() + 1);
    let year = String(tomorrow.getFullYear());
    let month = String("0"+(tomorrow.getMonth() + 1)).slice(-2);
    let date = String("0"+tomorrow.getDate()).slice(-2);
    return year + month + date
}


export default function Tomorrow({ tomorrowItems }) {
    // ダミーデータ
    tomorrowItems = [{
        id: "1724236965191",
        exec_date: "20240811",
        priority: 5,
        contents: "TodoAppの実装",
        progress: 4,
    }, {
        id: "1724236965193",
        exec_date: "20240811",
        priority: 4,
        contents: "選択",
        progress: 3,
    }, {
        id: "1724236965192",
        exec_date: "20240811",
        priority: 1,
        contents: "掃除",
        progress: 1,
    }];




    const [tasks, setTasks] = useState(tomorrowItems);//////////とりあえずダミーデータをtasksに入れてる



    const OnchangeText = (index, newContents) => {
        console.log("🐾OnchangeText", index);///////
        let newTmpTasks = tasks.concat();
        newTmpTasks[index].contents = newContents;
        setTasks(newTmpTasks);
    }



    const handlePriorityClick = (index, addPriority) => {
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

    function handleDeleteClick(index) {
        let nextTasks = tasks.concat();
        nextTasks.splice(index, 1);
        setTasks(nextTasks);
    }
 

    // タスクの追加ボタンで発火。
    const handleAddClick = () => {
        // 多分、ただのシャローコーピー
        let newTask = tasks.concat();

        // null回避のための初期化用タスク
        let addedTask = {
            id: Date.now(),
            exec_date: "",
            priority: 0,
            contents: "",
            progress: 0,
        }
        newTask.push(addedTask);

        setTasks(newTask);
    }

    // タスクの更新ボタンで発火。
    const handleUpdateClick = () => {
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
        <div style={{ textAlign: "center"}}>
            <h2>明日のタスク５</h2>
            <button onClick={ handleAddClick }>タスクの追加</button>
            {/* tasksを回してるからtasksの要素が増えるとたTaskLineの行が増える */}
            {tasks.map((task, index) => (
                 <div>
                    <button onClick={() => { handleDeleteClick(index) }}>削除</button>

                    {/* タスク名を入力するテキストボックス */}
                    <input style={{ textAlign: "center" }} value={task.contents} onChange={(e) => { OnchangeText(index, e.target.value) }} />

                    {/* 優先度を変更するボタンたち */}
                    <button style={{ textAlign: "center" }} onClick={() => { handlePriorityClick(index, -1) }}>-</button>
                    {task.priority}
                    <button style={{ textAlign: "center" }} onClick={() => { handlePriorityClick(index, +1) }}>+</button>
                </div>
            ))}
            <button onClick={ handleUpdateClick }>更新</button>
        </div>
    );////////////////
}
