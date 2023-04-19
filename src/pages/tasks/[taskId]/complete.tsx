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

export default function start({task}: {task: ITask}) {
  const [selectedFile, setSelectedFile] = useState<File|undefined>();
  const [afterImageFiles, setAfterImageFiles] = useState<string[]>(task.afterImageFiles ?? []);
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
      afterImageFiles: [...task.afterImageFiles ?? [], fileName]
    };
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedTask)
    });
    setAfterImageFiles([...afterImageFiles, fileName]);
  };

  const handleStart = async () => {
    const updatedTask: ITask = {
      ...task,
      status: 'completed',
      completedDate: new Date().toISOString()
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
        <title>Complete Work</title>
      </Head>
      <h1>Complete work on {task.title}</h1>
      <h4>At least one photo has to be uploaded to start work</h4>
      <form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col xs={2}><Label>Completion Photo:</Label></Col>
          <Col><input type="file" name="file" className="form-control" onChange={(e) => setSelectedFile(e.target.files?.[0])}/></Col>
          <Col><Button type="submit">Upload</Button></Col>
        </Row>
      </form>
      <Row className="mb-5">
        <Col xs={2}><button onClick={handleStart} className="btn btn-primary" disabled={!afterImageFiles.length}>Complete Work</button></Col>
      </Row>
      
      {!!afterImageFiles.length && 
        <>

          <h3>Start Images</h3>
          <ul>
            {(afterImageFiles ?? []).map((x, i) => <li key={i}><img style={{ maxWidth: '16em', maxHeight: '16em'}}src={`/uploads/${x}`} /></li>)}
          </ul>
        </>
      }
    </Container>
  )
}