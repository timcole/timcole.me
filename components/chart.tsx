import { FC, memo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import styled from 'styled-components';

type Props = {
  data: any[];
  name: string;
  suffix: string;
  references?: {
    yStart: number;
    yEnd: number;
    label: string;
    color: string;
  }[];
};

const Chart: FC<Props> = memo(({ data, name, suffix, references }) => {
  return (
    <StyledContainer width="100%" height={300}>
      <AreaChart
        width={500}
        height={200}
        data={data}
        syncId="anyId"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--background_100)" />
        {references?.map(({ yStart, yEnd, label, color }) => (
          <ReferenceArea
            y1={yStart}
            y2={yEnd}
            stroke={color}
            fill={color}
            label={{ value: label, fill: color }}
            fillOpacity={0.02}
            strokeOpacity={0.3}
          />
        ))}
        <XAxis
          stroke="var(--text)"
          strokeOpacity="0.5"
          opacity="0.8"
          dataKey="time"
          tickFormatter={(time) => new Date(time).toLocaleTimeString('en-US')}
          type="number"
          domain={['dataMin', 'dataMax']}
        />
        <YAxis
          stroke="var(--text)"
          strokeOpacity={0.5}
          opacity={0.8}
          orientation="right"
          unit={suffix}
          domain={['dataMin - 10', 'dataMax + 10']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--background_300)',
            border: 'none',
          }}
          isAnimationActive={false}
          separator=" "
          labelFormatter={(date: number) =>
            new Date(date).toLocaleString('en-US')
          }
          formatter={(value: string) => [
            `${Number(value).toFixed(2)}${suffix}`,
            name,
          ]}
        />
        <Area type="linear" dataKey="data" fill="url(#color)" />
      </AreaChart>
    </StyledContainer>
  );
});

export default Chart;

const StyledContainer = styled(ResponsiveContainer)`
  padding: 25px 0;
  background: var(--background_100);
`;
