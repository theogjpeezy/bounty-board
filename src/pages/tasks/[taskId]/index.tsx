import { getTask, getTasks } from "@/db";
import Head from "next/head";
import { useState } from "react";
import type { ITask } from "@/db/tasks";
import { Col, Row } from "reactstrap";

export async function getStaticPaths() {
  const taskIds = await getTasks();
  return {
    paths: taskIds.map(task => ({
      params: {taskId: task.id}
    })),
    fallback: false
  }
}

export async function getStaticProps({ params }: { params: { taskId: string } }) {
  const task = await getTask(params.taskId);
  return {
    props: {
      task
    }
  }
}

export default function view({task}: {task: ITask}) {
  const [title, setTitle] = useState<string|undefined>(task.title);
  const [time, setTime] = useState<string|undefined>(task.time.toString());
  const [notes, setNotes] = useState<string|undefined>(task.notes);
  const [description, setDescription] = useState<string|undefined>(task.description);
    
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('saved');
  }

  return (
    <div>
      <Head>
          <title>{task.title}</title>
      </Head>
      <div className="container">
        <h1>{task.title}</h1>
        <Row>
          <Col xs={2}>Description:</Col>
          <Col>{task.description}</Col>
        </Row>
        <Row>
          <Col xs={2}>Notes:</Col>
          <Col>{task.notes}</Col>
        </Row>
        <Row>
          <Col xs={2}>Time Budgeted:</Col>
          <Col>{task.time}</Col>
        </Row>
        <Row>
          <Col xs={2}>Total Earned:</Col>
          <Col>${task.time * 13.25}</Col>
        </Row>
        <a href="/" className="btn btn-primary">Back</a>
      </div>
    </div>
  )
}
