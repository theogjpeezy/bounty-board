import Head from 'next/head'
import Image from 'next/image'
import { Container, Row, Col, Card, CardBody, CardHeader, CardSubtitle } from 'reactstrap';
import { chunk } from 'lodash';
import { getTasks } from '@/db';
import { useRouter } from 'next/router';
import { ITask } from '@/db/tasks';

interface ITodo {
  title: string;
  time: string;
  description: string;
  notes: string;
  completed: boolean;
  completedDate?: Date;
  completedPhoto?: string;
}

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
  const totalHours = tasks.reduce((acc, {time}) => acc + time, 0);
  const chunks = chunk(tasks, 3);
  return (
    <Container>
      <Head>
        <title>Alexis Bounty Board</title>
      </Head>
      <h1>Alexis Bounty Board</h1>
      <h5>Open Jobs ready for work | {`${totalHours} ${totalHours > 1 ? 'hours' : 'hour' } available to work`}</h5>
      <br />
      {chunks.map((chunk, chunkIndex) => 
      <Row xs={3} key={chunkIndex}>
        {chunk.map((t, i) => 
          <Col>
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
