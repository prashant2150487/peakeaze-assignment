
import { describe, expect, it, vi, beforeEach } from 'vitest';

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock('react-dom/client', () => ({
  default: { createRoot: createRootMock },
  createRoot: createRootMock,
}));

describe('main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('calls createRoot with the #root element', async () => {
    const rootEl = document.createElement('div');
    rootEl.id = 'root';
    document.body.appendChild(rootEl);

    await import('../main');

    expect(createRootMock).toHaveBeenCalledWith(rootEl);
    expect(renderMock).toHaveBeenCalledTimes(1);

    document.body.removeChild(rootEl);
  });

  it('renders a React.StrictMode tree', async () => {
    const rootEl = document.createElement('div');
    rootEl.id = 'root';
    document.body.appendChild(rootEl);

    const React = await import('react');
    await import('../main');

    const [app] = renderMock.mock.calls[0];
    expect(app.type).toBe(React.StrictMode);

    document.body.removeChild(rootEl);
  });
});
