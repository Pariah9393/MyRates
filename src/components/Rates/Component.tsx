import useAxios from 'axios-hooks'
import React, { Fragment, useEffect, useState } from 'react'
import ApexChart, { Props } from 'react-apexcharts'
import { TReduxProps } from './Container'
import { StyledContainer } from './style'
import moment from 'moment'

import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';


export type TComponentProps = {
} & TReduxProps

const Rates: React.FC<TComponentProps> = () => {

  
  const type = 'line'
  const [, setCurr] = useState({usd: false, eur: false, rur: false})
  const [endDate, ] = useState(moment().format('YYYY-M-D'))
  const [startDate, ] = useState(moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-M-D'))
  const [сurr_id, setCurr_id] = useState(298);
  const [{ data, loading, error }, refetch] = useAxios(`https://www.nbrb.by/API/ExRates/Rates/Dynamics/${сurr_id}?startDate=${startDate}&endDate=${endDate}`)
  const chartOptions = {
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: data !== undefined && data.map(i => moment(i.Date).format('ll'))
    }
  }
  const chartSeries = [
    {
      name: "курс",
      data: data !== undefined && data.map(i => i.Cur_OfficialRate)
    }
  ]
  

  const usdClick = () => {
    setCurr({usd: true, eur: false, rur: false})
    setCurr_id(145)
  }

  const eurClick = () => {
    setCurr({usd: false, eur: true, rur: false})
    setCurr_id(19)
  }

  const rurClick = () => {
    setCurr({usd: false, eur: false, rur: true})
    setCurr_id(298)
  }

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={usdClick}>
        <div>USD</div>
      </Menu.Item>
      <Menu.Item key="1" onClick={eurClick}>
        <div>EUR</div>
      </Menu.Item>
      <Menu.Item key="2" onClick={rurClick}>
        <div>RUR</div>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    refetch()
  }, [сurr_id])

  return (
    <Fragment>
      <StyledContainer>
        <ApexChart
          options={chartOptions}
          series={chartSeries}
          type={type}
          width={500}
          height={300}
        />
      </StyledContainer>
      <StyledContainer>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            Выберите валюту <DownOutlined />
          </a>
        </Dropdown>
      </StyledContainer>
    </Fragment>
  )
}

export default Rates
