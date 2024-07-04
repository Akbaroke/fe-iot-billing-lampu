import {
  ActionIcon,
  Button,
  Card,
  Container,
  Modal,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import BarcodeScanner from './components/BarcodeScanner';
import { IconScan } from '@tabler/icons-react';
import { useState } from 'react';
import axios from './api/axios';
import Notify from './components/Notify';
import DetailBilyard from './components/DetailBilyard';

export interface DataTableModel {
  number: number;
  status: string;
  table_code: string;
  start_at: number | null;
  expired_at: number | null;
}

interface ResponseDataModel {
  id: string;
  number: number;
  start_at: number;
  expired_at: number;
}

export default function App() {
  const [dataTable, setDataTable] = useState<DataTableModel | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      table_code: '',
    },

    validate: {
      table_code: (value) => (value ? null : 'Table number is required'),
    },
  });

  const handleSubmit = (values: any) => {
    Notify('loading', 'Please wait...', 'get-data-lamp');
    const lampNumber = lampDatas.find((lamp) => lamp.id === values.table_code);
    if (lampNumber) {
      Notify('success', 'Table Number Found', 'get-data-lamp');
      getDataLamp(lampNumber.number, values.table_code);
    } else {
      console.log('Lamp not found');
      Notify('error', 'Table Number Not Found.', 'get-data-lamp');
    }
  };

  const getDataLamp = async (lampNumber: number, table_code: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/data/${lampNumber}`);
      const response: ResponseDataModel = data.data;
      setDataTable({
        number: response.number,
        status: 'active',
        table_code: table_code,
        start_at: response.start_at,
        expired_at: response.expired_at,
      });
    } catch (error: any) {
      setDataTable({
        number: lampNumber,
        status: 'inactive',
        table_code: table_code,
        start_at: null,
        expired_at: null,
      });
    } finally {
      form.reset();
      setIsLoading(false);
    }
  };

  return (
    <Container size="md" className="min-h-screen grid place-items-center py-5">
      {dataTable ? (
        <DetailBilyard dataTable={dataTable} setDataTable={setDataTable} />
      ) : (
        <>
          <div className="flex flex-col gap-5 items-center justify-center w-full">
            <h1
              className="text-xl italic font-bold drop-shadow-2xl cursor-pointer text-center"
              onClick={() => location.reload()}>
              Bilyard Self Service
            </h1>

            <Card
              radius="lg"
              withBorder
              padding="xl"
              className="w-full sm:max-w-[400px] max-w-none">
              <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <TextInput
                  withAsterisk
                  label="Table Code"
                  placeholder="TB-001"
                  readOnly={isLoading}
                  key={form.key('table_code')}
                  {...form.getInputProps('table_code')}
                />
                <div className="flex items-center justify-between gap-2 mt-5">
                  <ActionIcon
                    variant="outline"
                    aria-label="scan"
                    onClick={open}
                    disabled={isLoading}
                    size={30}>
                    <IconScan
                      style={{ width: '70%', height: '70%' }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                  <Button type="submit" fullWidth size="xs" loading={isLoading}>
                    Submit
                  </Button>
                </div>
              </form>
            </Card>
          </div>
          <Modal
            opened={opened}
            radius="lg"
            onClose={close}
            centered
            title={
              <div className="flex items-center gap-2">
                <IconScan size={25} />
                <h1 className="font-bold italic">Scan QR Code</h1>
              </div>
            }>
            <BarcodeScanner
              onChange={(data) => {
                form.setFieldValue('table_code', data);
                close();
              }}
            />
          </Modal>
        </>
      )}
    </Container>
  );
}

const lampDatas = [
  {
    id: 'TB-001',
    name: 'Lampu 1',
    number: 1,
  },
  {
    id: 'TB-002',
    name: 'Lampu 2',
    number: 2,
  },
  {
    id: 'TB-003',
    name: 'Lampu 3',
    number: 3,
  },
  {
    id: 'TB-004',
    name: 'Lampu 4',
    number: 4,
  },
];
