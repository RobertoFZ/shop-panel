import React, { Fragment } from 'react';
import Head from 'next/head';

export type OpenGraphMetas = {
  title: string;
  type: string;
  url: string;
  image: string;
  description: string;
}

type Props = {
  title?: string;
  description?: string;
  subject?: string;
  copyright?: string;
  language?: string;
  openGraph?: OpenGraphMetas
}

const BaseMeta = ({
  title = process.env.appName,
  description = 'El lugar para que compres o vendas tu producto y logres llegar a la presencia que buscas en internet.',
  subject = 'Vende y compra cuando quieras',
  copyright = 'Twosoft S.A.P.I de C.V',
  language = 'ES',
  openGraph,
}: Props) => {

  if (!openGraph) {
    openGraph = {
      title: process.env.appName,
      type: 'E-commerce',
      url: `${process.env.applicationUrl}`,
      image: `${process.env.applicationUrl}/logo.jpg`,
      description: 'El lugar para que compres o vendas tu producto y logres llegar a la presencia que buscas en internet.'
    };
  }
  return (
    <Head>
      <meta charSet='utf-8' />
      <title>{title}</title>
      <link rel='icon' type='image/png' href='/favicon.ico' />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name='keywords' content='arca,shop,online,products,twosoft,buy,sell,business' />
      <meta name='description' content={description} />
      <meta name='subject' content={subject} />
      <meta name='copyright' content={copyright} />
      <meta name='language' content={language} />

      {
        openGraph && <Fragment>
          <meta name="og:title" content={openGraph.title} />
          <meta name="og:type" content={openGraph.type} />
          <meta name="og:url" content={openGraph.url} />
          <meta name="og:image" content={openGraph.image} />
          <meta name="og:site_name" content='Arca de Troya' />
          <meta name="og:description" content={openGraph.description} />
        </Fragment>
      }

      <script src="https://code.jquery.com/jquery-3.5.0.min.js" integrity="sha256-xNzN2a4ltkB44Mc/Jz3pT4iU1cmeR0FkXs4pru/JxaQ=" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/jquery.validation/1.15.1/jquery.validate.min.js"
        type="text/javascript"></script>
      <script type="text/javascript" src="https://openpay.s3.amazonaws.com/openpay.v1.min.js"></script>
      <script type='text/javascript' src="https://openpay.s3.amazonaws.com/openpay-data.v1.min.js"></script>
    </Head>
  )
}

export default BaseMeta;