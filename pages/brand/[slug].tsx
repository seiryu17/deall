import { Col, Row, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import LayoutComponent from "../../src/component/layout";
import IProduct from "../../src/constant/product";
import CONFIG from "../../src/utils/environment";

interface IProps {
  data: { products: IProduct[]; total: number; limit: number; skip: number };
}

function BrandDetail(props: IProps) {
  const { query } = useRouter();
  const { data } = props;
  const mq = useBreakpoint();
  const slug = query.slug;
  const selectedItems = data.products.filter((x) => x.brand === slug);
  const columns: ColumnsType<IProduct> = [
    {
      title: "Product Name",
      dataIndex: "title",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      filters: [
        ...new Map(selectedItems.map((m) => [m.brand, m])).values(),
      ].map((x) => {
        return { text: x.brand, value: x.brand };
      }),
      onFilter: (value, record) => record.brand.includes(value as string),
    },
    {
      title: "Price",
      dataIndex: "price",
      filters: [
        ...new Map(selectedItems.map((m) => [m.price, m])).values(),
      ].map((x) => {
        return { text: x.price, value: x.price };
      }),
      onFilter: (value, record) => record.price === value,
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Category",
      dataIndex: "category",
      filters: [
        ...new Map(selectedItems.map((m) => [m.category, m])).values(),
      ].map((x) => {
        return { text: x.category, value: x.category };
      }),
      onFilter: (value, record) => record.category.includes(value as string),
    },
  ];
  return (
    <LayoutComponent activeMenuKey="1">
      <Row>
        <Col>
          <Typography.Title>{slug}</Typography.Title>
        </Col>
      </Row>
      {[
        { label: "Amount of items", value: selectedItems.length },
        { label: "Category", value: selectedItems[0].category },
      ].map((x, index) => (
        <Row key={index}>
          <Col span={mq.xs ? 12 : 3}>
            <Typography.Text>{x.label}</Typography.Text>
          </Col>
          <Col>
            : <Typography.Text>{x.value}</Typography.Text>
          </Col>
        </Row>
      ))}
      <Table
        style={{ marginTop: 8 }}
        columns={columns}
        dataSource={selectedItems}
        rowKey="id"
        pagination={{
          showSizeChanger: false,
          responsive: true,
          position: mq.xs ? ["bottomLeft"] : ["bottomRight"],
        }}
      />
    </LayoutComponent>
  );
}

export async function getServerSideProps() {
  const response = await axios
    .get(`${CONFIG.API_URL}/products?limit=100`)
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return {
    props: {
      data: response,
    },
  };
}

export default BrandDetail;
