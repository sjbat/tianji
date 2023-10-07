import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import React from 'react';
import { trpc } from '../../api/trpc';
import { useCurrentWorkspaceId } from '../../store/user';
import { sum } from 'lodash-es';
import millify from 'millify';

interface MetricsTableProps {
  websiteId: string;
  title: [string, string];
  type:
    | 'url'
    | 'language'
    | 'referrer'
    | 'browser'
    | 'os'
    | 'device'
    | 'country'
    | 'event';
  startAt: number;
  endAt: number;
}
export const MetricsTable: React.FC<MetricsTableProps> = React.memo((props) => {
  const workspaceId = useCurrentWorkspaceId()!;
  const { websiteId, title, type, startAt, endAt } = props;

  const { isLoading, data: metrics = [] } = trpc.website.metrics.useQuery({
    workspaceId,
    websiteId,
    type,
    startAt,
    endAt,
  });

  const total = sum(metrics.map((m) => m.y));

  const columns: ColumnsType<{ x: string; y: number }> = [
    {
      title: title[0],
      dataIndex: 'x',
    },
    {
      title: title[1],
      dataIndex: 'y',
      width: 100,
      align: 'center',
      render: (val) => {
        const percent = (Number(val) / total) * 100;

        return (
          <div className="flex">
            <div className="w-12 text-right">
              {millify(val, {
                lowercase: true,
              })}
            </div>
            <div className="inline-block w-10 relative border-l ml-1 pl-1">
              <div
                className="bg-blue-300 absolute h-full bg-opacity-25 left-0 top-0 pointer-events-none"
                style={{ width: `${percent}%` }}
              />
              <span>{percent.toFixed(0)}%</span>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="x"
      loading={isLoading}
      dataSource={metrics}
      columns={columns}
      pagination={{
        pageSize: 10,
        hideOnSinglePage: true,
      }}
      size="small"
    />
  );
});
MetricsTable.displayName = 'MetricsTable';