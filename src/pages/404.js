/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Layout from 'components/Layout';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const PageNotFound = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Sayfa Bulunamadı</Header>
          <TitleAndMetaTags title="React - Sayfa Bulunamadı" />
          <div css={sharedStyles.markdown}>
            <p>Aradığınız şeyi bulamadık.</p>
            <p>
              Lütfen sizi orijinal URL’e bağlayan sitenin sahibiyle iletişime
              geçin ve bağlantılarının bozuk olduğunu bildirin.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default PageNotFound;
