import axios from 'axios';
import { useEffect, useState } from 'react';
import { prefixApi } from "./Connector";


export function TaskLine({ task, index, changePriority, changeTaskTextBox }) {

    return (<div className='TaskLine'>
        <TaskTextBox
            className="taskTextBox"
            value={task.contents}
            changeTaskTextBox={changeTaskTextBox}
            index={index}
        />
        <Priority
            className="taskPriority"
            value={task.priority}
            changePriority={changePriority}
            index={index}
        />
    </div>)
}


export function TaskTextBox({ index, value, changeTaskTextBox }) {
    return (
        <input value={value} onChange={(e) => { changeTaskTextBox(index, e.target.value) }} />
    )
}

export function Priority({ index, value, changePriority }) {
    return (<>
        <button onClick={() => { changePriority(index, -1) }}>-</button>
        {value}
        <button onClick={() => { changePriority(index, +1) }}>+</button>
    </>);
}

export function Tomorrow() {
    const initialItems = [{
        id: "",
        priority: "",
        contents: "",
        progress: "",
        sortId: ""
    }
    ];
    const [tasks, setTasks] = useState(initialItems);
    useEffect(() => {
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        let year = String(tomorrow.getFullYear());
        let month = String("0" + (tomorrow.getMonth() + 1)).slice(-2);
        let date = String(("0" + tomorrow.getDate()).slice(-2));
        const baseID = year + month + date;
        axios.get(`${prefixApi}/get_task_data/${baseID}`)
            .then(response => {
                console.log(response)
                if (response.data) {
                    console.log(response.data)
                    setTasks(response.data);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, [])

    const handleButtonPush = () => {
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        let year = String(tomorrow.getFullYear());
        let month = String(tomorrow.getMonth());
        let date = String(tomorrow.getDate());
        let tomorrowString = year + month + date;
        // タスクのポスト
        axios.post(
            `${prefixApi}/post_tomorrow_task`, tasks
        ).then((response) => {
            console.log(response)
        }).catch(error => {
            console.error("There was an error fetching the data!", error);
        });
    }
    const changePriority = (index, addPriority) => {
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
    const changeTaskTextBox = (index, newContents) => {
        let newTasks = tasks.concat();
        newTasks[index].contents = newContents;
        setTasks(newTasks);
    }
    const handleAddTask = () => {
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        let year = String(tomorrow.getFullYear());
        let month = String(tomorrow.getMonth());
        let date = String(tomorrow.getDate());
        const baseID = year + month + date + "-";
        let newTask = tasks.concat();
        let addedTask = {
            id: "0",
            priority: 0,
            contents: "",
            progress: 0,
        }
        newTask.push(addedTask);
        for (let i = 0; i < newTask.length; i++) {
            newTask[i].id = baseID + ('00' + (i + 1)).slice(-2);
        }
        setTasks(newTask);
    }
    return (<>
        <div style={{ textAlign: "center" }}>
            <h2>明日のタスク</h2>
            <button onClick={handleAddTask}>タスクの追加</button>
            {tasks.map((task, index) => {
                return <TaskLine
                    task={task}
                    index={index}
                    changePriority={changePriority}
                    changeTaskTextBox={changeTaskTextBox}
                    key={task.id}
                />
            })}
            <button onClick={handleButtonPush}>完了</button>
        </div>
    </>)
}
export default Tomorrow;
