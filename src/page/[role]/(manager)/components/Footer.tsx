import { Layout, Row, Col } from "antd";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <div className="copyright text-center">
        convert by Mai Ninh Bình
      </div>
    </AntFooter>
  );
}

export default Footer;
