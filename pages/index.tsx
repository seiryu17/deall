import React, { useEffect, useState } from "react";
import axios from "axios";
import LayoutComponent from "../src/component/layout";
import { AutoComplete, Col, Input, Pagination, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import IProduct from "../src/constant/product";
import useDebounce from "../src/utils/debounce";
import Link from "next/link";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import CONFIG from "../src/utils/environment";

interface IProps {
  data: { products: IProduct[]; total: number; limit: number; skip: number };
}

export default function Home(props: IProps) {
  const { data } = props;
  const [listProducts, setListProducts] = useState(data);
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchVal = useDebounce(search, 500);
  const mq = useBreakpoint();

  const columns: ColumnsType<IProduct> = [
    {
      title: "Product Name",
      dataIndex: "title",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      render: (text) => <Link href={`/brand/${text}`}>{text}</Link>,
      filters: [
        ...new Map(listProducts.products.map((m) => [m.brand, m])).values(),
      ].map((x) => {
        return { text: x.brand, value: x.brand };
      }),
      onFilter: (value, record) => record.brand.includes(value as string),
    },
    {
      title: "Price",
      dataIndex: "price",
      filters: [
        ...new Map(listProducts.products.map((m) => [m.price, m])).values(),
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
        ...new Map(listProducts.products.map((m) => [m.category, m])).values(),
      ].map((x) => {
        return { text: x.category, value: x.category };
      }),
      onFilter: (value, record) => record.category.includes(value as string),
    },
  ];

  const FetchData = async (page = 0, limit = 10, search = "") => {
    await axios
      .get(
        `${CONFIG.API_URL}/products${search !== "" ? "/search/" : ""}?skip=${
          (page ? page - 1 : 0) * 10
        }&limit=${limit}${search !== "" ? `&q=${search}` : ""}`
      )
      .then((res) => {
        const data = [...options];
        if (options.length >= 5) {
          data.pop();
        }
        data.unshift({ value: search });
        return (
          setListProducts(res.data),
          search &&
            options.filter((e) => e.value === search).length <= 0 &&
            setOptions(data)
        );
      })
      .catch((err) => err.response.data);
  };

  useEffect(() => {
    FetchData(0, 10, searchVal);
    if (searchVal === "") {
      setCurrPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal]);

  return (
    <LayoutComponent activeMenuKey="1">
      <Row style={{ width: "100%" }} justify="end" gutter={[8, 8]}>
        <Col span={mq.xs ? 24 : mq.lg ? 4 : 6}>
          <AutoComplete
            value={search}
            options={options.length > 0 ? options : undefined}
            style={{ width: "100%" }}
            onSelect={(data) => setSearch(data)}
            onChange={(data) => setSearch(data)}
            placeholder="Search product"
          />
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={listProducts.products}
            rowKey="id"
            pagination={{
              onChange(page) {
                return FetchData(page), setCurrPage(page);
              },
              current: currPage,
              total: listProducts.total,
              showSizeChanger: false,
              responsive: true,
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
    .get(`${CONFIG.API_URL}/products?limit=10`)
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return {
    props: {
      data: response,
    },
  };
}
