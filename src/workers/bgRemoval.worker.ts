import { removeBackground } from '@imgly/background-removal';

type RemoveRequest = {
  type: 'remove';
  id: number;
  fileBuffer: ArrayBuffer;
  fileType: string;
};

type ProgressMessage = {
  type: 'progress';
  id: number;
  key: string;
  current: number;
  total: number;
};

type DoneMessage =
  | {
      type: 'done';
      id: number;
      ok: true;
      outBuffer: ArrayBuffer;
      outType: string;
    }
  | {
      type: 'done';
      id: number;
      ok: false;
      error: string;
    };

type WorkerMessage = RemoveRequest;
type WorkerResponse = ProgressMessage | DoneMessage;

// This project tsconfig doesn't include the `webworker` lib, so keep worker globals untyped.
declare const self: any;

self.onmessage = async (ev: MessageEvent<WorkerMessage>) => {
  const msg = ev.data;
  if (msg.type !== 'remove') return;

  try {
    const inputBlob = new Blob([msg.fileBuffer], { type: msg.fileType || 'application/octet-stream' });
    const outBlob = await removeBackground(inputBlob, {
      // Keep the heavy work off the main thread by running inside this worker.
      progress: (key, current, total) => {
        const progressMsg: WorkerResponse = { type: 'progress', id: msg.id, key, current, total };
        self.postMessage(progressMsg);
      },
      // Use default CDN publicPath unless the app overrides it elsewhere.
      device: 'cpu',
      proxyToWorker: false
    });

    const outBuffer = await outBlob.arrayBuffer();
    const doneMsg: WorkerResponse = {
      type: 'done',
      id: msg.id,
      ok: true,
      outBuffer,
      outType: outBlob.type || 'image/png'
    };
    self.postMessage(doneMsg, [outBuffer]);
  } catch (e: any) {
    const doneMsg: WorkerResponse = {
      type: 'done',
      id: msg.id,
      ok: false,
      error: e?.message ? String(e.message) : 'Worker failed to remove background.'
    };
    self.postMessage(doneMsg);
  }
};
