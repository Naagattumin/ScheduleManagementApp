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


    const [tasks, setTasks] = useState();

    const [text, setText] = useState("");

    const [loading, setLoading] = useState(true);
    let isLoading = true;
    function PostAndGetTasks(tasks, setTasks) {
        axios.post(`${prefixApi}/post_tomorrow_task/`, tasks)
            .then(response => {
                console.log("🐾PostTasks_then🐾", response.data);
            })
            .catch(error => {
                console.error("🐾!!!PostTasks_catch🐾", error);
            })
            .then(() => {
                axios.get(`${prefixApi}/get_task_data/${Date.now()}`)
                    .then(response => {
                        console.log("🐾GetTasks_then🐾", response.data);//////////
                        setLoading(true);
                        setTasks(response.data);
                    })
                    .catch(error => {
                        console.error("🐾!!!GetTasks_catch🐾", error);
                    });
            });
    }




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

    function Delete_Task(task) {
        console.log("🐾DeleteTasks_start🐾");//////////////

        return axios.post(`${prefixApi}/post_deleted_task`, task)
            .then(response => {
                console.log("🐾DeleteTasks_then🐾", response.data);
            })
            .catch(error => {
                console.error("🐾!!!DeleteTasks_catch🐾", error);
            });
    }


    const OnchangeText = (index, newContents) => {
        let newTasks = tasks.concat();
        newTasks[index].contents = newContents;
        isLoading = true;
        setTasks(newTasks);


        // let newTasks = tasks.concat();
        // newTasks[index].contents = newContents;
        // setText(newTasks);


        // let newTmpTtext = text;
        // newTmpTtext = newContents;
        // setText(newTmpTtext);
    }

    function OnBlurText(index, newText) {
        PostTasks(tasks).then(() => {
            GetTodayTasks().then((response) => {
                isLoading = true;
                setTasks(response);
            })
        })
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
        // setTasks(newTasks);
        PostAndGetTasks(newTasks, setTasks);

    }

    function handleDeleteClick(index) {

        Delete_Task(tasks[index]).then(() => {
            GetTodayTasks().then((response) => {
                isLoading = true;
                setTasks(response);
            })
        })



        // setTasks(nextTasks);
        

        // Delete_Task(tasks[index]);
    }


    // タスクの追加ボタンで発火。
    const handleAddClick = () => {
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
    ////////////デバグのため今日のタスクを取得している
    async function handleUpdateClick() {
        console.log("🐾handleUpdateClick_start🐾", tasks);

        PostTasks(tasks).then(() => {
            GetTodayTasks().then((response) => {
                isLoading = true;
                setTasks(response);
            })
        })

        // PostAndGetTasks(tasks, setTasks);

        // PostTasks(tasks).then(() => {
        //     (async () => {
        //         //const tmp = await GetTomorrowTasks();//////////デバグのために GetTodayTasks にしてる
        //         const tmp = await GetTodayTasks();
        //         console.log("🐾handleUpdateClick_then🐾", tmp);//////////
        //         setTasks(tmp);
        //     })();
        // })

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
            isLoading = true;
            setTasks(await GetTodayTasks());
        })();
    }, []);


    useEffect(() => {
        console.log("🐾useEffect[tasks]🐾", tasks);//////////
        if (tasks === undefined) {
            console.log("🐾tasks is undefined🐾");//////////
            return;
        }
        // setLoading(true);
        // PostTasks(tasks).then(() => {
        //     setLoading(false);
        // });
        setLoading(false);
        isLoading = false;
    }, [tasks]);

    if (loading) {
        console.log("🐾Loading🐾");//////////////////
        return <h1>Loading...</h1>;
    }



    function handleDbgClick() {
        axios.get(`${prefixApi}/get_dbg_task_data/`)
            .then(response => {
                console.log("🐾get_dbg_task_data_then🐾", response.data);//////////
            })
            .catch(error => {
                console.error("🐾!!!get_dbg_task_data_catch🐾", error);
            });
        console.log("🐾tasks🐾", tasks);
    }


    return (
        <div style={{ textAlign: "center" }}>
            <h2>明日のタスク6</h2>
            <button onClick={handleDbgClick}>dbg</button>
            <button onClick={handleAddClick}>タスクの追加</button>

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
                        onBlur={(e) => { OnBlurText(index, e.target.value) }}
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

                    id: {task.id}, exec_date: {task.exec_date}, priority: {task.priority}, progress: {task.progress}
                </div>
            ))}
            <button onClick={handleUpdateClick}>更新</button>
        </div>
    );////////////////
}
