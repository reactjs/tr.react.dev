/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'Bulunamadı'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>Bu sayfa mevcut değil.</P>
          <P>
            Eğer bu bir hataysa{', '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              bize bildirin
            </A>
            {', '}
            ve düzeltmeye çalışalım!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
