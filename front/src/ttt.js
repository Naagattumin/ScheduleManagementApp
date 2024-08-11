// ttt.js

import axios from 'axios';
import {useState} from 'react';


export function TaskLine({task, index, changePriority, changeTaskTextBox}) {
    
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


export function TaskTextBox({index, value, changeTaskTextBox}) {
    return (
        <input value={value} onChange={(e) => {changeTaskTextBox(index, e.target.value)}}/>
    )
}

export function Priority({index, value, changePriority}) {
    return(<>
        <button onClick={() => {changePriority(index, -1)}}>-</button>
        {value}
        <button onClick={() => {changePriority(index, +1)}}>+</button>
    </>);
}

export function Tomorrow({tomorrowItems}) {
    tomorrowItems = [{
        id: "20240811-01",
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
      }];
    const [tasks, setTasks] = useState(tomorrowItems);
    const handleButtonPush = () => {
        // タスクのポスト
        // axios.post();
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
        today.setDate( today.getDate() + 1 );
        let year = String(today.getFullYear());
        let month = String(today.getMonth());
        let date = String(today.getDate());
        const baseID = year+month+date+"-";
        let newTask = tasks.concat();
        let addedTask = {
            id: "0",
            priority: 0,
            contents: "",
            progress: 0,
        }
        newTask.push(addedTask);
        for (let i = 0; i < newTask.length; i++) {
            newTask[i].id = baseID+('00'+(i+1)).slice(-2);
        }
        setTasks(newTask);
    }
    return (<>
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
    </>)
}


export default Tomorrow;