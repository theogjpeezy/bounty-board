import Head from "next/head";
import { useState } from "react";
import { ITask } from "../task";

export async function getStaticProps() {
  return {
    props: {
      task: {
          title: 'Task 1',
          time: 2,
          notes: 'Notes',
          completed: false
        }
    }
  }
}

export default function Edit({task}: {task: ITask}) {
  const [title, setTitle] = useState<string|undefined>(task.title);
  const [time, setTime] = useState<string|undefined>(task.time.toString());
  const [notes, setNotes] = useState<string|undefined>(task.notes);
    
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('saved');
  }

  return (
    <div>
      <Head>
          <title>Edit Task - {task.title}</title>
      </Head>
      <div className="container">
        <h1>Edit Task - {task.title}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titleInput">Title:</label>
            <input type="text" className="form-control" id="titleInput" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="timeInput">Time:</label>
            <input type="number" className="form-control" id="timeInput" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="notesInput">Notes:</label>
            <input type="text" className="form-control" id="notesInput" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  )
}
