import React from "react";

import { Layout, Menu } from "antd";
import { useRouter } from "next/router";

const { Header, Content, Sider } = Layout;

interface IMenu {
  key: string;
  label: string;
  link: string;
}

interface IProps {
  children: React.ReactNode;
  activeMenuKey: string;
}

const MENU = [
  {
    key: "1",
    label: "Products",
    link: "/",
  },
  {
    key: "2",
    label: "Carts",
    link: "/carts",
  },
] as IMenu[];

const LayoutComponent = (props: IProps) => {
  const { children, activeMenuKey } = props;
  const router = useRouter();

  return (
    <Layout hasSider={true}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={MENU}
          selectedKeys={[activeMenuKey!]}
          onClick={(item) =>
            router.push(MENU.find((x) => x.key === item.key)?.link!)
          }
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "24px 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              maxHeight: "100%",
              background: "#ffffff",
              overflow: "auto",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
