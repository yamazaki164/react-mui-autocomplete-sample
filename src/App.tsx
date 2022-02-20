import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Autocomplete, TextField } from '@mui/material';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

type Option = {
  label: string;
  value: string;
};

interface IFormInput {
  country: Option | null;
}

function App() {
  const [options, setOptions] = useState<Option[]>([]);
  const { control, handleSubmit, setValue } = useForm<IFormInput>({
    defaultValues: {
      country: { label: 'アルバニア', value: 'Albania' },
    },
  });
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };
  const onInputChange = (value: string) => {
    console.log('onInputChange:' + value);
    axios
      .get(
        `http://localhost:4000/country?label_like=${value}&_start=0&_limit=10`
      )
      .then((res) => setOptions(res.data))
      .catch((e) => setOptions([]));
  };
  const isOptionEqualToValue = (option: Option, value: Option) => {
    return option.value === value.value;
  };

  // 初回のみ実行
  useEffect(() => {
    axios
      .get('http://localhost:4000/country?_start=0&_limit=10')
      .then((res) => setOptions(res.data))
      .catch((e) => setOptions([]));
  }, []);

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={options}
              isOptionEqualToValue={(option, value) =>
                isOptionEqualToValue(option, value)
              }
              onInputChange={(e, newValue) => onInputChange(newValue)}
              onChange={(e, newValue) => {
                console.log('onChange: ' + newValue?.label);
                // setValue('country', newValue);
                field.onChange(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="" />}
            ></Autocomplete>
          )}
        ></Controller>
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
