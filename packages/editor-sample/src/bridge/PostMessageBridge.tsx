import React, { useEffect, useRef } from 'react';

import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import { resetDocument, useDocument } from '../documents/editor/EditorContext';
import { TEditorConfiguration } from '../documents/editor/core';
import EMPTY_EMAIL_MESSAGE from '../getConfiguration/sample/empty-email-message';

type LoadMessage = {
  type: 'email-builder:load';
  document?: TEditorConfiguration | null;
};

type ChangeMessage = {
  type: 'email-builder:change';
  document: TEditorConfiguration;
  html: string;
};

type ReadyMessage = {
  type: 'email-builder:ready';
};

export default function PostMessageBridge() {
  const document = useDocument();
  const lastSerialized = useRef('');
  const sendTimer = useRef<number | null>(null);

  useEffect(() => {
    if (window.parent === window) return;

    (window as unknown as { __emailBuilderBridge?: boolean }).__emailBuilderBridge = true;
    console.debug('[EmailBuilder] bridge mounted', window.location.origin);

    const handler = (event: MessageEvent<LoadMessage>) => {
      if (event.data && (event.data as { type?: string }).type === 'email-builder:load') {
        console.debug('[EmailBuilder] load message received', event.origin);
      }
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.type !== 'email-builder:load') return;

      const nextDocument = event.data.document || EMPTY_EMAIL_MESSAGE;
      resetDocument(nextDocument);
    };

    window.addEventListener('message', handler);
    window.parent.postMessage({ type: 'email-builder:ready' } as ReadyMessage, window.location.origin);
    console.debug('[EmailBuilder] ready message sent');

    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    if (window.parent === window) return;

    (window as unknown as { __emailBuilderBridge?: boolean }).__emailBuilderBridge = true;
    console.debug('[EmailBuilder] bridge mounted', window.location.origin);

    const serialized = JSON.stringify(document);
    if (serialized === lastSerialized.current) return;

    if (sendTimer.current) {
      window.clearTimeout(sendTimer.current);
    }

    sendTimer.current = window.setTimeout(() => {
      lastSerialized.current = serialized;
      const html = renderToStaticMarkup(document, { rootBlockId: 'root' });
      console.debug('[EmailBuilder] change message sent');
      window.parent.postMessage(
        { type: 'email-builder:change', document, html } as ChangeMessage,
        window.location.origin
      );
    }, 400);

    return () => {
      if (sendTimer.current) {
        window.clearTimeout(sendTimer.current);
      }
    };
  }, [document]);

  return null;
}
