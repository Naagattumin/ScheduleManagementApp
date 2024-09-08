import axios from 'axios';
import { useEffect, useState } from 'react';
import { prefixApi } from "./Connector";


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


    function GetTodayTasks() {
        let jsEpoch = Date.now();

        return axios.get(`${prefixApi}/get_task_data/${jsEpoch}`)
        .then(response => {
            console.log("🐾GetTasks_then🐾", response.data);//////////
            return response.data;
        })
        .catch(error => {
            console.error("🐾!!!GetTasks_catch🐾", error);
        });
    }

    function GetTomorrowTasks() {
        console.log("🐾GetTomorrowTasks_start🐾");//////////
        let jsEpoch = Date.now() + 86400000;

        return axios.get(`${prefixApi}/get_task_data/${jsEpoch}`)
        .then(response => {
            console.log("🐾GetTasks_then🐾", response.data);//////////
            return response.data;
        })
        .catch(error => {
            console.error("🐾!!!GetTasks_catch🐾", error);
        });
    }

    function PostTasks(tasks) {
        console.log("🐾PostTasks_start🐾");//////////

        return axios.post(`${prefixApi}/post_tomorrow_task/`, tasks)
        .then(response => {
            console.log("🐾PostTasks_then🐾", response.data);
        })
        .catch(error => {
            console.error("🐾!!!PostTasks_catch🐾", error);
        });
    }


    const OnchangeText = (index, newContents) => {
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

        // IDの重複を避けるための処理
        let epoch = Date.now();

        let flag = true;
        while (flag) {
            flag = false;
            for (let i = 0; i < newTask.length; i++) {
                if (newTask[i].id === epoch) {
                    flag = true;
                    ++epoch;
                    break;
                }
            }
        }

        // null回避のための初期化用タスク
        let addedTask = {
            id: epoch,
            exec_date: "",
            priority: 0,
            contents: "",
            progress: 0,
        }
        newTask.push(addedTask);

        setTasks(newTask);
    }

    // タスクの更新ボタンで発火。
    async function handleUpdateClick () {
        console.log("🐾handleUpdateClick_start🐾", tasks);

        PostTasks(tasks).then(() => {
            (async () => {
                //const tmp = await GetTomorrowTasks();//////////デバグのために GetTodayTasks にしてる
                const tmp = await GetTodayTasks();
                console.log("🐾handleUpdateClick_then🐾", tmp);//////////
                setTasks(tmp);
            })();
        })

        // new Promise((resolve, reject) => {
        //     PostTasks(tasks);
        //     resolve();
        // })
        // .then(() => {
        //     setTasks(await GetTodayTasks());
        //     return;
        // });

        console.log("🐾handleUpdateClick_complete🐾", tasks);//////////
    }

    useEffect(() => {
        (async () => {
            setTasks(await GetTodayTasks());
        })();
        // let epoch = GetTodayEpoch();
        // axios.get(`${prefixApi}/get_task_data/${epoch}`)
        // .then(response => {
        //     console.log("🐾useEffect then1🐾", response);//////////
        //     if(response.data){
        //         console.log("🐾useEffect then2🐾", response.data);//////////
        //         setTasks(response.data);
        //     }
        // })
        // .catch(error => {
        //     console.error("🐾There was an error fetching the data!", error);
        // });

        console.log("🐾useEffect_complete🐾", tasks);//////////
    }, []);

    return (
        <div style={{ textAlign: "center"}}>
            <h2>明日のタスク6</h2>
            <button onClick={ handleAddClick }>タスクの追加</button>

            {/* tasksを回してるからtasksの要素が増えるとたTaskLineの行が増える */}
            {tasks.map((task, index) => (
                 <div>
                    <button 
                        onClick={() => { handleDeleteClick(index) }}
                    >
                        削除
                    </button>

                    {/* タスク名を入力するテキストボックス */}
                    <input 
                        style={{ textAlign: "center" }} 
                        value={task.contents} 
                        onChange={(e) => { OnchangeText(index, e.target.value) }} 
                    />

                    {/* 優先度を変更するボタンたち */}
                    <button 
                        style={{ textAlign: "center" }} 
                        onClick={() => { handlePriorityClick(index, -1) }}
                    >
                        -
                    </button>

                    {task.priority}

                    <button 
                        style={{ textAlign: "center" }} 
                        onClick={() => { handlePriorityClick(index, +1) }}
                    >
                        +
                    </button>
                </div>
            ))}
            <button onClick={ handleUpdateClick }>更新</button>
        </div>
    );////////////////
}
