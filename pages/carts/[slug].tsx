import { Col, Row, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import LayoutComponent from "../../src/component/layout";
import ICart from "../../src/constant/cart";
import IProduct from "../../src/constant/product";
import CONFIG from "../../src/utils/environment";

interface IProps {
  dataCarts: {
    products: IProduct[];
    total: number;
    limit: number;
    skip: number;
    id: number;
  };
  dataProducts: {
    products: IProduct[];
    total: number;
    limit: number;
    skip: number;
  };
}

const columns: ColumnsType<IProduct> = [
  {
    title: "Product Name",
    dataIndex: "title",
  },
  {
    title: "Brand",
    dataIndex: "brand",
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "Stock",
    dataIndex: "stock",
  },
  {
    title: "Category",
    dataIndex: "category",
  },
];

function BrandDetail(props: IProps) {
  const { dataCarts, dataProducts } = props;
  const mq = useBreakpoint();
  dataCarts.products.map((x) => {
    dataProducts.products.map((xx) => {
      if (x.id === xx.id) {
        return (
          (x.brand = xx.brand), (x.stock = xx.stock), (x.category = xx.category)
        );
      }
    });
  });
  return (
    <LayoutComponent activeMenuKey="2">
      <Row>
        <Col>
          <Typography.Title>Cart User ID : {dataCarts.id}</Typography.Title>
        </Col>
      </Row>
      <Typography.Text>Details</Typography.Text>
      <Row style={{ background: "#D3D3D3", width: "100%", padding: 16 }}>
        <Row style={{ width: "100%" }}>
          {[
            { label: "User", value: dataCarts.id },
            { label: "# of items", value: dataCarts.products.length },
          ].map((x, index) => (
            <React.Fragment key={index}>
              <Col span={mq.xs ? 12 : 3}>
                <Typography.Text>{x.label}</Typography.Text>
              </Col>
              <Col span={mq.xs ? 12 : 3}>
                : <Typography.Text>{x.value}</Typography.Text>
              </Col>
            </React.Fragment>
          ))}
        </Row>
        <Row style={{ width: "100%" }}>
          {[
            { label: "Added On", value: new Date().toDateString() },
            { label: "Total", value: dataCarts.total },
          ].map((x, index) => (
            <React.Fragment key={index}>
              <Col span={mq.xs ? 12 : 3}>
                <Typography.Text>{x.label}</Typography.Text>
              </Col>
              <Col span={mq.xs ? 12 : 3}>
                : <Typography.Text>{x.value}</Typography.Text>
              </Col>
            </React.Fragment>
          ))}
        </Row>
      </Row>

      <Table
        style={{ marginTop: 8 }}
        columns={columns}
        dataSource={dataCarts.products}
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

export async function getServerSideProps(ctx: any) {
  const slug = ctx.params.slug;
  const responseCart = await axios
    .get(`${CONFIG.API_URL}/carts/${slug}`)
    .then((res) => res.data)
    .catch((err) => err.response.data);
  const responseProduct = await axios
    .get(`${CONFIG.API_URL}/products?limit=100`)
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return {
    props: {
      dataCarts: responseCart,
      dataProducts: responseProduct,
    },
  };
}

export default BrandDetail;
