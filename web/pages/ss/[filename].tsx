import { Component } from "react";
import { withRouter } from "next/router";

import Layout from "../../components/layout";
import Header from "../../components/header";
import Footer from "../../components/footer";

import Error from "../_error";

import "../../styles/screenshot.scss";
import { NextPageContext } from "next";

class Screenshot extends Component<any> {
  private store: any;
  constructor(props: any) {
    super(props);

    this.store = props.store;
  }

  imageLink(image: string): string {
    return `https://cdn.tcole.me/${image}`;
  }

  static async getInitialProps({ query, res }: NextPageContext) {
    const filename: string = query.filename as string;

    var ss = await fetch(`https://cdn.tcole.me/${filename}`);

    if (ss.status != 404) return { error: false, filename };

    res.statusCode = 404;
    return { error: res.statusCode };
  }

  render() {
    const { filename, error } = this.props;
    if (error) return <Error statusCode="404" />;
    return (
      <Layout
        title={`Timothy Cole - Screenshot: ${filename}`}
        screenshot={filename}
        className="screenshot"
      >
        <div className="header">
          <Header className="container" store={this.store} />
        </div>
        <div className="body">
          <a href={this.imageLink(filename)}>
            <img src={this.imageLink(filename)} alt="Screenshot" />
          </a>
        </div>
        <Footer />
      </Layout>
    );
  }
}

export default withRouter(Screenshot);

