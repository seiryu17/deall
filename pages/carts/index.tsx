import React, { useState } from "react";
import axios from "axios";
import LayoutComponent from "../../src/component/layout";
import { Button, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import ICart from "../../src/constant/cart";
import IProduct from "../../src/constant/product";
import Link from "next/link";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import CONFIG from "../../src/utils/environment";

const columns: ColumnsType<ICart> = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Products",
    dataIndex: "products",
    render: (products) =>
      products.map((product: IProduct) => product.title).join(" | "),
  },
  {
    title: "Total Products",
    dataIndex: "totalProducts",
  },
  {
    title: "Total Quantity",
    dataIndex: "totalQuantity",
  },
  {
    title: "Discounted Total",
    dataIndex: "discountedTotal",
  },
  {
    title: "Total",
    dataIndex: "total",
  },
  {
    title: "Action",
    render: (carts: ICart) => {
      return (
        <Link href={`/carts/${carts.id}`}>
          <Button type="primary">Go To Detail</Button>
        </Link>
      );
    },
  },
];

interface IProps {
  data: { carts: ICart[]; total: number; limit: number; skip: number };
}

export default function Carts(props: IProps) {
  const { data } = props;
  const [listCarts, setListCarts] = useState(data);
  const mq = useBreakpoint();
  const FetchData = async (page = 0, limit = 10) => {
    await axios
      .get(
        `${CONFIG.API_URL}/carts?skip=${
          (page ? page - 1 : 0) * 10
        }&limit=${limit}`
      )
      .then((res) => setListCarts(res.data))
      .catch((err) => err.response.data);
  };

  return (
    <LayoutComponent activeMenuKey="2">
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={listCarts.carts}
            rowKey="id"
            pagination={{
              onChange(page) {
                return FetchData(page);
              },
              total: listCarts.total,
              showSizeChanger: false,
              position: mq.xs ? ["bottomLeft"] : ["bottomRight"],
            }}
          />
        </Col>
      </Row>
    </LayoutComponent>
  );
}

export async function getServerSideProps() {
  const response = await axios
    .get(`${CONFIG.API_URL}/carts?limit=10`)
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return {
    props: {
      data: response,
    },
  };
}
