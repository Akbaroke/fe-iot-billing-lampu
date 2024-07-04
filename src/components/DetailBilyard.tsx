import {
  Badge,
  Button,
  Card,
  Modal,
  NumberInput,
  TextInput,
} from '@mantine/core';
import { DataTableModel } from '../App';
import moment from 'moment';
import { useDisclosure } from '@mantine/hooks';
import { IconClockHour1 } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import axios from '../api/axios';
import Notify from './Notify';
import { useState } from 'react';

type Props = {
  dataTable: DataTableModel;
  setDataTable: (dataTable: DataTableModel | null) => void;
};

export default function DetailBilyard({ dataTable, setDataTable }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const PRICE_PER_MINUTE = 2000;

  const form = useForm({
    initialValues: {
      rent_minute: 0,
      total_payment: 0,
    },

    validate: {
      rent_minute: (value) => (value !== 0 ? null : 'Rent Minute is required'),
    },
  });

  const handleSubmit = async (value: any) => {
    setIsLoading(true);
    Notify('loading', 'Please wait...', 'rent-lamp');
    try {
      await axios.post('/waktu', {
        number: dataTable.number,
        addTime: value.rent_minute,
      });
      close();
      setDataTable(null);
      Notify('success', 'Rent Success', 'rent-lamp');
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
      Notify('error', 'Rent Failed', 'rent-lamp');
    } finally {
      setIsLoading(false);
    }
  };

  const stopRent = async () => {
    setIsLoading(true);
    Notify('loading', 'Please wait...', 'stop-lamp');
    try {
      await axios.post('/stop', {
        number: dataTable.number,
      });
      close();
      setDataTable(null);
      Notify('success', 'Stop Rent Success', 'stop-lamp');
    } catch (error) {
      console.log(error);
      Notify('error', 'Stop Rent Failed', 'stop-lamp');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      radius="lg"
      withBorder
      padding="xl"
      className="w-full sm:max-w-[400px] max-w-none">
      <div className="flex flex-col items-center gap-2 mb-3">
        <h1 className="text-xl font-semibold text-center">Detail Table</h1>
        <Badge
          size="sm"
          color={dataTable.status === 'active' ? 'teal' : 'red'}
          className="mx-auto">
          {dataTable.status}
        </Badge>
      </div>

      <div className="flex flex-col gap-2">
        <TextInput
          label="Number"
          value={dataTable.number}
          disabled
          readOnly={isLoading}
        />
        <TextInput
          label="Table Number"
          value={dataTable.table_code}
          disabled
          readOnly={isLoading}
        />
        <TextInput
          label="Rent Time Minute"
          value={calculateDifferenceInMinutes(
            dataTable.start_at ?? 0,
            dataTable.expired_at ?? 0
          )}
          disabled
          readOnly={isLoading}
        />
        <TextInput
          label="Rent Total Payment"
          value={
            'Rp. ' +
            IndonesiaFormat.format(
              calculateDifferenceInMinutes(
                dataTable.start_at ?? 0,
                dataTable.expired_at ?? 0
              ) * PRICE_PER_MINUTE
            )
          }
          disabled
          readOnly={isLoading}
        />
        <TextInput
          label="Start Date"
          value={
            !dataTable.start_at
              ? '-'
              : moment(new Date(dataTable.start_at ?? 0)).format(
                  'DD/MM/YYYY hh:mm:ss'
                )
          }
          disabled
          readOnly={isLoading}
        />
        <TextInput
          label="Expired Date"
          value={
            !dataTable.expired_at
              ? '-'
              : moment(new Date(dataTable.expired_at ?? 0)).format(
                  'DD/MM/YYYY hh:mm:ss'
                )
          }
          disabled
          readOnly={isLoading}
        />
        <div className="flex items-center justify-center gap-5">
          {dataTable.status === 'active' && (
            <Button
              fullWidth
              size="xs"
              mt={15}
              onClick={stopRent}
              color="red"
              loading={isLoading}>
              Stop Rent
            </Button>
          )}
          <Button
            fullWidth
            size="xs"
            mt={15}
            onClick={open}
            loading={isLoading}>
            Rent
          </Button>
        </div>
        <p
          className="underline text-xs text-blue-400 text-center cursor-pointer mx-auto w-max mt-5"
          onClick={() => setDataTable(null)}>
          Back
        </p>
      </div>
      <Modal
        opened={opened}
        radius="lg"
        onClose={close}
        padding={30}
        centered
        title={
          <div className="flex items-center gap-2">
            <IconClockHour1 size={25} />
            <h1 className="font-bold italic">Form Rent</h1>
          </div>
        }>
        <form
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
          className="flex flex-col gap-2">
          <p>{error}</p>
          <NumberInput
            min={0}
            withAsterisk
            label="Rent Minute"
            placeholder="30"
            value={form.values.rent_minute}
            error={form.errors.rent_minute as string}
            onChange={(value) => {
              form.setFieldValue('rent_minute', value as number);
              form.setFieldValue(
                'total_payment',
                Number(value) * PRICE_PER_MINUTE
              );
            }}
            readOnly={isLoading}
          />
          <TextInput
            label="Total Payment"
            value={'Rp. ' + IndonesiaFormat.format(form.values.total_payment)}
            disabled
            readOnly={isLoading}
          />
          <Button fullWidth size="xs" type="submit" mt={20} loading={isLoading}>
            Payment
          </Button>
        </form>
      </Modal>
    </Card>
  );
}

let IndonesiaFormat = new Intl.NumberFormat('id-ID', {
  style: 'decimal',
});

function calculateDifferenceInMinutes(start_at: number, expired_at: number) {
  const differenceInMilliseconds = expired_at - start_at;
  const differenceInMinutes = differenceInMilliseconds / 1000 / 60;

  return differenceInMinutes;
}
