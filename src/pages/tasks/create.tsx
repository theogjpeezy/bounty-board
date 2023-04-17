import { addTask } from "@/db";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function create() {
  const { push } = useRouter();
  const [title, setTitle] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [description, setDescription] = useState<string>('');
    
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          time: parseInt(time, 10),
          notes,
          description
        })
      });
      push('/');
  }

  return (
    <div>
      <Head>
          <title>Create Task</title>
      </Head>
      <div className="container">
        <h1>Create Task</h1>
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
            <label htmlFor="descriptionInput">Description:</label>
            <input type="textarea" className="form-control" id="descriptionInput" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="notesInput">Notes:</label>
            <input type="textarea" className="form-control" id="notesInput" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  )
}
