/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

<<<<<<< HEAD
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
=======
export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'Not Found'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>This page doesn’t exist.</P>
          <P>
            If this is a mistake{', '}
            <A href="https://github.com/reactjs/reactjs.org/issues/new">
              let us know
            </A>
            {', '}
            and we will try to fix it!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
>>>>>>> 67721a6f05be591570cfea7eb18da4b40d4dbab8
