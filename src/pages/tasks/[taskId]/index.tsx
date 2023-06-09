import { getTask, getTasks } from "@/db";
import Head from "next/head";
import { useState } from "react";
import type { ITask } from "@/db/tasks";
import { Col, Row } from "reactstrap";
import { chunk } from "lodash";
import Link from "next/link";

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

export default function View({task}: {task: ITask}) {
  
  return (
    <div>
      <Head>
          <title>{task.title}</title>
      </Head>
      <div className="container">
        <h1>{task.title} - {task.status}</h1>
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
        {task.status === 'open' && 
          <Row>
            <Col xs={2} className="mb-3"><a href={`${task.id}/start`} className="btn btn-primary">Start Work</a></Col>
          </Row>
        }
        {task.status === 'started' && 
          <Row>
            <Col xs={2} className="mb-3"><a href={`${task.id}/complete`} className="btn btn-primary">Complete Work</a></Col>
          </Row>
        }
        {
          task.status !== 'open' && (
            <>
              <Row>
                <h3>Starting Images</h3>
              </Row>

              {chunk(task.beforeImageFiles, 2).map((x,i) => (
                <Row key={i} className="mb-3">
                  {x.map((f, idx) => <Col xs={6} key={idx}><a href={`/uploads/${f}`} target="_blank"><img src={`/uploads/${f}`} style={{maxWidth: '16em', maxHeight: '16em'}}/></a></Col>)}
                </Row>
              ))}
            </>
          )
        }
        <Row>
          <Col xs={2} className="mb-3"><Link href="/" className="btn btn-secondary">Back</Link></Col>
        </Row>
      </div>
    </div>
  )
}
