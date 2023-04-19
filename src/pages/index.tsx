import Head from 'next/head'
import Image from 'next/image'
import { Container, Row, Col, Card, CardBody, CardHeader, CardSubtitle } from 'reactstrap';
import { chunk } from 'lodash';
import { getTasks } from '@/db';
import { useRouter } from 'next/router';
import { ITask } from '@/db/tasks';


export async function getStaticProps() {
  const tasks = await getTasks();
  return {
    props: {
      tasks
    }
  }
}

interface IHomeProps {
  tasks: ITask[]
};

export default function Home({tasks}: IHomeProps) {
  const openTasks = tasks.filter(x => x.status === 'open');
  const startedTasks = tasks.filter(x => x.status === 'started');
  const totalHours = tasks.reduce((acc, {time, status}) => status === 'completed' ? acc : acc + time, 0);
  const openChunks = chunk(openTasks, 3);
  const startedChunks = chunk(startedTasks, 3);
  return (
    <Container>
      <Head>
        <title>Alexis Bounty Board</title>
      </Head>
      <h1>Alexis Bounty Board</h1>
      <h5>Jobs ready for work | {`${totalHours} ${totalHours > 1 ? 'hours' : 'hour' } available to work`}</h5>
      <br />
      <h6>Started Jobs</h6>
      <hr />
      <br />
      {startedChunks.map((chunk, chunkIndex) => 
      <Row xs={3} key={chunkIndex}>
        {chunk.map((t, i) => 
          <Col key={i}>
            <Card className='card mb-3 bg-light' style={{maxWidth: '100%'}} key={i}>
              <CardHeader className='card-header'>{t.title}</CardHeader>
              <CardBody className='card-body'>
                <CardSubtitle className="mb-2 text-muted" tag="h6">{`${t.time} ${t.time > 1 ? 'hours' : 'hour'}`}</CardSubtitle>
                <p className='card-text'>{t.description}</p>
                <a href={`/tasks/${t.id}`} className='btn btn-primary'>View</a>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
      )}
      <br />

      <h6>Open Jobs</h6>
      <hr />
      <br />
      {openChunks.map((chunk, chunkIndex) => 
      <Row xs={3} key={chunkIndex}>
        {chunk.map((t, i) => 
          <Col key={i}>
            <Card className='card mb-3 bg-light' style={{maxWidth: '100%'}} key={i}>
              <CardHeader className='card-header'>{t.title}</CardHeader>
              <CardBody className='card-body'>
                <CardSubtitle className="mb-2 text-muted" tag="h6">{`${t.time} ${t.time > 1 ? 'hours' : 'hour'}`}</CardSubtitle>
                <p className='card-text'>{t.description}</p>
                <a href={`/tasks/${t.id}`} className='btn btn-primary'>View</a>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
      )}
      
    </Container>
  )
}
