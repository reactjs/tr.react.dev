/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
