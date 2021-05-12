import React from 'react'
import { Select } from 'antd'
import { intervalFilterLogic } from './intervalFilterLogic'
import { useValues, useActions } from 'kea'
import { ViewType } from 'scenes/insights/insightLogic'
import { disableHourFor, disableMinuteFor } from 'lib/utils'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'

const intervals = {
    minute: {
        label: 'Minute',
        newDateFrom: 'dStart',
        icon: <ClockCircleOutlined />,
    },
    hour: {
        label: 'Hourly',
        newDateFrom: 'dStart',
        icon: <ClockCircleOutlined />,
    },
    day: {
        label: 'Daily',
        newDateFrom: undefined,
        icon: <ClockCircleOutlined />,
    },
    week: {
        label: 'Weekly',
        newDateFrom: '-30d',
        icon: <CalendarOutlined />,
    },
    month: {
        label: 'Monthly',
        newDateFrom: '-90d',
        icon: <CalendarOutlined />,
    },
}

const defaultInterval = intervals.day

type IntervalKeyType = keyof typeof intervals

interface InvertalFilterProps {
    view: ViewType
    disabled?: boolean
}

export function IntervalFilter({ view, disabled }: InvertalFilterProps): JSX.Element {
    const interval: IntervalKeyType = useValues(intervalFilterLogic).interval
    const { setIntervalFilter, setDateFrom } = useActions(intervalFilterLogic)
    const options = Object.entries(intervals).map(([key, { label, icon }]) => ({
        key,
        value: key,
        label: (
            <>
                {icon} {label}
            </>
        ),
        disabled: (key === 'minute' || key === 'hour') && view === ViewType.SESSIONS,
    }))
    return (
        <Select
            bordered={false}
            disabled={disabled}
            defaultValue={interval || 'day'}
            value={interval}
            dropdownMatchSelectWidth={false}
            onChange={(key) => {
                const { newDateFrom } = intervals[key as IntervalKeyType] || defaultInterval
                const minuteDisabled = key === 'minute' && newDateFrom && disableMinuteFor[newDateFrom]
                const hourDisabled = key === 'hour' && newDateFrom && disableHourFor[newDateFrom]
                if (minuteDisabled || hourDisabled) {
                    return false
                }

                if (newDateFrom) {
                    setDateFrom(newDateFrom)
                }

                setIntervalFilter(key)
            }}
            data-attr="interval-filter"
            options={options}
        />
    )
}
