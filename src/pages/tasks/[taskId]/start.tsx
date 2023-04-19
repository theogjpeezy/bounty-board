import { getTask, getTasks } from "@/db";
import { ITask } from "@/db/tasks";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Col, Container, Row, Button, Label } from "reactstrap";

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

export default function Start({task}: {task: ITask}) {
  const [selectedFile, setSelectedFile] = useState<File|undefined>();
  const [beforeImageFiles, setBeforeImageFiles] = useState<string[]>(task.beforeImageFiles ?? []);
  const { push } = useRouter();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    const body = new FormData();
    body.append('file', selectedFile)
    const resp = await fetch(`/api/upload`, {
      method: 'POST',
      body
    });
    const fileName = await resp.text();
    const updatedTask: ITask = {
      ...task,
      beforeImageFiles: [...task.beforeImageFiles ?? [], fileName]
    };
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedTask)
    });
    setBeforeImageFiles([...beforeImageFiles, fileName]);
  };

  const handleStart = async () => {
    const updatedTask: ITask = {
      ...task,
      status: 'started',
      startedDate: new Date().toISOString()
    };
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedTask)
    });
    push(`/tasks/${task.id}`);
  }

  return (
    <Container>
      <Head>
        <title>Start Work</title>
      </Head>
      <h1>Start work on {task.title}</h1>
      <h4>At least one photo has to be uploaded to start work</h4>
      <form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col xs={2}><Label>Starting Photo:</Label></Col>
          <Col><input type="file" name="file" className="form-control" onChange={(e) => setSelectedFile(e.target.files?.[0])}/></Col>
          <Col><Button type="submit">Upload</Button></Col>
        </Row>
      </form>
      <Row className="mb-5">
        <Col xs={2}><button onClick={handleStart} className="btn btn-primary" disabled={!beforeImageFiles.length}>Start Work</button></Col>
      </Row>
      
      {!!beforeImageFiles.length && 
        <>

          <h3>Start Images</h3>
          <ul>
            {(beforeImageFiles ?? []).map((x, i) => <li key={i}><img style={{ maxWidth: '16em', maxHeight: '16em'}}src={`/uploads/${x}`} /></li>)}
          </ul>
        </>
      }
    </Container>
  )
}